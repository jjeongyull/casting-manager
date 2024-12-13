import React from 'react';


const InputField = ({ type, name, placeholder, value, onChange, className }) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`input-field ${className}`}
    />
  );
};

export default InputField