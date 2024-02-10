import pkg from 'pg';

const { Pool } = pkg;
const pool = new Pool({
    user: 'your_db_user',
    host: 'your_db_host',
    database: 'your_db_name',
    password: 'your_db_pass',
    port: 5432, 
});

async function insertOTP(email, otp) {
    const timestamp = new Date().toISOString();
    console.log('Email:', email);
    const query = {
        text: 'INSERT INTO otps(email, otp, timestamp) VALUES($1, $2, $3)',
        values: [email, otp, timestamp],
    };

    try {
        await pool.query(query);
    } catch (error) {
        console.error('Error inserting OTP:', error);
        throw error;
    }
}

async function getOTPByEmail(email) {
    console.log('Email:', email);
    const query = {
        text: 'SELECT * FROM otps WHERE email = $1',
        values: [email],
    };

    try {
        const result = await pool.query(query);
        const otpData = result.rows[0]; 
        console.log('OTP data:', result); 
        return otpData;
    } catch (error) {
        console.error('Error retrieving OTP:', error);
        throw error;
    }
}


async function deleteOTP(email) {
    const query = {
        text: 'DELETE FROM otps WHERE email = $1',
        values: [email],
    };

    try {
        await pool.query(query);
    } catch (error) {
        console.error('Error deleting OTP:', error);
        throw error;
    }
}

export { insertOTP, getOTPByEmail, deleteOTP };
