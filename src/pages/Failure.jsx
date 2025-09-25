import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Failure() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 7000); // redirect after 7 seconds

    return () => clearTimeout(timer); // cleanup on unmount
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-50 px-4">
      <h1
        className="text-3xl sm:text-4xl font-extrabold text-red-600 drop-shadow-lg mb-8
                   animate-fadeInScale"
        style={{ animationTimingFunction: 'ease-in-out' }}
      >
        Payment Failed!!
      </h1>
      <button
        onClick={() => navigate('/')}
        className="px-8 py-3 rounded-full bg-red-600 hover:bg-red-700 transition text-white font-semibold text-lg shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400 animate-fadeIn"
      >
        Back to Home
      </button>

      <style>{`
        @keyframes fadeInScale {
          0% { opacity: 0; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fadeInScale {
          animation-name: fadeInScale;
          animation-duration: 0.9s;
          animation-fill-mode: forwards;
        }
        @keyframes fadeIn {
          from {opacity: 0; transform: translateY(16px);}
          to {opacity: 1; transform: translateY(0);}
        }
        .animate-fadeIn {
          animation: fadeIn 0.9s 0.4s both;
        }
      `}</style>
    </div>
  );
}









