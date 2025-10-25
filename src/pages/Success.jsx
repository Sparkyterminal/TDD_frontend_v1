// import React, { useEffect, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// // import { clearCart } from '../reducers/cart';
// import Confetti from 'react-confetti';

// export default function Success() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
  
//   // To get window size for confetti full screen coverage
//   const [windowDimension, setWindowDimension] = useState({ width: window.innerWidth, height: window.innerHeight });

//   useEffect(() => {
//     // dispatch(clearCart());

//     const handleResize = () => {
//       setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
//     };
//     window.addEventListener('resize', handleResize);

//     const timer = setTimeout(() => {
//       navigate('/');
//     }, 7000); // Redirect after 7 seconds

//     return () => {
//       window.removeEventListener('resize', handleResize);
//       clearTimeout(timer);
//     };
//   }, [dispatch, navigate]);

//   return (
//     <div className="flex items-center justify-center h-screen bg-green-50 flex-col relative overflow-hidden">
//       <Confetti width={windowDimension.width} height={windowDimension.height} />
//       <h1
//         className="text-3xl sm:text-4xl font-extrabold text-green-600 drop-shadow-lg mb-8 
//                    animate-success-pop z-10 relative"
//       >
//         Payment Successful
//       </h1>
//       <button
//         onClick={() => navigate('/')}
//         className="px-8 py-3 rounded-full bg-green-600 hover:bg-green-700 transition text-white font-semibold text-lg shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400 animate-fadeIn z-10 relative"
//       >
//         Back to Home
//       </button>
//       <style>
//         {`
//           @keyframes success-pop {
//             0% { opacity: 0; transform: scale(0.95); }
//             70% { opacity: 1; transform: scale(1.05); }
//             100% { opacity: 1; transform: scale(1); }
//           }
//           .animate-success-pop {
//             animation: success-pop 0.9s cubic-bezier(.3,1.5,.3,1) both;
//           }
//           @keyframes fadeIn {
//             from { opacity: 0; transform: translateY(16px);}
//             to { opacity: 1; transform: translateY(0);}
//           }
//           .animate-fadeIn {
//             animation: fadeIn 0.9s 0.4s both;
//           }
//         `}
//       </style>
//     </div>
//   );
// }
// Success.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../../config';
import Confetti from 'react-confetti';

export default function Success() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.value);
  const isAdmin = ROLES.ADMIN === user?.role;
  
  // To get window size for confetti full screen coverage
  const [windowDimension, setWindowDimension] = useState({ 
    width: window.innerWidth, 
    height: window.innerHeight 
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);

    const timer = setTimeout(() => {
      if (isAdmin) {
        navigate('/dashboard/viewallusers', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }, 7000); // Redirect after 7 seconds

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [dispatch, navigate, isAdmin]);

  const handleBackClick = () => {
    if (isAdmin) {
      navigate('/dashboard/viewallusers', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-green-50 flex-col relative overflow-hidden">
      <Confetti width={windowDimension.width} height={windowDimension.height} />
      <h1
        className="text-3xl sm:text-4xl font-extrabold text-green-600 drop-shadow-lg mb-8 
                   animate-success-pop z-10 relative"
      >
        Payment Successful
      </h1>
      <button
        onClick={handleBackClick}
        className="px-8 py-3 rounded-full bg-green-600 hover:bg-green-700 transition text-white font-semibold text-lg shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400 animate-fadeIn z-10 relative"
      >
        {isAdmin ? 'Back to Dashboard' : 'Back to Home'}
      </button>
      <style>
        {`
          @keyframes success-pop {
            0% { opacity: 0; transform: scale(0.95); }
            70% { opacity: 1; transform: scale(1.05); }
            100% { opacity: 1; transform: scale(1); }
          }
          .animate-success-pop {
            animation: success-pop 0.9s cubic-bezier(.3,1.5,.3,1) both;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(16px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-fadeIn {
            animation: fadeIn 0.9s 0.4s both;
          }
        `}
      </style>
    </div>
  );
}
