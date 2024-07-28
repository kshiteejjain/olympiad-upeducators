import { useState } from 'react';
import emailjs from '@emailjs/browser';
import Button from '../../components/Buttons/Button';

const SendEmail = () => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Directly send email without Firestore check
            emailjs.send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_OLYMPIAD_EMAIL_TEMPLATE, {
                message: 'Test Olympiad',
                to_email: 'kshiteejjain@gmail.com, ankushb@upeducators.com',
            }, import.meta.env.VITE_EMAILJS_API_KEY)
                .then(response => {
                    console.log('SUCCESS!', response);
                    setLoading(false);
                    // Perform any additional actions here, like resetting the form or redirecting
                }, error => {
                    alert(`FAILED... ${error}`);
                    setLoading(false);
                });
        } catch (error) {
            alert('Error sending email: ' + error);
            setLoading(false);
        }
    };
    return (
        <>
            <form onSubmit={handleSubmit}>
                <Button title='Send Email' type={'button'} />
            </form>
            {loading && 'Loading'}
        </>
    )
};

export default SendEmail;
