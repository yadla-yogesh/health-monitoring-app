import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';

const { 
  Activity, Heart, Droplet, Thermometer, MessageSquare, 
  User, LogOut, ShieldAlert, Clock, Plus, Stethoscope, 
  Building2, AlertCircle, Database, ArrowRight, Bell, 
  AlertTriangle, Phone, RefreshCw, Radio
} = LucideIcons;

// --- SUPABASE CONFIGURATION ---
const getEnv = (key) => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      return import.meta.env[key];
    }
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch (e) {}
  return "";
};

const SUPABASE_URL = getEnv('VITE_SUPABASE_URL');
const SUPABASE_ANON_KEY = getEnv('VITE_SUPABASE_ANON_KEY');

// Initialize Supabase dynamically using CDN to bypass build-time resolution errors
let supabaseInstance = null;
const getSupabase = async () => {
  if (supabaseInstance) return supabaseInstance;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn("Supabase credentials not found. Ensure .env has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
    return null;
  }

  try {
    // We use the ESM CDN link to ensure it works in any environment without 'npm install'
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return supabaseInstance;
  } catch (e) {
    console.error("Supabase initialization error:", e);
    return null;
  }
};

// --- SHARED COMPONENTS ---

const Card = ({ children, title, subtitle, icon: Icon, colorClass = "text-blue-600" }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 transition-all hover:shadow-md h-full text-slate-900">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 font-medium">{subtitle}</p>}
      </div>
      {Icon && (
        <div className={`p-3 rounded-xl bg-slate-50 ${colorClass}`}>
          <Icon size={24} />
        </div>
      )}
    </div>
    {children}
  </div>
);

// --- 1. LOGIN PAGE ---

