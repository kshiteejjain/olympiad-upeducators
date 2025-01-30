import { useNavigate } from "react-router-dom";
import CheckInternet from "../../utils/CheckInternet";
import Button from "../../components/Buttons/Button";
import { useEffect, useState } from "react";

const CheckExamSystem = () => {
    const [olympaidDate, setOlympaidDate] = useState('1 February, 2025 at 5 PM IST');
    const item = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');
    const navigate = useNavigate();

    const openExamWindow = () => {
        navigate('/CapturePhotoDemoExam')
    };
    useEffect(() => {
    if(item?.olympiadName === 'e25'){
        setOlympaidDate('15 February, 2025 at 5 PM IST')
    }
    },[])
    return (
        <div className="content">
            <h2>Check Your System Guidelines</h2>
            <p><strong>Please Read all the instructions carefully and click on ‘Next’ Button below.</strong></p>
            <div className="exam-rules">
                <p><strong>1. This is a Demo Exam</strong>: This is a System Check/Demo Exam. In this, we have given you 5 random questions to check your system settings and familiarize yourself with the exam interface to ensure a smooth experience during the main exam. This is a MUST DO Process before starting the Olympiad exam.</p>
                <p><strong>2. Exam Start Time</strong>: Click on 'Start Exam' button on {olympaidDate} to start the Olympiad Exam. Do not attempt to start the exam before this time.</p>
                <p><strong>3. Use a Laptop or Computer with a Webcam</strong>: Ensure you have a functioning Laptop or Desktop with a working webcam and microphone. These are mandatory for the exam.</p>
                <p><strong>4. Keep a Govt-issued ID Ready</strong>: Have a valid government-issued ID (Driving License, Passport, Aadhar, etc.) on hand before starting the exam.</p>
                <p><strong>5. Recommended Browser</strong>: Use Google Chrome or Microsoft Edge browser only to give the exam.</p>
                <p><strong>6. Monitor Your Time</strong>: Use the countdown timer available on the exam portal or track the time manually to ensure you finish within the allotted time.</p>
                <p><strong>7. Avoid System Disconnection</strong>: Ensure your system remains connected to the internet. In the event of a power outage or internet disconnection, re-open the exam portal and click ‘Start Exam’ again if the page was closed.</p>
                <p><strong>8. Power/Network Interruptions</strong>: upEducators is not responsible for disruptions due to power outages, network issues, or other interruptions.</p>
                <p><strong>9. Ensure Accurate Device Settings</strong>: Make sure the date and time on your device are accurate before starting the exam.</p>
                <p><strong>10. Don’t Switch Windows</strong>: Do not click outside the exam window or switch to other tabs during the exam.</p>
            </div>
            <div className="start-exam-cta">
                <Button type="button" title="Next" onClick={openExamWindow} />
                <CheckInternet />
            </div>
        </div>
    );

};
export default CheckExamSystem;