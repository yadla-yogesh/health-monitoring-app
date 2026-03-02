import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
  const navigate = useNavigate();
  
  // State to hold the form data
  const [vitals, setVitals] = useState({
    heartRate: '',
    bloodPressure: '',
    bloodSugar: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Vitals Submitted:", vitals);
    alert("Vitals sent to your doctor! ML Model is analyzing...");
    // Later, we will send this to Supabase here
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-8 text-green-400">HealthSync</h2>
        <nav className="space-y-4">
          <div className="p-3 bg-slate-800 rounded-lg cursor-pointer">Dashboard</div>
          <div className="p-3 hover:bg-slate-800 rounded-lg cursor-pointer">My Doctors</div>
          <div className="p-3 hover:bg-slate-800 rounded-lg cursor-pointer">Chat</div>
          <button 
            onClick={() => navigate('/')}
            className="w-full text-left p-3 text-red-400 hover:bg-red-900/20 rounded-lg mt-10"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Welcome back, Pradeep</h1>
            <p className="text-slate-500">How are you feeling today?</p>
          </div>
          <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">P</div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-semibold mb-6">Log Daily Vitals</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Heart Rate (BPM)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 72"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  value={vitals.heartRate}
                  onChange={(e) => setVitals({...vitals, heartRate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Blood Pressure (Systolic)</label>
                <input 
                  type="text" 
                  placeholder="e.g. 120"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  value={vitals.bloodPressure}
                  onChange={(e) => setVitals({...vitals, bloodPressure: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Blood Sugar (mg/dL)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 100"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  value={vitals.bloodSugar}
                  onChange={(e) => setVitals({...vitals, bloodSugar: e.target.value})}
                />
              </div>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition shadow-lg">
                Submit Vitals
              </button>
            </form>
          </div>

          {/* Medications Section */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-xl font-semibold mb-4">Current Medications</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <div>
                    <p className="font-bold text-blue-900">Aspirin</p>
                    <p className="text-sm text-blue-700">100mg - Once daily</p>
                  </div>
                  <button className="bg-white text-blue-600 px-4 py-1 rounded-lg text-sm font-semibold border border-blue-200">Taken</button>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 border border-purple-100 rounded-xl">
                  <div>
                    <p className="font-bold text-purple-900">Metformin</p>
                    <p className="text-sm text-purple-700">500mg - After dinner</p>
                  </div>
                  <button className="bg-white text-purple-600 px-4 py-1 rounded-lg text-sm font-semibold border border-purple-200">Taken</button>
                </div>
              </div>
            </div>
            
            {/* Quick Status / ML Indicator */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl text-white shadow-lg">
              <h3 className="text-lg font-bold mb-2">Health Score</h3>
              <p className="text-4xl font-extrabold mb-2">92%</p>
              <p className="text-sm opacity-90">Based on your recent logs, your heart risk is currently LOW.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;