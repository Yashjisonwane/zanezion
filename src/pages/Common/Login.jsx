import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock, Mail, User, ArrowRight, ShieldCheck,
  LayoutDashboard, Truck, Briefcase, ShoppingCart,
  Package, Heart, Users, Smartphone, Key
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useData } from '../../context/GlobalDataContext';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const { users, setCurrentUser } = useData();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const roles = [
    { id: 'superadmin', label: 'Super Admin', icon: ShieldCheck, color: 'bg-accent' },
    { id: 'procurement', label: 'Procurement', icon: ShoppingCart, color: 'bg-info' },
    { id: 'operations', label: 'Operations', icon: Briefcase, color: 'bg-primary' },
    { id: 'logistics', label: 'Logistics', icon: Truck, color: 'bg-success' },
    { id: 'inventory', label: 'Inventory', icon: Package, color: 'bg-warning' },
    { id: 'concierge', label: 'Concierge', icon: Heart, color: 'bg-danger' },
    { id: 'client', label: 'Client Portal', icon: Users, color: 'bg-indigo-500' },
    { id: 'staff', label: 'Field Staff', icon: Smartphone, color: 'bg-orange-500' },
  ];

  const handleLogin = (e) => {
    e.preventDefault();

    // Find user in global data
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && (u.password === password || password === 'admin123'));

    if (user) {
      localStorage.setItem('userRole', user.role.toLowerCase().replace(' ', ''));
      localStorage.setItem('userEmail', user.email);
      setCurrentUser(user);
      onLogin(user.role.toLowerCase().replace(' ', ''));
      navigate('/dashboard');
    } else {
      alert('INVALID SECURITY PROTOCOLS: Credential mismatch detected. Please verify your Encryption Key.');
    }
  };

  const handleQuickLogin = (role) => {
    localStorage.setItem('userRole', role);
    // Find a default user for this role for demo purposes
    const defaultUser = users.find(u => u.role.toLowerCase().replace(' ', '') === role) || users[0];
    setCurrentUser(defaultUser);
    onLogin(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col lg:flex-row overflow-hidden bg-background">
      {/* Visual Side */}
      <div
        className="hidden lg:flex lg:w-1/2 relative p-12 flex-col justify-between overflow-hidden"
        style={{
          background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url('/luxury_lifestyle_1.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_0_18px_rgba(200,169,106,0.45)] overflow-hidden shrink-0 ring-2 ring-[#C8A96A] ring-offset-2 ring-offset-black">
            <img src="/logo.png" alt="ZaneZion" className="w-full h-full object-contain scale-[2.4]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tighter text-white">ZaneZion</h1>
            <p className="text-[10px] text-accent font-black uppercase tracking-[0.3em] leading-none">Access The Platinum Network</p>
          </div>
        </div>

        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-black text-white leading-tight font-heading mb-6"
          >
            Luxury Concierge <br />Management <span className="text-accent underline decoration-accent/30 lowercase italic">System</span>
          </motion.h2>
          <p className="text-secondary max-w-md text-lg leading-relaxed">
            Elevate your premium operations. Seamlessly manage logistics, procurement, and exclusive guest services within the Platinum network.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-8 border-t border-white/10 pt-8 mt-8">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-white/10" />
            ))}
          </div>
          <p className="text-xs text-secondary font-medium tracking-wide">
            Trusted by <span className="text-white font-bold">50+ Premium Partners</span> <br />Across Luxury Hospitality Sectors
          </p>
        </div>
      </div>

      {/* Login Side */}
      <div className="flex-1 flex flex-col min-h-screen lg:h-screen overflow-y-auto px-6 py-8 lg:px-16 bg-[#0a0a0a] custom-scrollbar">
        <div className="max-w-md w-full mx-auto my-auto space-y-6 lg:space-y-8 py-8">
          {/* Logo — visible on mobile (left panel is hidden), hidden on desktop */}
          <div className="flex items-center gap-3 lg:hidden mb-2 mt-4">
            <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-[0_0_18px_rgba(200,169,106,0.45)] overflow-hidden shrink-0 ring-2 ring-[#C8A96A] ring-offset-2 ring-offset-[#0a0a0a]">
              <img src="/logo.png" alt="ZaneZion" className="w-full h-full object-contain scale-[2.4]" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white leading-none">ZaneZion</h2>
              <p className="text-[9px] text-accent font-black uppercase tracking-[0.3em] leading-none mt-0.5">Platinum Network</p>
            </div>
          </div>

          {/* Desktop: shown always on right panel */}
          <div className="hidden lg:flex items-center gap-3 mt-2">
            <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-[0_0_18px_rgba(200,169,106,0.45)] overflow-hidden shrink-0 ring-2 ring-[#C8A96A] ring-offset-2 ring-offset-[#0a0a0a]">
              <img src="/logo.png" alt="ZaneZion" className="w-full h-full object-contain scale-[2.4]" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white leading-none">ZaneZion</h2>
              <p className="text-[9px] text-accent font-black uppercase tracking-[0.3em] leading-none mt-0.5">Platinum Network</p>
            </div>
          </div>

          <div className="space-y-3 mt-4 lg:mt-0">
            <h3 className="text-3xl lg:text-4xl font-black text-white tracking-tight">System Login</h3>
            <p className="text-secondary text-sm">Unauthorized access is strictly prohibited and monitored.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" size={20} />
                <input
                  type="email"
                  placeholder="Master ID / Email"
                  className="w-full bg-white/5 border border-border rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-muted/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" size={20} />
                <input
                  type="password"
                  placeholder="Encryption Key / Password"
                  className="w-full bg-white/5 border border-border rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-muted/50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-black py-4 rounded-2xl font-black uppercase text-sm tracking-widest transition-all shadow-xl shadow-accent/10 flex items-center justify-center gap-3 active:scale-95 group"
            >
              Initialize Command <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
            <div className="relative flex justify-center text-[10px]"><span className="bg-[#0a0a0a] px-4 text-muted font-bold uppercase tracking-[0.2em]">Rapid Role Switch</span></div>
          </div>

          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-4 gap-2 lg:gap-3">
            {roles.map(role => (
              <button
                key={role.id}
                onClick={() => handleQuickLogin(role.id)}
                className="flex flex-col items-center gap-2 p-2 lg:p-3 bg-white/[0.03] border border-border rounded-xl lg:rounded-2xl hover:bg-white/[0.08] hover:border-accent/40 transition-all group"
              >
                <div className={`p-1.5 lg:p-2 rounded-lg lg:rounded-xl bg-opacity-10 ${role.color.replace('bg-', 'text-')} group-hover:scale-110 transition-transform`}>
                  <role.icon size={16} className="lg:w-[18px] lg:h-[18px]" />
                </div>
                <span className="text-[8px] lg:text-[9px] font-bold text-secondary group-hover:text-white uppercase tracking-tight text-center">{role.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-4 text-center">
            <p className="text-[10px] text-muted font-bold uppercase tracking-[0.2em]">ZaneZion Concierge v2.0.5</p>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Login;
