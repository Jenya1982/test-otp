import axios from 'axios';
import assert from 'assert';
import pkg from 'pg';
const { Pool } = pkg;
const { insertOTP, getOTPByEmail, deleteOTP } = require('./database.js');

describe('Test Cases', () => {
    describe('Frontend Tests', () => {
        it('Should send OTP email when "Receive OTP" button is clicked', async () => {
            const email = 'jenya191@gmail.com';
            const expectedUrl = 'http://localhost:3001/api/send-otp';
            axios.post = jest.fn().mockResolvedValue({ status: 200 });

            await handleEmailSubmit();

            expect(axios.post).toHaveBeenCalledWith(expectedUrl, { email });
        });

        it('Should verify OTP when "Submit" button is clicked', async () => {
            const email = 'jenya191@gmail.com';
            const otp = '123456';
            const expectedUrl = 'http://localhost:3001/api/verify-otp';
            axios.post = jest.fn().mockResolvedValue({ data: { message: 'everything is ok' } });

            await handleOtpSubmit();

            expect(axios.post).toHaveBeenCalledWith(expectedUrl, { email, otp });
        });
    });

    describe('Server Tests', () => {
        const app = require('./server.js');

        it('Should receive OTP email and send response', async () => {
            const req = { body: { email: 'jenya191@gmail.com' } };
            const res = {
                sendStatus: jest.fn().mockReturnThis(),
                status: jest.fn().mockReturnThis(),
                send: jest.fn().mockReturnThis(),
            };

            await app.post('/api/send-otp', req, res);

            expect(res.sendStatus).toHaveBeenCalledWith(200);
        });

        it('Should verify OTP and send appropriate response', async () => {
            const req = { body: { email: 'jenya191@gmail.com', otp: '123456' } };
            const res = { json: jest.fn().mockReturnThis() };

            await app.post('/api/verify-otp', req, res);

            expect(res.json).toHaveBeenCalledWith({ message: 'everything is ok' });
        });
    });

    describe('Database Tests', () => {
        const pool = new Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'testotp',
            password: 'A317982Ba@',
            port: 5432,
        });

        it('Should insert OTP into database', async () => {
            const email = 'jenya191@gmail.com';
            const otp = '123456';
            const timestamp = new Date().toISOString();

            await insertOTP(email, otp);

            const result = await pool.query('SELECT * FROM otps WHERE email = $1', [email]);
            assert.strictEqual(result.rowCount, 1);
        });

        it('Should retrieve OTP from database', async () => {

            const email = 'jenya191@gmail.com';

            const otpData = await getOTPByEmail(email);


            assert.strictEqual(otpData.email, email);
        });

        it('Should delete OTP from database', async () => {

            const email = 'jenya191@gmail.com';

            await deleteOTP(email);

            const result = await pool.query('SELECT * FROM otps WHERE email = $1', [email]);
            assert.strictEqual(result.rowCount, 0);
        });
    });
});
