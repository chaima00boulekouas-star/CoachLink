import React from 'react';
import logoImg from '../assets/logo.png';

const Logo = ({ className = '' }) => {
  return (
    <img
      src={logoImg}
      alt="CoachLink"
      className={`h-14 w-auto object-contain ${className}`}
    />
  );
};

export default Logo;
