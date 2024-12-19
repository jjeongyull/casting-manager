import React, {useEffect} from 'react';

function AlertComponent({ onClose, mainText, subText }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-99">
      <div className="relative bg-gray-800 p-8 rounded-xl shadow-2xl text-white w-96 animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-100 transition duration-200 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-blue-400">{mainText}</h2>
          {subText && <p className="text-gray-300 text-sm mb-6">{subText}</p>}
        </div>
      </div>
    </div>
  )
}

export default AlertComponent