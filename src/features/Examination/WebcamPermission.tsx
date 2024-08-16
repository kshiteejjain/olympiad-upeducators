import { useEffect, useRef, useState } from 'react';
import Recording from '../../assets/recording-icon.gif';

const WebcamComponent = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [hasAccess, setHasAccess] = useState<boolean>(false);

    useEffect(() => {
        const startCamera = async () => {
            try {
                // Request access to camera and microphone
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });

                // Set the stream to the video element
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }

                // Update state to indicate access granted
                setHasAccess(true);
            } catch (err) {
                console.error('Error accessing media devices.', err);
                setHasAccess(false);
            }
        };

        startCamera();

        // Clean up the stream on component unmount
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                const tracks = stream.getTracks();

                tracks.forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div>
            <div className='webcam-container'>
                {hasAccess ? (
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                        />
                        <img src={Recording} className='recording' alt="Recording" />
                    </>
                ) : (
                    <p>Please give access to camera and mic...</p>
                )}
            </div>
        </div>
    );
};

export default WebcamComponent;
