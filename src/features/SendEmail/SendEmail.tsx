import emailjs from '@emailjs/browser';

export const sendEmail = async (email: string, templateId: string) => {
    const generateOTP = Math.floor(Math.random() * 1000000).toString();
    
    const templateParams = {
        message: generateOTP,
        to_email: email,
    };

    try {
        await emailjs.send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            templateId,
            templateParams,
            import.meta.env.VITE_EMAILJS_API_KEY
        );

        console.log('Email sent successfully.');

        // Conditionally handle OTP storage based on template ID
        if (templateId === import.meta.env.VITE_OLYMPIAD_EMAIL_TEMPLATE) {
            localStorage.setItem('olympd_prefix', JSON.stringify({ code: generateOTP }));
        }
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

export default sendEmail;
