import express from 'express';
import nodemailer from 'nodemailer';
import fetch from 'node-fetch';
import cors from 'cors';
import { insertOTP, getOTPByEmail, deleteOTP } from './database.js';


const app = express();
app.use(express.json());
app.use(cors())
const corsOptions = {
    origin: ['localhost:3000', '127.0.0.1:3000'],
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.post('/api/send-otp', async (req, res) => {
    const email = req.body.email;
    const otp = await generateOtp();
    if (otp) {
        await insertOTP(email, otp);
        await sendEmail(email, otp);
        res.sendStatus(200);
    } else {
        res.status(500).send('Failed to generate OTP');
    }
});

async function verifyOTP(otpData, enteredOTP) {
    if (!otpData) {
        return false; 
    }

    const otpTimestamp = new Date(otpData.timestamp);
    const currentTimestamp = new Date();
    const otpAgeInMinutes = (currentTimestamp - otpTimestamp) / (1000 * 60);

    if (otpData.otp === enteredOTP && otpAgeInMinutes <= 5) {
        return true;
    }

    return false;
}

app.post('/api/verify-otp', async (req, res) => {
    console.log('Request Body:', req.body); 
    const otp = req.body.otp.trim();
    const email = req.body.email;
    console.log('Email:', email); 
    const storedOTP = await getOTPByEmail(email);
    console.log('Stored OTP:', storedOTP); 
    console.log('Entered OTP:', otp); 
    
    if (!storedOTP) {
        res.json({ message: 'Invalid OTP or OTP expired' });
        return;
    }

    const isValidOTP = await verifyOTP(storedOTP, otp);
    const currentTimestamp = new Date();
    const otpTimestamp = new Date(storedOTP.timestamp);
    const otpAgeInMinutes = (currentTimestamp - otpTimestamp) / (1000 * 60);

    if (!isValidOTP) {
        res.json({ message: 'Incorrect OTP. Please try again.' });
    } else if (otpAgeInMinutes > 5) {
        await deleteOTP(email); 
        res.json({ message: `Sorry, looks like Your otp expired (5 minutes) try one more time` });
    } else {
        await deleteOTP(email); 
        res.json({ message: 'everything is ok' });
    }
});



async function generateOtp() {
    try {
        const cities = ['washington', 'new york', 'tokyo']
        const apiKey = 'c5f52ad5faab4e1a8e1212714240802';
        const weatherDataPromises = cities.map(city =>
            fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`)
                .then(response => {
                    if (!response.ok) throw new Error(`Failed to fetch weather data for ${city}`);
                    return response.json(); 
                })
                .then(data => {
                    const temperature = data.current.temp_c.toFixed();
                    const formattedTemperature = temperature < 10 ? '0' + temperature : temperature;
                    const otp = formattedTemperature.replace('-', '');
                    return otp;
                })
                .catch(error => {
                    console.error(`Error fetching weather data for ${city}:`, error);
                    return null;
                })
        );

        const weatherTemperatures = await Promise.all(weatherDataPromises);
        const otp = weatherTemperatures.join('');
        return otp;
    } catch (error) {
        console.error('Error generating OTP:', error);
        return null;
    }
}

async function sendEmail(email, otp) {
    const myEmail = 'your_email';
    try {
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: myEmail,
                pass: 'generate on google 2-step verification on GoogleOne acc' 
            }
        });

        let mailOptions = {
            from: myEmail,
            to: email,
            subject: 'Your OTP',
            text: `Your OTP is: ${otp}`
        };

        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}


app.listen(3001);
console.log('Server listening on port 3001');
