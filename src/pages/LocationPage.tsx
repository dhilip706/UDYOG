import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LocationScreen } from '../components/location/LocationScreen';

export const LocationPage: React.FC = () => {
  const navigate = useNavigate();

  const handleComplete = () => {
    // After location and language confirmation, navigate directly to Login
    navigate('/login');
  };

  return <LocationScreen onComplete={handleComplete} />;
};
