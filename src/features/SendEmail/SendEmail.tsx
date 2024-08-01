// src/utils/sendEmail.js
import emailjs from '@emailjs/browser';

export const sendEmail = async (email: any) => {
    const generateOTP = Math.floor(Math.random() * 1000000).toString();

    try {
        await emailjs.send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_OLYMPIAD_EMAIL_TEMPLATE,
            {
                message: generateOTP,
                to_email: email,
            },
            import.meta.env.VITE_EMAILJS_API_KEY
        );
        localStorage.setItem('olympd_prefix', JSON.stringify({ code: generateOTP }));
        console.log('Email sent successfully.');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

export default sendEmail;
