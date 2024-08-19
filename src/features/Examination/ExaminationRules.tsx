import { useNavigate } from "react-router-dom";
import Button from "../../components/Buttons/Button";

const ExaminationRules = () => {
    const navigate = useNavigate();
    return (
        <div className="content">
            <h2>Olympiad Examination</h2>
            <div className="exam-rules">
                <div className="exam-rules-section">
                    <h3>Do's:</h3>
                    <ul>
                        <li><strong>Use a Laptop or Computer with a Webcam:</strong> Ensure you have a functioning laptop or desktop computer with a working webcam and microphone, as these are required for the exam.</li>
                        <li><strong>Test Your Equipment:</strong> Before the exam begins, check that your internet connection, webcam, and microphone are all working properly.</li>
                        <li><strong>Monitor Your Time:</strong> Use a timer or keep track of time according to the exam's schedule to ensure you complete all sections.</li>
                        <li><strong>Follow On-Screen Instructions:</strong> Pay attention to and follow all prompts and guidelines provided on the exam platform.</li>
                        <li><strong>Maintain Proper Conduct:</strong> Adhere to the exam’s code of conduct, including not communicating with anyone else and not using any external aids.</li>
                    </ul>
                </div>
                <div className="exam-rules-section">
                    <h3>Don'ts:</h3>
                    <ul>
                        <li><strong>Don’t Use Unauthorized Devices:</strong> Avoid using mobile phones, tablets, or other devices that are not allowed during the exam.</li>
                        <li><strong>Don’t Cheat or Seek Unauthorized Help:</strong> Do not attempt to access unauthorized resources or get assistance from others.</li>
                        <li><strong>Don’t Alter Exam Settings:</strong> Avoid changing any settings on the exam platform that are not directed by the instructions.</li>
                        <li><strong>Don’t Disregard Technical Issues:</strong> If you experience technical problems, report them immediately according to the instructions provided by the exam proctor or support team.</li>
                        <li><strong>Don’t Ignore the Webcam:</strong> Keep your webcam on and positioned correctly as required by the exam guidelines to ensure monitoring compliance.</li>
                    </ul>
                </div>
            </div>
            <div className="start-exam-cta">
                <Button type="button" title="Start Exam" onClick={() => navigate('/Examination')} />
            </div>
        </div>
    )
};
export default ExaminationRules;