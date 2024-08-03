import emailjs from '@emailjs/browser';

export const sendEmail = async (email: string, templateId: string, dynamicParams: { [key: string]: string }) => {
    const generateOTP = Math.floor(Math.random() * 1000000).toString();

    // Default template parameters
    const templateParams = {
        message: generateOTP,
        to_email: email,
        ...dynamicParams // Spread the dynamic parameters
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
            const olympdPrefix = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');
            olympdPrefix.code = generateOTP;
            localStorage.setItem('olympd_prefix', JSON.stringify(olympdPrefix));
        }
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

export default sendEmail;
