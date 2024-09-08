// src/components/UploadProfile.tsx
import { useRef, useState, useEffect } from 'react';
import Croppie from 'croppie';  // Use default import
import Close from '../../assets/close.svg';

import 'croppie/croppie.css';
import './UploadProfile.css';

type Props = {
  onClose: () => void,
  onImageCropped: (base64: string) => void,
}

const UploadProfile = ({ onClose, onImageCropped }: Props) => {
  const [isCropping, setIsCropping] = useState(false);
  const croppieRef = useRef<Croppie | null>(null);

  useEffect(() => {
    const croppieElement = document.getElementById('croppie');
    if (croppieElement) {
      const croppie = new Croppie(croppieElement, {
        showZoomer: true,
        enableOrientation: true,
        mouseWheelZoom: 'ctrl',
        viewport: { width: 300, height: 300, type: 'circle' },
        boundary: { width: '300px', height: '300px' },
      });

      croppieRef.current = croppie;
    }

    return () => {
      croppieRef.current?.destroy();
    };
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    const file = e.target.files?.[0];
    if (file) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        croppieRef.current?.bind({ url: reader.result as string });
        setIsCropping(true);
      };
    }
  };

  const handleCrop = () => {
    croppieRef.current?.result('base64').then((base64: string) => {
      onImageCropped(base64);
      setIsCropping(false);
      onClose();
    });
  };

  return (
    <div className="upload-profile-popup">
      <div className="croppie-wrapper">
        <h2>Upload Profile Picture</h2>
        <span className='close' onClick={onClose}> <img src={Close} alt="Close" /> </span>
        <div id="croppie"></div>
        <input type="file" accept="image/*" onChange={handleFileUpload} />
        {isCropping && (
          <div className='cta'>
            <button onClick={handleCrop}>Upload</button>
            <button onClick={onClose}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadProfile;
