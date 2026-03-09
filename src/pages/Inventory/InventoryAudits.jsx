import React, { useState } from 'react';
import { ShieldCheck, FileText, Search, Download, Calendar, Filter, User } from 'lucide-react';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import { useData } from '../../context/GlobalDataContext';

const InventoryAudits = () => {
    const { audits, addAudit, users } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('view'); // view, add
    const [selectedAudit, setSelectedAudit] = useState(null);
    const [formData, setFormData] = useState({
        type: 'Full Stock Audit',
        date: new Date().toISOString().split('T')[0],
        auditor: '',
        status: 'Scheduled'
    });

    const columns = [
        { header: "Audit ID", accessor: "id" },
        { header: "Scheduled Date", accessor: "date" },
        { header: "Type", accessor: "type" },
        { header: "Auditor", accessor: "auditor" },
        {
            header: "Accuracy",
            accessor: "accuracy",
            render: (row) => (
                <span className={`font-bold ${parseFloat(row.accuracy) > 99 ? 'text-success' : 'text-warning'}`}>
                    {row.accuracy}
                </span>
            )
        },
        {
            header: "Status",
            accessor: "status",
            render: (row) => (
                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${row.status === 'Verified' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                    }`}>
                    {row.status}
                </span>
            )
        },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Stock Integrity Audits</h1>
                    <p className="text-secondary mt-1">Institutional verification logs and accuracy protocols.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search audit logs..."
                            className="bg-white/5 border border-border rounded-xl py-2 px-10 text-sm focus:outline-none focus:border-accent w-64"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                    </div>
                    <button className="btn-primary flex items-center gap-2" onClick={() => { setModalType('add'); setIsModalOpen(true); }}>
                        <ShieldCheck size={16} /> Schedule New Audit
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass-card p-6 border-accent/10">
                    <p className="text-xs text-secondary uppercase font-bold tracking-wider mb-1">Average Accuracy</p>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold">98.2%</span>
                        <span className="text-xs text-success mb-1">+0.4%</span>
                    </div>
                </div>
                <div className="glass-card p-6 border-accent/10">
                    <p className="text-xs text-secondary uppercase font-bold tracking-wider mb-1">Items Audited</p>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold">12,402</span>
                        <span className="text-xs text-secondary mb-1">Total</span>
                    </div>
                </div>
                <div className="glass-card p-6 border-accent/10">
                    <p className="text-xs text-secondary uppercase font-bold tracking-wider mb-1">Pending Sync</p>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold">4</span>
                        <span className="text-xs text-warning mb-1">Updates</span>
                    </div>
                </div>
                <div className="glass-card p-6 border-accent/10">
                    <p className="text-xs text-secondary uppercase font-bold tracking-wider mb-1">Integrity Score</p>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-success">GOLD</span>
                        <span className="text-xs text-success mb-1">Tier</span>
                    </div>
                </div>
            </div>

            <div className="glass-card p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold">Historical Audit Registry</h3>
                    <button className="text-accent hover:text-accent/80 text-sm font-bold flex items-center gap-2">
                        <Download size={14} /> Export Logs
                    </button>
                </div>
                <Table
                    columns={columns}
                    data={audits}
                    actions={true}
                    onView={(item) => { setSelectedAudit(item); setModalType('view'); setIsModalOpen(true); }}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalType === 'add' ? 'Schedule Institutional Audit' : 'Audit Verification Protocol'}
            >
                {modalType === 'add' ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted uppercase">Audit Category</label>
                                <select
                                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none font-bold"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option>Full Stock Audit</option>
                                    <option>Spot Check (Section B)</option>
                                    <option>Fuel Reservoir Audit</option>
                                    <option>Liquor Inventory</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted uppercase">Execution Date</label>
                                <input
                                    type="date"
                                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none font-bold"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1 col-span-1 md:col-span-2">
                                <label className="text-[10px] font-bold text-muted uppercase">Assigned Auditor</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
                                    <select
                                        className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:border-accent outline-none font-bold"
                                        value={formData.auditor}
                                        onChange={(e) => setFormData({ ...formData, auditor: e.target.value })}
                                    >
                                        <option value="">Select Auditor...</option>
                                        {users.map(u => <option key={u.id} value={u.name}>{u.name} ({u.role})</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end pt-4">
                            <button onClick={() => setIsModalOpen(false)} className="btn-secondary">Abort</button>
                            <button
                                onClick={() => {
                                    addAudit(formData);
                                    setIsModalOpen(false);
                                }}
                                className="btn-primary"
                            >
                                Confirm Schedule
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="p-4 bg-accent/5 rounded-2xl border border-accent/20">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center text-accent">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">{selectedAudit?.id}</h4>
                                    <p className="text-xs text-secondary">{selectedAudit?.type}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-white/5 rounded-lg border border-border">
                                    <p className="text-[10px] text-muted uppercase font-bold">Auditor</p>
                                    <p className="text-sm font-bold">{selectedAudit?.auditor}</p>
                                </div>
                                <div className="p-3 bg-white/5 rounded-lg border border-border">
                                    <p className="text-[10px] text-muted uppercase font-bold">Date</p>
                                    <p className="text-sm font-bold">{selectedAudit?.date}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h5 className="text-sm font-bold flex items-center gap-2">
                                <ShieldCheck size={16} className="text-success" /> Verification Summary
                            </h5>
                            <p className="text-sm text-secondary leading-relaxed">
                                {selectedAudit?.status === 'Verified'
                                    ? `Physical count perfectly synchronized with blockchain registry. No significant deviations detected in the ${selectedAudit?.type.toLowerCase()}. All environmental seals verified and intact.`
                                    : `Audit scheduled for ${selectedAudit?.date}. Physical verification protocol pending execution.`}
                            </p>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button onClick={() => setIsModalOpen(false)} className="flex-1 btn-secondary">Close Protocol</button>
                            <button className="flex-1 btn-primary flex items-center justify-center gap-2">
                                <Download size={16} /> Download PDF
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default InventoryAudits;
