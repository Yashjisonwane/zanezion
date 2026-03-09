import React, { useState } from 'react';
import { User, Shield, Bell, Globe, CreditCard, Save, CheckCircle, Smartphone, Lock, LogOut, RotateCcw, Info, Map, Truck, DollarSign } from 'lucide-react';

import { useData } from '../../context/GlobalDataContext';

const Settings = () => {
  const { currentUser, setCurrentUser, updateUser, deliveryPricing, setDeliveryPricing } = useData();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({ ...currentUser });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: false,
    orderUpdates: true,
    securityLogs: true
  });

  // --- PERMISSIONS MATRIX LOGIC ---
  const roles = [
    { id: 'superadmin', label: 'Super Admin' },
    { id: 'operations', label: 'Operations Lead' },
    { id: 'procurement', label: 'Procurement Officer' },
    { id: 'logistics', label: 'Logistics Manager' },
    { id: 'inventory', label: 'Inventory Controller' },
    { id: 'concierge', label: 'Concierge Staff' },
    { id: 'client', label: 'Institutional Client' },
    { id: 'staff', label: 'Field Staff' },
  ];

  const permissions = [
    { id: 'view_financials', label: 'View Financials' },
    { id: 'create_invoice', label: 'Create Invoice' },
    { id: 'manage_vendors', label: 'Manage Vendors' },
    { id: 'manage_orders', label: 'Manage Orders' },
    { id: 'manage_deliveries', label: 'Manage Deliveries' },
    { id: 'manage_users', label: 'Manage Users' },
  ];

  const initialMatrix = {
    superadmin: { view_financials: true, create_invoice: true, manage_vendors: true, manage_orders: true, manage_deliveries: true, manage_users: true },
    operations: { view_financials: false, create_invoice: false, manage_vendors: false, manage_orders: true, manage_deliveries: true, manage_users: false },
    procurement: { view_financials: true, create_invoice: false, manage_vendors: true, manage_orders: true, manage_deliveries: false, manage_users: false },
    logistics: { view_financials: false, create_invoice: false, manage_vendors: false, manage_orders: false, manage_deliveries: true, manage_users: false },
    inventory: { view_financials: false, create_invoice: false, manage_vendors: false, manage_orders: false, manage_deliveries: false, manage_users: false },
    concierge: { view_financials: false, create_invoice: false, manage_vendors: false, manage_orders: true, manage_deliveries: false, manage_users: false },
    client: { view_financials: true, create_invoice: false, manage_vendors: false, manage_orders: true, manage_deliveries: false, manage_users: false },
    staff: { view_financials: false, create_invoice: false, manage_vendors: false, manage_orders: false, manage_deliveries: false, manage_users: false },
  };

  const [matrix, setMatrix] = useState(initialMatrix);

  const togglePermission = (roleId, permId) => {
    setMatrix(prev => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [permId]: !prev[roleId]?.[permId]
      }
    }));
  };

  const handleReset = () => {
    if (window.confirm("Restore factory default permissions?")) {
      setMatrix(initialMatrix);
    }
  };

  const handleSync = () => {
    alert("Institutional Sync Successful: Permission Matrix deployed to all active nodes.");
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      const updatedUser = { ...currentUser, ...profile };
      setCurrentUser(updatedUser);
      updateUser(updatedUser); // Update in global users list
      setIsSaving(false);
      alert('Institutional profile updated successfully!');
    }, 1500);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!passwords.current || !passwords.new) {
      alert("Please enter current and new passwords.");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match.");
      return;
    }

    // In a real app we'd check passwords.current against the backend
    updateUser({ ...currentUser, password: passwords.new });
    setPasswords({ current: '', new: '', confirm: '' });
    alert("Institutional security protocol updated: Password changed successfully.");
  };

  const allTabs = [
    { id: 'profile', label: 'Profile', icon: User, roles: ['superadmin', 'client'] },
    { id: 'access', label: 'Roles & Access', icon: Shield, roles: ['superadmin'] },
    { id: 'logistics', label: 'Logistics Protocol', icon: Truck, roles: ['superadmin'] },
    { id: 'security', label: 'Security', icon: Lock, roles: ['superadmin', 'client'] },
    { id: 'notifications', label: 'Notifications', icon: Bell, roles: ['superadmin', 'client'] },
    { id: 'billing', label: 'Billing', icon: CreditCard, roles: ['superadmin', 'client'] },
  ];

  const userRole = localStorage.getItem('userRole');
  const tabs = allTabs.filter(tab => tab.roles.includes(userRole));

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
        <p className="text-secondary mt-1">Manage institutional configurations and personal account preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                ? 'bg-accent text-black font-bold shadow-lg shadow-accent/20'
                : 'text-secondary hover:bg-white/5'
                }`}
            >
              <tab.icon size={20} />
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
          <div className="pt-4 mt-4 border-t border-border">
            <button onClick={() => { localStorage.clear(); window.location.href = '/'; }} className="w-full flex items-center gap-3 px-4 py-3 text-danger hover:bg-danger/10 rounded-xl transition-all">
              <LogOut size={20} />
              <span className="text-sm font-bold">Log Out Session</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="glass-card p-6 lg:p-8">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                  <User size={22} className="text-accent" /> Account Information
                </h3>

                <div className="flex flex-col md:flex-row gap-10 items-start">
                  <div className="relative group mx-auto md:mx-0">
                    <div className="w-32 h-32 bg-accent/10 border-2 border-accent/20 rounded-2xl flex items-center justify-center text-accent font-black text-4xl shadow-inner overflow-hidden">
                      {profile.name?.split(' ').map(n => n[0]).join('') || 'ZN'}
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-2 bg-accent text-black rounded-lg shadow-xl hover:scale-110 transition-transform">
                      <Smartphone size={16} />
                    </button>
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-muted uppercase tracking-widest">Full Name</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full bg-background border border-border rounded-xl px-5 py-3 text-sm focus:border-accent outline-none font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-muted uppercase tracking-widest">Email Address</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full bg-background border border-border rounded-xl px-5 py-3 text-sm focus:border-accent outline-none font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-muted uppercase tracking-widest">Organization Unit</label>
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        className="w-full bg-background border border-border rounded-xl px-5 py-3 text-sm focus:border-accent outline-none font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-muted uppercase tracking-widest">Access Protocol</label>
                      <div className="w-full bg-white/[0.03] border border-border rounded-xl px-5 py-3 text-sm text-secondary font-bold flex items-center gap-2">
                        <Lock size={14} className="text-accent" /> {profile.role}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-2 text-muted">
                    <CheckCircle size={14} className="text-success" />
                    <span className="text-xs">Identity verified through enterprise AD</span>
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn-primary flex items-center gap-3 px-8 shadow-lg shadow-accent/10"
                  >
                    {isSaving ? 'Processing...' : <><Save size={18} /> Update Profile</>}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'access' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Shield size={22} className="text-accent" /> Roles & Policy Matrix
                    </h3>
                    <p className="text-xs text-secondary mt-1">Configure capability mapping for institutional access roles.</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleReset} className="p-2 bg-white/5 border border-border rounded-lg text-muted hover:text-white transition-all" title="Reset Default">
                      <RotateCcw size={16} />
                    </button>
                    <button onClick={handleSync} className="btn-primary py-2 px-4 text-[10px] flex items-center gap-2 font-black uppercase tracking-widest">
                      <Save size={14} /> Sync Matrix
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar border border-border rounded-xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/[0.03]">
                        <th className="p-4 text-[10px] font-black text-muted uppercase tracking-widest border-b border-border sticky left-0 bg-sidebar z-10">Role</th>
                        {permissions.map(perm => (
                          <th key={perm.id} className="p-4 text-[10px] font-black text-muted uppercase tracking-widest border-b border-border text-center">
                            {perm.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {roles.map(role => (
                        <tr key={role.id} className="hover:bg-white/[0.01]">
                          <td className="p-4 text-xs font-bold text-white border-b border-border sticky left-0 bg-sidebar z-10 whitespace-nowrap">
                            {role.label}
                          </td>
                          {permissions.map(perm => (
                            <td key={perm.id} className="p-4 border-b border-border text-center">
                              <button
                                onClick={() => togglePermission(role.id, perm.id)}
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all ${matrix[role.id]?.[perm.id] ? 'bg-accent' : 'bg-white/10'}`}
                              >
                                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-all ${matrix[role.id]?.[perm.id] ? 'translate-x-5' : 'translate-x-1'}`} />
                              </button>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 flex items-center gap-2 p-4 bg-info/5 border border-info/10 rounded-xl">
                  <Info size={14} className="text-info" />
                  <p className="text-[10px] text-secondary font-bold uppercase tracking-tight">Changes to matrix apply across all session nodes immediately upon synchronization.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logistics' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Truck size={22} className="text-accent" /> Delivery Pricing Settings
                    </h3>
                    <p className="text-xs text-secondary mt-1">Configure distance-based pricing protocols for institutional logistics.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 pb-2 border-b border-white/5 text-[10px] font-black text-muted uppercase tracking-[0.2em]">
                    <div className="col-span-1">Min Distance (km)</div>
                    <div className="col-span-1">Max Distance (km)</div>
                    <div className="col-span-1 text-center">Protocol Rate ($)</div>
                    <div className="col-span-1 text-right">Actions</div>
                  </div>

                  {deliveryPricing.map((tier) => (
                    <div key={tier.id} className="grid grid-cols-4 gap-4 items-center p-4 bg-white/[0.02] border border-border rounded-xl group hover:border-accent/30 transition-all">
                      <div className="col-span-1 font-bold text-white">{tier.min} km</div>
                      <div className="col-span-1 font-bold text-white">{tier.max} km</div>
                      <div className="col-span-1 flex justify-center">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-accent font-bold">$</span>
                          <input
                            type="number"
                            value={tier.price}
                            onChange={(e) => {
                              const newPrice = e.target.value;
                              setDeliveryPricing(prev => prev.map(t => t.id === tier.id ? { ...t, price: newPrice } : t));
                            }}
                            className="bg-background border border-border rounded-lg pl-7 pr-4 py-2 w-32 text-sm font-black text-white focus:border-accent outline-none"
                          />
                        </div>
                      </div>
                      <div className="col-span-1 text-right">
                        <span className="text-[9px] font-black text-secondary uppercase tracking-widest italic">Institutional Tier</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-accent/5 border border-accent/20 rounded-xl flex items-start gap-4">
                  <div className="p-2 bg-accent/10 rounded-lg text-accent">
                    <Map size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Geospatial Intelligence Integration</p>
                    <p className="text-xs text-secondary leading-relaxed">System is configured to bridge with the <b>Google Maps Distance Matrix API</b>. Distance calculations will automatically apply the matching protocol rate upon dispatch initialization.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="glass-card p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                <Bell size={22} className="text-accent" /> Communication Matrix
              </h3>
              <div className="space-y-4">
                {[
                  { key: 'emailAlerts', title: 'High-Value Order Alerts', desc: 'Instant email for orders exceeding $10k threshold.' },
                  { key: 'pushNotifications', title: 'Real-time Logistics Pushes', desc: 'Critical updates on driver positioning and delays.' },
                  { key: 'orderUpdates', title: 'Vendor Confirmations', desc: 'Receipt of digital signatures from supply partners.' },
                  { key: 'securityLogs', title: 'Terminal Access Logs', desc: 'Weekly audit of system logins and sensitive modifications.' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-5 bg-white/[0.02] border border-border rounded-2xl hover:border-accent/10 transition-all">
                    <div>
                      <p className="font-bold text-white">{item.title}</p>
                      <p className="text-xs text-secondary mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                      className={`w-12 h-6 rounded-full transition-all relative ${notifications[item.key] ? 'bg-accent' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${notifications[item.key] ? 'right-1 bg-black' : 'left-1 bg-secondary'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="glass-card p-8">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                  <Lock size={22} className="text-accent" /> Authentication & Security
                </h3>

                <form onSubmit={handlePasswordChange} className="max-w-md space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted uppercase tracking-widest">Current Encryption Key (Password)</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl px-5 py-3 text-sm focus:border-accent outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-muted uppercase tracking-widest">New Protocol Key</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={passwords.new}
                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                        className="w-full bg-background border border-border rounded-xl px-5 py-3 text-sm focus:border-accent outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-muted uppercase tracking-widest">Confirm New Key</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                        className="w-full bg-background border border-border rounded-xl px-5 py-3 text-sm focus:border-accent outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border mt-6">
                    <button type="submit" className="btn-primary w-full md:w-auto px-8">Update Security Key</button>
                  </div>
                </form>

                <div className="mt-12 p-6 bg-warning/5 border border-warning/10 rounded-2xl flex items-start gap-4">
                  <div className="p-2 bg-warning/10 rounded-lg text-warning">
                    <Shield size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-white">Security Recommendation</p>
                    <p className="text-xs text-secondary leading-relaxed mt-1">
                      Institutional accounts should use at least 12 characters with a mix of alphanumeric and special symbols.
                      Multi-Factor Authentication (MFA) is managed by the Super Admin level.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="glass-card p-8 text-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CreditCard size={48} className="text-accent mx-auto mb-4 opacity-40" />
              <h3 className="text-xl font-bold">Financial Statements</h3>
              <p className="text-secondary text-sm max-w-sm mx-auto mt-2">Consolidated billing for all logistics and lifestyle services.</p>
              <button className="mt-8 btn-secondary">Request Statement PDF</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
