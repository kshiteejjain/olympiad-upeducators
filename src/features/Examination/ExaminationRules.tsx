import { useNavigate } from "react-router-dom";
import Button from "../../components/Buttons/Button";
import CheckInternet from "../../utils/CheckInternet";
import { fetchUserOlympiadData } from "../../utils/firebaseUtils";

const ExaminationRules = () => {
    const navigate = useNavigate();

    const olympdPrefix = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');

    const fetchAndUpdateOlympiadData = async () => {
        if (!olympdPrefix.email) return console.warn('No email found in olympd_prefix');

        try {
            const usersData = await fetchUserOlympiadData(olympdPrefix.email);
            const olympiads = Array.from(new Set(usersData.flatMap(user => user.olympiad || [])));
            if (olympiads.length > 0) {
                const updatedOlympdPrefix = {
                    ...olympdPrefix,
                    olympiad: olympiads,
                };
                localStorage.setItem('olympd_prefix', JSON.stringify(updatedOlympdPrefix));
                return olympiads; // Return the fetched olympiad names
            }
        } catch (err) {
            alert('Error fetching registered olympiad name');
        } finally {
            console.log('Finally');
        }
        return []; // Return an empty array if no olympiad found
    };

    const openExamWindow = async () => {
        const olympiads = await fetchAndUpdateOlympiadData(); // Get the fetched olympiad names
        navigate('/CapturePhoto');
        
        const item = localStorage.getItem('olympd_prefix');
        if (item) {
            const data = JSON.parse(item);
            data.olympiad = olympiads; // Use fetched olympiad names
            localStorage.setItem('olympd_prefix', JSON.stringify(data));
        }
    };

    return (
        <div className="content">
            <h2>Exam Guidelines</h2>
            <p><strong>Please Read all the instructions carefully and click on ‘Next’ Button below</strong></p>
            <div className="exam-rules">
                <p><strong>1. Use a Laptop or Computer with a Webcam</strong>: Ensure you have a functioning Laptop or Desktop with a working webcam and microphone. These are mandatory for the exam.</p>
                <p><strong>2. Keep a Govt-issued ID Ready</strong>: Have a valid government-issued ID (Driving License, Passport, Aadhar, etc.) on hand before starting the exam.</p>
                <p><strong>3. Monitor Your Time</strong>: Use the countdown timer available on the exam portal or track the time manually to ensure you finish within the allotted time.</p>
                <p><strong>4. Avoid System Disconnection</strong>: Ensure your system remains connected to the internet. In the event of a power outage or internet disconnection, re-open the exam portal and click ‘Start Exam’ again if the page was closed.</p>
                <p><strong>5. Power/Network Interruptions</strong>: upEducators is not responsible for disruptions due to power outages, network issues, or other interruptions.</p>
                <p><strong>6. Ensure Accurate Device Settings</strong>: Make sure the date and time on your device are accurate before starting the exam.</p>
                <p><strong>7. Don’t Switch Windows</strong>: Do not click outside the exam window or switch to other tabs during the exam.</p>
                <p><strong>8. Don’t Cheat or Seek Unauthorized Help</strong>: Do not attempt to access unauthorized resources or seek help from others.</p>
                <p><strong>9. Don’t Turn Off the Webcam</strong>: Ensure your webcam remains on and properly positioned throughout the exam to comply with monitoring requirements.</p>
            </div>
            <div className="start-exam-cta">
                <Button type="button" title="Next" onClick={openExamWindow} />
                <CheckInternet />
            </div>
        </div>
    );
};

export default ExaminationRules;
