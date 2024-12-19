import React from 'react';

function Confirm({ onConfirm, onClose, mainText, subText }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
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
        <div className="flex justify-center gap-4">

          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 focus:ring focus:ring-blue-300 transition-all"
          >
            확인
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-700 focus:ring focus:ring-gray-400 transition-all"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

export default Confirm;