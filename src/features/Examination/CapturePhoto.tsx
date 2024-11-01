import { useCallback, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import Button from "../../components/Buttons/Button";
import PermissionImage from '../../assets/permissionImage.png';
import PhotoIdSample from '../../assets/photoId-sample.png';

const CapturePhoto = () => {
    const webcamRef = useRef<Webcam | null>(null);
    const [hasAccess, setHasAccess] = useState<boolean>(false);
    const [photoSrc, setPhotoSrc] = useState<string | null>(null);
    const [idProofSrc, setIdProofSrc] = useState<string | null>(null);
    const [photoCaptured, setPhotoCaptured] = useState<boolean>(false);
    const [idProofCaptured, setIdProofCaptured] = useState<boolean>(false);
    const [showCamera, setShowCamera] = useState<boolean>(true); // Controls camera visibility
    const [capturingIdProof, setCapturingIdProof] = useState<boolean>(false);
    const [cameraPermissionRequested, setCameraPermissionRequested] = useState<boolean>(false);
    const navigate = useNavigate();

    const capturePhoto = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            setPhotoSrc(imageSrc || null);
            setPhotoCaptured(true);
            setShowCamera(false); // Hide camera after capturing photo
        }
    }, [webcamRef]);

    const captureIdProof = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            setIdProofSrc(imageSrc || null);
            setIdProofCaptured(true);
            setShowCamera(false); // Hide camera after capturing ID proof
        }
    }, [webcamRef]);

    useEffect(() => {
        const startCamera = async () => {
            try {
                await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                setHasAccess(true);
                setCameraPermissionRequested(false);
            } catch (err) {
                console.error('Error accessing media devices.', err);
                setHasAccess(false);
                setCameraPermissionRequested(true);
            }
        };

        startCamera();
    }, []);

    const openSettings = useCallback(() => {
        alert('To enable camera access, please check your browser settings.');
    }, []);

    const requestCameraPermission = () => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then(() => {
                setHasAccess(true);
                setCameraPermissionRequested(false);
            })
            .catch((err) => {
                console.error('Error requesting camera permission.', err);
                if (err.name === 'NotAllowedError' || err.name === 'NotFoundError') {
                    openSettings(); // Call openSettings when permission is denied or device not found
                }
            });
    };

    const handleNextClick = () => {
        setCapturingIdProof(true);
        setShowCamera(true); // Show camera for ID proof capture
        setPhotoCaptured(false); // Reset photo capture state
    };

    const handleRetakePhoto = () => {
        setPhotoCaptured(false);
        setPhotoSrc(null);
        setShowCamera(true); // Show camera again for retake
    };

    const handleRetakeIdProof = () => {
        setIdProofCaptured(false);
        setIdProofSrc(null);
        setCapturingIdProof(true); // Continue to capture ID proof
        setShowCamera(true); // Show camera again for retake
    };

    const openExamWindow = () => {
        const examWindow = window.open(
            '/#/Examination',
            '_blank',
            'width=' + window.screen.width + ',height=' + window.screen.height,
        );

        if (examWindow) {
            examWindow.onload = () => {
                examWindow.document.addEventListener('contextmenu', (e) => e.preventDefault());
                examWindow.document.addEventListener('keydown', (e) => {
                    if (e.ctrlKey && (e.key === 'c' || e.key === 'v')) {
                        e.preventDefault();
                    }
                });
                examWindow.document.addEventListener('mousedown', (e) => {
                    if (e.button === 2) e.preventDefault();
                });
                examWindow.document.oncontextmenu = () => false;
                examWindow.onkeydown = (e) => {
                    if (e.key === 'PrintScreen') {
                        e.preventDefault();
                    }
                };
                examWindow.addEventListener('visibilitychange', () => {
                    if (document.hidden) {
                        console.log('Please do not navigate away from the exam page.');
                    }
                });
                navigate('/ThankYou');
            };
        }
    };

    return (
        <div className='capture-image'>
            {hasAccess ? (
                <>
                    {showCamera && !capturingIdProof && (
                        <div className='live-camera'>
                            <p>Capture</p>
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                width="100%"
                                height="100%"
                                videoConstraints={{ facingMode: 'user' }}
                            />
                            <div className='live-camera-cta'>
                                {!photoCaptured && (
                                    <Button type="button" title='Capture Photo' onClick={capturePhoto} />
                                )}
                            </div>
                        </div>
                    )}

                    {photoSrc && !capturingIdProof && (
                        <div className='captured-photo'>
                            <p>Captured Photo</p>
                            <img src={photoSrc} alt="Captured Photo" />
                            <div className='live-camera-cta'>
                                {photoCaptured && (
                                    <Button type="button" isSecondary title='Retake Photo' onClick={handleRetakePhoto} />
                                )}
                                <Button type="button" title="Next" onClick={handleNextClick} />
                            </div>
                        </div>
                    )}
                    {capturingIdProof && showCamera && (<div className='photoIdSample'> <p>Sample Photo</p> <img src={PhotoIdSample} /> </div> )}
                    {capturingIdProof && showCamera && (
                        <div className='live-camera'>
                            <p>Capture</p>
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                width="100%"
                                height="100%"
                                videoConstraints={{ facingMode: 'user' }}
                            />
                            <div className='live-camera-cta'>
                                {!idProofCaptured && (
                                    <Button type="button" title='Capture ID Proof' onClick={captureIdProof} />
                                )}
                            </div>
                        </div>
                    )}

                    {idProofSrc && (
                        <div className='captured-photo'>
                            <p>Captured ID Proof</p>
                            <img src={idProofSrc} alt="Captured ID Proof" />
                            <div className='live-camera-cta'>
                                {idProofCaptured && (
                                    <Button type="button" isSecondary title='Retake ID Proof' onClick={handleRetakeIdProof} />
                                )}
                                <Button type="button" title="Start Exam" onClick={openExamWindow} />
                            </div>

                        </div>
                    )}
                </>
            ) : (
                <div className='access-permission'>
                    <p>Camera access was denied. Please enable camera permissions in your browser settings.</p>
                    <img src={PermissionImage} alt="Permission Needed" />
                    {cameraPermissionRequested && (
                        <Button type="button" title="Request Camera Permission" onClick={requestCameraPermission} />
                    )}
                </div>
            )}
        </div>
    );
};

export default CapturePhoto;
