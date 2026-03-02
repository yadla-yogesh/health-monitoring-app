import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate(); // This is the "hook" that allows us to change pages

  const roles = [
    { name: 'Patient', color: 'bg-green-500', path: '/patient' },
    { name: 'Doctor', color: 'bg-blue-500', path: '/doctor' },
    { name: 'Hospital', color: 'bg-purple-500', path: '/hospital' },
    { name: 'Admin', color: 'bg-red-500', path: '/admin' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">HealthSync</h1>
        <p className="text-slate-500 mb-8">Remote Patient Monitoring System</p>
        
        <div className="grid grid-cols-1 gap-4">
          {roles.map((role) => (
            <button
              key={role.name}
              // This onClick function triggers when you click the button
              onClick={() => navigate(role.path)}
              className={`${role.color} text-white font-bold py-4 px-6 rounded-lg transition transform hover:scale-105 active:scale-95 shadow-md`}
            >
              Login as {role.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;