const Login = () => {
  const navigate = useNavigate();
  const roles = [
    { name: 'Patient', color: 'bg-emerald-500', path: '/patient', icon: User, desc: 'Log vitals & view records' },
    { name: 'Doctor', color: 'bg-blue-500', path: '/doctor', icon: Stethoscope, desc: 'Monitor patient health' },
    { name: 'Hospital', color: 'bg-purple-500', path: '/hospital', icon: Building2, desc: 'Manage staff & assignments' },
    { name: 'Admin', color: 'bg-rose-500', path: '/admin', icon: ShieldAlert, desc: 'System configuration' },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-900 font-sans">
      <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full text-center border border-slate-100">
        <div className="inline-flex p-4 rounded-2xl bg-blue-50 text-blue-600 mb-6">
          <Activity size={40} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">HealthSync</h1>
        <p className="text-slate-500 mb-10 font-bold">Remote Monitoring Ecosystem</p>
        
        {(!SUPABASE_URL || !SUPABASE_ANON_KEY) && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm font-medium flex items-center gap-2 text-left">
            <AlertCircle size={20} className="shrink-0" />
            <span>Database keys missing. Real-time features require a configured Supabase project.</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {roles.map((role) => (
            <button
              key={role.name}
              onClick={() => navigate(role.path)}
              className={`${role.color} text-white p-5 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg flex items-center justify-between group`}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <role.icon size={20} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-lg leading-none">{role.name}</p>
                  <p className="text-[10px] opacity-80 font-medium mt-1 uppercase tracking-widest">{role.desc}</p>
                </div>
              </div>
              <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
        <div className="mt-8 flex items-center justify-center gap-2 text-slate-400">
          <Database size={14} />
          <span className="text-[10px] uppercase tracking-widest font-black text-emerald-600">Secure Database Link Ready</span>
        </div>
      </div>
    </div>
  );
};

// --- 2. PATIENT DASHBOARD ---

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [vitals, setVitals] = useState({ bpm: '', sys: '', dia: '', sugar: '' });
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const supabase = await getSupabase();
    if (!supabase) return;
    const { data } = await supabase.from('medical_records').select('*').order('recorded_at', { ascending: false }).limit(5);
    if (data) setLogs(data);
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);

    let score = Math.floor(Math.random() * 20) + 10;
    if (parseInt(vitals.bpm) > 100) score += 65; 
    if (parseInt(vitals.sys) > 140) score += 55;
    if (parseInt(vitals.sugar) > 160) score += 45;
    const finalScore = Math.min(score, 99);

    const supabase = await getSupabase();
    if (supabase) {
      const { error } = await supabase.from('medical_records').insert([{ 
        bpm: parseInt(vitals.bpm), bp_sys: parseInt(vitals.sys), 
        bp_dia: parseInt(vitals.dia), sugar: parseInt(vitals.sugar),
        risk_score: finalScore
      }]);

      if (!error) {
        setRisk(finalScore);
        fetchHistory();
        setVitals({ bpm: '', sys: '', dia: '', sugar: '' });
      } else {
        console.error("Supabase Error:", error.message);
      }
    } else {
      setRisk(finalScore);
      setVitals({ bpm: '', sys: '', dia: '', sugar: '' });
      // Add local mock log for demo
      setLogs(prev => [{
        id: Math.random(),
        recorded_at: new Date().toISOString(),
        bpm: vitals.bpm,
        bp_sys: vitals.sys,
        bp_dia: vitals.dia,
        risk_score: finalScore
      }, ...prev].slice(0, 5));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 font-sans">
      <aside className="w-72 bg-slate-900 text-white flex flex-col p-8 hidden lg:flex shrink-0">
        <div className="flex items-center gap-3 mb-12">
          <Activity className="text-emerald-400" size={32} />
          <span className="text-2xl font-black tracking-tighter">HealthSync</span>
        </div>
        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl font-bold text-left">
            <Activity size={20} /> Dashboard
          </button>
        </nav>
        <button onClick={() => navigate('/')} className="flex items-center gap-3 p-4 text-rose-400 hover:bg-rose-400/10 rounded-2xl font-bold transition-all">
          <LogOut size={20} /> Logout
        </button>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tighter">Patient Portal</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Real-time Telemetry Active</p>
          </div>
          <div className="bg-white p-2 pr-6 rounded-full shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="h-10 w-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-black">PS</div>
            <p className="text-sm font-bold">Pradeep Shannu</p>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <Card title="Update Daily Vitals" subtitle="Simulated ML analysis synced to clinical terminal" icon={Thermometer} colorClass="text-emerald-500">
              <form onSubmit={handlePredict} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Heart Rate (BPM)</label>
                  <input type="number" required placeholder="72" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={vitals.bpm} onChange={(e) => setVitals({...vitals, bpm: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Blood Sugar (mg/dL)</label>
                  <input type="number" required placeholder="95" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={vitals.sugar} onChange={(e) => setVitals({...vitals, sugar: e.target.value})} />
                </div>
                <div className="md:col-span-2 flex gap-4">
                  <input type="number" required placeholder="Systolic BP" className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={vitals.sys} onChange={(e) => setVitals({...vitals, sys: e.target.value})} />
                  <input type="number" required placeholder="Diastolic BP" className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={vitals.dia} onChange={(e) => setVitals({...vitals, dia: e.target.value})} />
                </div>
                <button disabled={loading} className="md:col-span-2 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" /> Transmitting...
                    </>
                  ) : "Analyze & Send to Terminal"}
                </button>
              </form>
            </Card>

            {risk !== null && (
              <div className={`p-8 rounded-3xl border animate-in fade-in zoom-in ${risk > 70 ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'}`}>
                <div className="flex items-center gap-4 mb-2">
                  <ShieldAlert className={risk > 70 ? 'text-rose-600' : 'text-emerald-600'} />
                  <h4 className="text-xl font-black">AI Assessment: {risk > 70 ? 'High Risk' : 'Healthy'}</h4>
                </div>
                <p className="text-sm font-medium text-slate-600">Your risk score is {risk}%. {risk > 70 ? 'Emergency alert triggered on the clinical terminal.' : 'Data looks good. No immediate action required.'}</p>
              </div>
            )}

            <Card title="Previous Records" icon={Clock} colorClass="text-blue-500">
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <tbody className="text-sm">
                      {logs.map((log) => (
                        <tr key={log.id} className="border-b border-slate-50">
                          <td className="py-4 text-slate-500">{new Date(log.recorded_at).toLocaleTimeString()}</td>
                          <td className="py-4 font-bold">{log.bpm} bpm | {log.bp_sys}/{log.bp_dia}</td>
                          <td className="py-4 text-right">
                            <span className={`px-2 py-1 rounded-lg text-[10px] font-black ${log.risk_score > 70 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>{log.risk_score}%</span>
                          </td>
                        </tr>
                      ))}
                      {logs.length === 0 && (
                        <tr>
                          <td colSpan="3" className="py-8 text-center text-slate-400 italic">No records found. Submit vitals to start tracking.</td>
                        </tr>
                      )}
                    </tbody>
                 </table>
               </div>
            </Card>
          </div>

          <div className="space-y-8">
            <Card title="Prescriptions" icon={Activity} colorClass="text-emerald-500">
              <div className="space-y-3">
                {['Telmisartan 40mg', 'Metformin 500mg'].map((med, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="font-bold text-slate-800 text-xs uppercase">{med}</p>
                    <Plus size={16} className="text-emerald-500" />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- 3. DOCTOR DASHBOARD ---

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emergency, setEmergency] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const subscriptionRef = useRef(null);

  const fetchPatients = async () => {
    const supabase = await getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }
    const { data } = await supabase.from('medical_records').select('*').order('recorded_at', { ascending: false });
    if (data) setPatients(data);
    setLoading(false);
  };

  useEffect(() => {
    let active = true;

    const init = async () => {
      const supabase = await getSupabase();
      if (!supabase) {
        if (active) setLoading(false);
        return;
      }

      await fetchPatients();

      // Setup Realtime
      // We wrap the subscription in a robust handler
      subscriptionRef.current = supabase
        .channel('clinical-feed')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'medical_records' 
        }, (payload) => {
          if (!active) return;
          console.log("New record received in realtime:", payload.new);
          
          setPatients(current => {
            const exists = current.find(p => p.id === payload.new.id);
            if (exists) return current;
            return [payload.new, ...current];
          });
          
          if (payload.new.risk_score > 70) {
            setEmergency(payload.new);
            // Optionally play a sound here if browser permits
          }
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') setIsLive(true);
          else setIsLive(false);
        });
    };

    init();

    return () => {
      active = false;
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, []);

  const triggerMockAlert = () => {
    setEmergency({
      id: 'mock',
      bpm: 112,
      bp_sys: 165,
      bp_dia: 95,
      sugar: 180,
      risk_score: 88,
      recorded_at: new Date().toISOString()
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 relative font-sans">
      <aside className="w-72 bg-slate-900 text-white flex flex-col p-8 hidden lg:flex shrink-0">
        <div className="flex items-center gap-3 mb-12">
          <Stethoscope className="text-blue-400" size={32} />
          <span className="text-2xl font-black tracking-tighter">HealthSync</span>
        </div>
        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 p-4 bg-blue-500/10 text-blue-400 rounded-2xl font-bold text-left">
            <User size={20} /> My Patients
          </button>
        </nav>
        
        <div className="mt-auto pt-6 border-t border-slate-800 space-y-4">
           <button 
             onClick={triggerMockAlert}
             className="w-full p-4 bg-rose-500/10 text-rose-400 rounded-2xl font-bold text-sm text-left hover:bg-rose-500/20 transition-all flex items-center gap-2"
           >
             <Radio size={16} /> Test Alert UI
           </button>
           <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 p-4 text-rose-400 hover:bg-rose-400/10 rounded-2xl font-bold transition-all">
             <LogOut size={20} /> Logout
           </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tighter uppercase">Clinical Terminal</h1>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1 flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
              {isLive ? 'Cloud Realtime Stream Active' : 'Connecting to Stream...'}
            </p>
          </div>
          <button 
            onClick={fetchPatients}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-all"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Manual Refresh
          </button>
        </header>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center p-20 text-slate-400 font-bold flex flex-col items-center gap-4">
               <RefreshCw size={48} className="animate-spin text-slate-200" />
               <p className="uppercase tracking-widest text-xs">Initializing Secure Link...</p>
            </div>
          ) : (
            patients.map((log) => (
              <div key={log.id} className={`bg-white p-6 rounded-2xl border-l-4 transition-all hover:shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in slide-in-from-top-4 duration-500 ${log.risk_score > 70 ? 'border-l-rose-500 bg-rose-50 border-rose-100' : 'border-l-blue-500 border-slate-200'}`}>
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-black ${log.risk_score > 70 ? 'bg-rose-500 text-white animate-pulse' : 'bg-blue-100 text-blue-600'}`}>JD</div>
                  <div>
                    <h4 className="font-black text-slate-800 text-lg">John Doe</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(log.recorded_at).toLocaleTimeString()}</p>
                  </div>
                </div>
                
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 px-10 gap-4">
                  <div><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Heart</p><p className="font-black text-lg">{log.bpm} <span className="text-[10px] opacity-50 font-medium uppercase">bpm</span></p></div>
                  <div><p className="text-[10px] font-black text-slate-400 uppercase mb-1">BP</p><p className="font-black text-lg">{log.bp_sys}/{log.bp_dia}</p></div>
                  <div className="hidden md:block">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Risk Assessment</p>
                    <p className={`text-xl font-black ${log.risk_score > 70 ? 'text-rose-600' : 'text-emerald-600'}`}>{log.risk_score}%</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {log.risk_score > 70 && <Bell className="text-rose-500 animate-bounce" size={20} />}
                  <button className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${log.risk_score > 70 ? 'bg-rose-600 text-white shadow-lg' : 'bg-slate-900 text-white'}`}>
                    {log.risk_score > 70 ? 'Emergency Alert' : 'Review Vitals'}
                  </button>
                </div>
              </div>
            ))
          )}
          {!loading && patients.length === 0 && (
            <div className="p-20 text-center bg-white border border-slate-200 rounded-3xl">
              <Database className="mx-auto text-slate-100 mb-4" size={64} />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active clinical logs found in the stream.</p>
            </div>
          )}
        </div>
      </main>

      {/* EMERGENCY POPUP OVERLAY */}
      {emergency && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-rose-600 p-8 text-white flex flex-col items-center text-center">
              <div className="bg-white/20 p-4 rounded-full mb-4 animate-bounce">
                <AlertTriangle size={48} />
              </div>
              <h2 className="text-3xl font-black mb-1 tracking-tighter uppercase">High Risk Detected</h2>
              <p className="text-rose-100 font-bold uppercase tracking-widest text-xs opacity-80">Immediate Clinical Action Required</p>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center font-black text-2xl">JD</div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">John Doe</h3>
                    <p className="text-sm font-bold text-slate-500">Patient ID: HS-0042</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Risk Score</p>
                  <p className="text-4xl font-black text-rose-600">{emergency.risk_score}%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Heart Rate</p>
                    <p className="text-xl font-black text-slate-900">{emergency.bpm} <span className="text-xs font-medium opacity-40">BPM</span></p>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Blood Pressure</p>
                    <p className="text-xl font-black text-slate-900">{emergency.bp_sys}/{emergency.bp_dia}</p>
                 </div>
              </div>

              <div className="flex flex-col gap-3">
                <button className="w-full bg-rose-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-rose-700 transition-all shadow-lg active:scale-95">
                  <Phone size={20} /> Initiate Emergency Call
                </button>
                <button 
                  onClick={() => setEmergency(null)}
                  className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95"
                >
                  Close & Acknowledge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- 4. HOSPITAL & ADMIN ---

const HospitalDashboard = () => (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-900 text-center p-12 font-sans">
    <div className="p-6 bg-purple-100 text-purple-600 rounded-3xl mb-6"><Building2 size={64} /></div>
    <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Hospital Command</h1>
    <p className="text-slate-500 max-w-sm font-medium">Manage clinical staff, assignments, and patient registration portal.</p>
    <button onClick={() => window.history.back()} className="mt-8 px-8 py-3 bg-purple-600 text-white font-black rounded-xl shadow-lg hover:bg-purple-700 transition-all active:scale-95">Go Back</button>
  </div>
);

const AdminDashboard = () => (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-900 text-center p-12 font-sans">
    <div className="p-6 bg-rose-100 text-rose-600 rounded-3xl mb-6"><ShieldAlert size={64} /></div>
    <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">System Console</h1>
    <p className="text-slate-500 max-w-sm font-medium tracking-tight">Enterprise logs, hospital network onboarding, and infrastructure security control.</p>
    <button onClick={() => window.history.back()} className="mt-8 px-8 py-3 bg-rose-600 text-white font-black rounded-xl shadow-lg hover:bg-rose-700 transition-all active:scale-95">Go Back</button>
  </div>
);

// --- MAIN ROUTING ---

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/hospital" element={<HospitalDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}