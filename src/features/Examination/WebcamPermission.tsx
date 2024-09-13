import { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import Recording from '../../assets/recording-icon.gif';

const WebcamComponent = () => {
    // Typing the ref for react-webcam
    const webcamRef = useRef<Webcam | null>(null);
    const [hasAccess, setHasAccess] = useState<boolean>(false);

    useEffect(() => {
        const startCamera = async () => {
            try {
                // Check if the user has given access to the camera
                await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                setHasAccess(true);
            } catch (err) {
                console.error('Error accessing media devices.', err);
                setHasAccess(false);
            }
        };

        startCamera();

        // Cleanup function (optional)
        return () => {
            // react-webcam handles the cleanup internally
        };
    }, []);

    return (
        <div>
            <div className='webcam-container'>
                {hasAccess ? (
                    <>
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width="100%"
                            height="100%"
                            videoConstraints={{ facingMode: 'user' }}
                        />
                        <img src={Recording} className='recording' alt="Recording" />
                    </>
                ) : (
                    <p>Please give access to the camera...</p>
                )}
            </div>
        </div>
    );
};

export default WebcamComponent;
