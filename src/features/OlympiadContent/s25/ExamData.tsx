import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { firestore } from '../../../utils/firebase';
import { getDocs, collection, query, where } from 'firebase/firestore';
import Button from "../../../components/Buttons/Button";

const ExamData = ({ onCheckDemoExam }: any) => {
    const [showStartExamButton, setShowStartExamButton] = useState<boolean>(false);
    const [emailFound, setEmailFound] = useState<boolean>(false);
    const loggedInUserEmail = JSON.parse(localStorage.getItem('olympd_prefix') || '{}').email;
    const olympiadName = JSON.parse(localStorage.getItem('olympd_prefix') || '{}').olympiadName;
    const adminEmails = [
        'kshiteejjain@gmail.com',
        'anjalis@upeducators.com',
        'academics@upeducators.com',
        'namank@upeducators.com',
        'ankushb@upeducators.com'
    ];
    const isAdmin = adminEmails.includes(loggedInUserEmail);
    const navigate = useNavigate();
    useEffect(() => {
        const checkUserEmail = async () => {
            const olympdPrefixData = JSON.parse(localStorage.getItem('olympd_prefix') || '{}');
            const userEmail = olympdPrefixData.email;
            if (userEmail) {
                const q = query(collection(firestore, `${olympiadName}Result`), where('email', '==', userEmail));
                const querySnapshot = await getDocs(q);
                setEmailFound(!querySnapshot.empty);
            }
        };
        checkUserEmail();
    }, [olympiadName]);

    const handleStartExamClick = () => {
        navigate('/ExaminationRules');
        setShowStartExamButton(false);
    };

    const renderExamButton = () => (
        emailFound ? (
            <p className="startedNote">You have already completed the exam.</p>
        ) : (
            <>
               <p>Exam Date: 26/04/2025, 5:00pm IST</p>
                <div className="cta">
                    <Button onClick={handleStartExamClick} isDisabled={!showStartExamButton} title="Start Final Exam" type="button" />
                    {isAdmin && (
                        <Button onClick={handleStartExamClick} title="Start Exam - Admin" type="button" />
                    )}
                </div>
                <p>Click on the Start Final Exam button between 5 pm and 7 pm IST. This is the final exam and Exam can be attempted only once</p>
            </>
        )
    );

    return (
        <div className='how-it-works content'>
            <h3>Check Exam System Guidelines</h3>
            <div className='works-card'>
                <div className='works-card-title'>
                    <div className='works-card-description'>
                        <h1>Check Exam System</h1>
                        <p>1. You will be able to write the Exam only on Laptop/Desktop and NOT MOBILE.</p>
                        <p>2. Check your system setup, including camera and microphone, and familiarize yourself with the exam interface to ensure a smooth experience during the main exam</p>
                        <div className='cta'>
                            <Button title='Check Demo Exam' type='button' onClick={onCheckDemoExam} />
                        </div>
                    </div>
                </div>
            </div>
            <div className='works-card'>
                <div className='works-card-title'>
                    <div className='works-card-description'>
                        <h1> Start Exam</h1>
                        {renderExamButton()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamData;
