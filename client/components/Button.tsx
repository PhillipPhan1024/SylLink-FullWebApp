import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color: 'blue' | 'green';
}

const Button: React.FC<ButtonProps> = ({ color, children, ...props }) => {
  const colorClass = color === 'blue' ? 'button-blue' : 'button-green';
  
  return (
    <button className={`button ${colorClass}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
