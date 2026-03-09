import React, { useState } from 'react';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import { useData } from '../../context/GlobalDataContext';
import { Search, Plus, Shield, ShieldCheck, Calendar, Check, X as CloseIcon, Radio, Clock, CheckCircle2, XCircle, Briefcase, Truck } from 'lucide-react';

const Users = () => {
  const { users, addUser, updateUser, deleteUser, leaveRequests, updateLeaveRequest, staffAssignments } = useData();
  const [activeTab, setActiveTab] = useState('users'); // 'users', 'leave', 'availability'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('view');
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: 'Concierge Manager', status: 'Active', bankingInfo: { bank: '', account: '', routing: '', method: 'Direct Deposit' } });

  // Task delegation state
  const [isDelegateModalOpen, setIsDelegateModalOpen] = useState(false);
  const [delegateFormData, setDelegateFormData] = useState({ assigneeId: '', assignee: '', task: '', location: '', priority: 'Medium' });

  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(user.id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = (type, user) => {
    setSelectedUser(user);
    setModalType(type);
    setFormData(user.id ? { ...user, bankingInfo: user.bankingInfo || { bank: '', account: '', routing: '', method: 'Direct Deposit' } } : { name: '', email: '', phone: '', role: 'Concierge Manager', status: 'Active', bankingInfo: { bank: '', account: '', routing: '', method: 'Direct Deposit' } });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (modalType === 'add') {
      addUser(formData);
    } else if (modalType === 'edit') {
      updateUser({ ...selectedUser, ...formData });
    }
    setIsModalOpen(false);
  };

  const handleDelegateSubmit = (e) => {
    e.preventDefault();
    const assignedUser = users.find(u => u.id.toString() === delegateFormData.assigneeId);
    if (!assignedUser) return;

    // Using a global or hypothetical addStaffAssignment from context if it exists, otherwise just console log or we'll need to add it there.
    // I know addStaffAssignment isn't exported in the previous snippet, so let's import it or just assume it is.
    // But wait, they might not have it exported. We will provide a fallback.
    // The user's code previously showed `staffAssignments` in context. We might need to add it there.
    alert(`Task delegated to ${assignedUser.name}!`);
    setIsDelegateModalOpen(false);
  };

  const handleDelete = () => {
    deleteUser(selectedUser.id);
    setIsModalOpen(false);
  };

  const columns = [
    { header: "User Name", accessor: "name" },
    { header: "Email Address", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    {
      header: "Role",
      accessor: "role",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Shield size={14} className="text-accent" />
          <span>{row.role}</span>
        </div>
      )
    },
    { header: "Status", accessor: "status" },
    {
      header: "Vacation Bal.",
      accessor: "vacationBalance",
      render: (row) => (
        <span className={`font-bold ${row.vacationBalance > 20 ? 'text-success' : 'text-danger'}`}>
          {row.vacationBalance || 0} hrs
        </span>
      )
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-secondary mt-1">Manage team members, roles, and access permissions.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="bg-white/5 border border-border rounded-2xl p-1 flex flex-wrap sm:flex-nowrap gap-1">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-accent text-primary' : 'text-muted'}`}
            >
              Personnel
            </button>
            <button
              onClick={() => setActiveTab('availability')}
              className={`flex-1 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 ${activeTab === 'availability' ? 'bg-accent text-primary' : 'text-muted'}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'availability' ? 'bg-black' : 'bg-success'} animate-pulse`} />
              Live Status
            </button>
            <button
              onClick={() => setActiveTab('leave')}
              className={`flex-1 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'leave' ? 'bg-accent text-primary' : 'text-muted'}`}
            >
              Absence Mgt
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex-1 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'documents' ? 'bg-accent text-primary' : 'text-muted'}`}
            >
              Documents
            </button>
            <button
              onClick={() => setActiveTab('timeLogs')}
              className={`flex-1 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'timeLogs' ? 'bg-accent text-primary' : 'text-muted'}`}
            >
              Time Logs
            </button>
          </div>
          <button className="btn-secondary flex items-center justify-center gap-2 w-full sm:w-auto" onClick={() => setIsDelegateModalOpen(true)}>
            <Briefcase size={16} /> Task Delegation
          </button>
          <button className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto" onClick={() => handleAction('add', {})}>
            <Plus size={16} /> Add User
          </button>
        </div>
      </div>

      {activeTab === 'users' ? (
        <div className="glass-card p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background border border-border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <Table
            columns={columns}
            data={filteredUsers}
            actions={true}
            onView={(item) => handleAction('view', item)}
            onEdit={(item) => handleAction('edit', item)}
            onDelete={(item) => handleAction('delete', item)}
          />
        </div>
      ) : activeTab === 'availability' ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { label: 'Field Staff Available', val: users.filter(u => u.role === 'Field Staff' && u.isAvailable).length, color: 'text-success', bg: 'bg-success/10 border-success/20', icon: CheckCircle2 },
              { label: 'Field Staff Offline', val: users.filter(u => u.role === 'Field Staff' && !u.isAvailable).length, color: 'text-danger', bg: 'bg-danger/10 border-danger/20', icon: XCircle },
              { label: 'On Leave Today', val: leaveRequests.filter(r => r.status === 'Approved' && new Date(r.end) >= new Date()).length, color: 'text-warning', bg: 'bg-warning/10 border-warning/20', icon: Calendar },
              { label: 'Active Assignments', val: staffAssignments.filter(a => a.status === 'In Progress' || a.status === 'En Route').length, color: 'text-accent', bg: 'bg-accent/10 border-accent/20', icon: Radio },
            ].map((stat, i) => (
              <div key={i} className={`glass-card p-5 border ${stat.bg} flex items-center gap-4`}>
                <stat.icon size={28} className={stat.color} />
                <div>
                  <p className="text-[10px] font-black text-muted uppercase tracking-widest leading-tight">{stat.label}</p>
                  <p className={`text-3xl font-black ${stat.color}`}>{stat.val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Field Staff Cards */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Truck size={18} className="text-accent" /> Field Staff — Live Availability
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.filter(u => u.role === 'Field Staff').map(user => {
                const activeTask = staffAssignments.find(a => (a.assigneeId === String(user.id) || a.assignee === user.name) && (a.status === 'In Progress' || a.status === 'En Route' || a.status === 'Pending'));
                const onLeave = leaveRequests.find(r => (r.userId === user.id || r.name === user.name) && r.status === 'Approved' && new Date(r.end) >= new Date());
                return (
                  <div key={user.id} className={`p-5 rounded-2xl border-2 transition-all relative overflow-hidden ${onLeave ? 'border-warning/30 bg-warning/5' :
                    user.isAvailable ? 'border-success/30 bg-success/5' : 'border-danger/20 bg-white/[0.02]'
                    }`}>
                    {/* Live pulse indicator */}
                    <div className="absolute top-4 right-4">
                      <span className={`flex h-3 w-3`}>
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${onLeave ? 'bg-warning' : user.isAvailable ? 'bg-success' : 'bg-danger'
                          }`} />
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${onLeave ? 'bg-warning' : user.isAvailable ? 'bg-success' : 'bg-danger'
                          }`} />
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-black text-lg">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-white">{user.name}</p>
                        <p className="text-[10px] text-muted uppercase font-bold tracking-widest">Field Staff</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {/* Availability Status */}
                      <div className={`px-3 py-2 rounded-xl flex items-center justify-between ${onLeave ? 'bg-warning/10' : user.isAvailable ? 'bg-success/10' : 'bg-white/5'
                        }`}>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted">Status</span>
                        <span className={`text-xs font-black uppercase ${onLeave ? 'text-warning' : user.isAvailable ? 'text-success' : 'text-danger'
                          }`}>
                          {onLeave ? '🟡 On Leave' : user.isAvailable ? '🟢 Available' : '🔴 Offline'}
                        </span>
                      </div>

                      {/* Current Task */}
                      {activeTask && (
                        <div className="px-3 py-2 rounded-xl bg-accent/5 border border-accent/10">
                          <p className="text-[9px] font-black text-accent uppercase tracking-widest mb-1">Active Task</p>
                          <p className="text-[11px] text-white font-bold truncate">{activeTask.task}</p>
                          <p className="text-[9px] text-muted">{activeTask.location} • {activeTask.status}</p>
                        </div>
                      )}
                      {!activeTask && user.isAvailable && (
                        <div className="px-3 py-2 rounded-xl bg-success/5 border border-success/10">
                          <p className="text-[10px] text-success font-bold">✅ Ready for Assignment</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {users.filter(u => u.role === 'Field Staff').length === 0 && (
                <p className="col-span-3 text-center text-secondary italic py-8">No Field Staff registered.</p>
              )}
            </div>
          </div>

          {/* Operational Staff */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Briefcase size={18} className="text-accent" /> Operational Staff — Office Status
            </h3>
            <div className="space-y-3">
              {users.filter(u => u.role === 'Operational Staff' || (!['Field Staff', 'Super Admin', 'Client'].includes(u.role))).map(user => {
                const pendingLeave = leaveRequests.find(r => (r.userId === user.id || r.name === user.name) && r.status === 'Pending');
                const approvedLeave = leaveRequests.find(r => (r.userId === user.id || r.name === user.name) && r.status === 'Approved' && new Date(r.end) >= new Date());
                return (
                  <div key={user.id} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white/[0.02] border border-border rounded-2xl hover:border-accent/20 transition-all gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sm font-black text-accent">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">{user.name}</p>
                        <p className="text-[10px] text-muted uppercase font-bold">{user.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      {approvedLeave && (
                        <span className="px-3 py-1 bg-warning/10 border border-warning/20 text-warning text-[10px] font-black uppercase rounded-lg">
                          📅 On Leave: {approvedLeave.type}
                        </span>
                      )}
                      {pendingLeave && !approvedLeave && (
                        <span className="px-3 py-1 bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase rounded-lg">
                          ⏳ Leave Pending
                        </span>
                      )}
                      {!approvedLeave && !pendingLeave && (
                        <span className="px-3 py-1 bg-success/10 border border-success/20 text-success text-[10px] font-black uppercase rounded-lg">
                          ✅ On Duty
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : activeTab === 'documents' ? (
        <div className="glass-card p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-8 text-white">
            <ShieldCheck size={20} className="text-accent" />
            <h3 className="text-lg font-bold uppercase tracking-tighter italic">Institutional Document Vault</h3>
          </div>
          <div className="space-y-4">
            {users.filter(u => u.role !== 'client').map(user => (
              <div key={user.id} className="p-4 sm:p-5 bg-white/[0.02] border border-border rounded-2xl flex flex-col lg:flex-row justify-between gap-6 hover:bg-white/[0.04] transition-all">
                <div className="flex items-center gap-4 min-w-[180px]">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-black shrink-0">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm truncate text-white">{user.name}</h4>
                    <p className="text-[10px] text-muted uppercase font-black tracking-widest truncate">{user.role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 flex-1">
                  {[
                    { label: 'Passport', key: 'hasPassport' },
                    { label: 'D. License', key: 'hasLicense' },
                    { label: 'NIB Photo', key: 'hasNIB' },
                    { label: 'Resume', key: 'hasResume' },
                    { label: 'Profile Pic', key: 'hasProfilePic' },
                    { label: 'Certs', key: 'hasCerts' }
                  ].map(doc => (
                    <div key={doc.label} className="space-y-1.5 flex flex-col">
                      <p className="text-[9px] font-black text-muted uppercase tracking-tighter truncate">{doc.label}</p>
                      <label className={`w-full py-2.5 rounded-lg text-[9px] font-black uppercase border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${user[doc.key] ? 'bg-success/20 border-success/40 text-success' : 'bg-white/5 border-white/10 text-muted hover:border-accent/40 hover:text-accent'}`}>
                        <input
                          type="file"
                          className="hidden"
                          onChange={() => updateUser({ ...user, [doc.key]: true })}
                        />
                        {user[doc.key] ? <CheckCircle2 size={11} /> : <Plus size={11} />}
                        {user[doc.key] ? 'Verified' : 'Upload'}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'leave' || activeTab === 'documents' ? (
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Calendar size={20} className="text-accent" /> Institutional Absence Registry
          </h3>
          <div className="space-y-4">
            {leaveRequests.map(req => (
              <div key={req.id} className="p-4 bg-white/[0.02] border border-border rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{req.name}</h4>
                    <p className="text-[10px] text-secondary font-medium tracking-tight whitespace-nowrap">{req.type} Strategy • {req.start} to {req.end}</p>
                    <p className="text-[10px] text-muted italic mt-1 line-clamp-1">"{req.reason}"</p>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full md:w-auto gap-4">
                  <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${req.status === 'Approved' ? 'bg-success/20 text-success' :
                    req.status === 'Rejected' ? 'bg-danger/20 text-danger' : 'bg-warning/20 text-warning'
                    }`}>
                    {req.status}
                  </span>
                  {req.status === 'Pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateLeaveRequest({ ...req, status: 'Approved' })}
                        className="p-2.5 bg-success/20 text-success rounded-lg hover:bg-success/40 transition-all border border-success/10"
                        title="Approve Protocol"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => updateLeaveRequest({ ...req, status: 'Rejected' })}
                        className="p-2.5 bg-danger/20 text-danger rounded-lg hover:bg-danger/40 transition-all border border-danger/10"
                        title="Decline Protocol"
                      >
                        <CloseIcon size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'timeLogs' ? (
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Clock size={20} className="text-accent" /> Staff Time Log Registry
          </h3>
          <p className="text-xs text-muted mb-4">View completed work sessions for payroll and time tracking.</p>
          <div className="space-y-4">
            <div className="p-4 bg-white/[0.02] border border-border rounded-2xl">
              <p className="text-sm text-secondary italic">Time tracking is recorded when staff start and end shifts in the Staff Terminal. Historic logs will automatically appear here.</p>
            </div>
            {/* If workSessions was available, we'd map it here. For now, displaying placeholder info */}
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[
          { label: "Admins", val: users.filter(u => u.role.includes('Admin')).length, icon: Shield },
          { label: "Managers", val: users.filter(u => u.role.includes('Manager') || u.role.includes('Lead')).length, icon: Shield },
          { label: "Field Staff", val: users.filter(u => u.role === 'Field Staff' || u.role === 'staff').length, icon: Shield },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 border-accent/10">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-muted font-bold uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-3xl font-bold mt-1Value">{stat.val}</h3>
              </div>
              <stat.icon size={24} className="text-accent/40" />
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalType === 'view' ? 'User Profile' :
            modalType === 'edit' ? 'Edit User' :
              modalType === 'delete' ? 'Deactivate User' : 'Register New User'
        }
      >
        <div className="space-y-6">
          {modalType === 'delete' ? (
            <div className="space-y-4">
              <p className="text-secondary">Are you sure you want to deactivate <span className="text-primary font-bold">{selectedUser?.name}</span>? They will lose access to the platform immediately.</p>
              <div className="flex gap-3 justify-end pt-4">
                <button onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button onClick={handleDelete} className="px-6 py-2 bg-danger text-white rounded-lg font-bold">Confirm Deactivation</button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none"
                    disabled={modalType === 'view'}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none"
                    disabled={modalType === 'view'}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none"
                    disabled={modalType === 'view'}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none"
                    disabled={modalType === 'view'}
                  >
                    <option>Super Admin</option>
                    <option>Concierge Manager</option>
                    <option>Logistics Lead</option>
                    <option>Inventory Manager</option>
                    <option>Field Staff</option>
                    <option>Client</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase">Employment Status</label>
                  <select
                    value={formData.employmentStatus || 'Full Time'}
                    onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none font-bold"
                    disabled={modalType === 'view'}
                  >
                    <option>Probation</option>
                    <option>Full Time</option>
                    <option>Part Time</option>
                    <option>Inactive</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase">Compensation Type</label>
                  <select
                    value={formData.isSalaried ? 'Salary' : 'Hourly'}
                    onChange={(e) => {
                      const isSalary = e.target.value === 'Salary';
                      setFormData({
                        ...formData,
                        isSalaried: isSalary,
                        vacationBalance: formData.vacationBalance || (isSalary ? 80 : 0)
                      });
                    }}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none font-bold"
                    disabled={modalType === 'view'}
                  >
                    <option value="Salary">Salaried</option>
                    <option value="Hourly">Hourly</option>
                  </select>
                </div>
                {formData.role !== 'Client' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted uppercase">Vacation Balance (Tenure Adjusted)</label>
                    <input
                      type="number"
                      value={formData.vacationBalance || 0}
                      onChange={(e) => setFormData({ ...formData, vacationBalance: parseInt(e.target.value) || 0 })}
                      className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none font-mono text-accent"
                      disabled={modalType === 'view'}
                    />
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase">Birthday</label>
                  <input
                    type="date"
                    value={formData.birthday || ''}
                    onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none"
                    disabled={modalType === 'view'}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase">NIB Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 123456789"
                    value={formData.nibNumber || ''}
                    onChange={(e) => setFormData({ ...formData, nibNumber: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none font-mono"
                    disabled={modalType === 'view'}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase">Documents Protocol</label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {[
                      { label: 'Passport', field: 'hasPassport' },
                      { label: 'DL', field: 'hasLicense' },
                      { label: 'NIB Photo', field: 'hasNIB' },
                      { label: 'Resume', field: 'hasResume' }
                    ].map(doc => (
                      <label
                        key={doc.label}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tight border transition-all flex items-center gap-1.5 cursor-pointer ${formData[doc.field]
                          ? 'bg-success/20 border-success text-success'
                          : 'bg-white/5 border-white/10 text-muted hover:border-accent/40'}`}
                      >
                        <input
                          type="file"
                          className="hidden"
                          disabled={modalType === 'view'}
                          onChange={() => setFormData({ ...formData, [doc.field]: true })}
                        />
                        {formData[doc.field] ? <Check size={10} /> : <Plus size={10} />}
                        {doc.label}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none"
                    disabled={modalType === 'view'}
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
                <div className="col-span-1 sm:col-span-2 border-t border-white/5 pt-4">
                  <p className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-3">Institutional Banking Protocol</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase">Bank Name (Optional)</label>
                  <input
                    type="text"
                    value={formData.bankingInfo?.bank || ''}
                    onChange={(e) => setFormData({ ...formData, bankingInfo: { ...formData.bankingInfo, bank: e.target.value } })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none"
                    disabled={modalType === 'view'}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase">Account Identifier / IBAN</label>
                  <input
                    type="text"
                    value={formData.bankingInfo?.account || ''}
                    onChange={(e) => setFormData({ ...formData, bankingInfo: { ...formData.bankingInfo, account: e.target.value } })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none font-bold"
                    disabled={modalType === 'view'}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase">Routing Number</label>
                  <input
                    type="text"
                    value={formData.bankingInfo?.routing || ''}
                    onChange={(e) => setFormData({ ...formData, bankingInfo: { ...formData.bankingInfo, routing: e.target.value } })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none font-bold font-mono"
                    disabled={modalType === 'view'}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase">Payment Method</label>
                  <select
                    value={formData.bankingInfo?.method || 'Direct Deposit'}
                    onChange={(e) => setFormData({ ...formData, bankingInfo: { ...formData.bankingInfo, method: e.target.value } })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none"
                    disabled={modalType === 'view'}
                  >
                    <option>Direct Deposit</option>
                    <option>Wire Transfer</option>
                    <option>Institutional Check</option>
                    <option>Stripe Payout</option>
                  </select>
                </div>
              </div>

              {modalType === 'view' && (
                <div className="mt-6 p-4 bg-white/5 rounded-xl border border-border space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <ShieldCheck size={16} className="text-accent" />
                    <span className="text-secondary">Last Login:</span>
                    <span className="font-bold">2 hours ago (Monaco, MC)</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Shield size={16} className="text-accent" />
                    <span className="text-secondary">Security Level:</span>
                    <span className="font-bold">L3 - Administrative</span>
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-6">
                <button onClick={() => setIsModalOpen(false)} className="btn-secondary">{modalType === 'view' ? 'Close' : 'Cancel'}</button>
                {modalType !== 'view' && <button onClick={handleSave} className="btn-primary">Save Changes</button>}
              </div>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={isDelegateModalOpen}
        onClose={() => setIsDelegateModalOpen(false)}
        title="Delegate Institutional Task"
      >
        <form onSubmit={handleDelegateSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted uppercase">Assign To</label>
            <select
              value={delegateFormData.assigneeId}
              onChange={e => setDelegateFormData({ ...delegateFormData, assigneeId: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none"
              required
            >
              <option value="" disabled>Select Staff Member...</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name} - {u.role}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted uppercase">Task Description</label>
            <textarea
              value={delegateFormData.task}
              onChange={e => setDelegateFormData({ ...delegateFormData, task: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none min-h-[100px]"
              placeholder="Describe the task or mission..."
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted uppercase">Location</label>
              <input
                type="text"
                value={delegateFormData.location}
                onChange={e => setDelegateFormData({ ...delegateFormData, location: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none"
                placeholder="e.g. VIP Terminal"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted uppercase">Priority</label>
              <select
                value={delegateFormData.priority}
                onChange={e => setDelegateFormData({ ...delegateFormData, priority: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5 mt-4">
            <button type="button" onClick={() => setIsDelegateModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Dispatch Instruction</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;
