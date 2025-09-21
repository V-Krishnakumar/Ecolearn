import React from 'react';
import { PlayCircle } from 'lucide-react';

interface CustomButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const CustomButton: React.FC<CustomButtonProps> = ({ children, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full py-3 px-6 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg ${className}`}
      style={{
        background: 'linear-gradient(to right, #10b981, #2563eb)',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        fontSize: '16px',
        fontWeight: 'bold'
      }}
    >
      <PlayCircle style={{ width: '20px', height: '20px', marginRight: '8px', display: 'inline-block' }} />
      {children}
    </button>
  );
};

export default CustomButton;
