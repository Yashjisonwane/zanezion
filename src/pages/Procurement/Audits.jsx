import React, { useState } from 'react';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import {
  ClipboardCheck, Search, Shield, Calendar,
  User, CheckCircle, AlertTriangle, FileText,
  Clock, ArrowUpRight
} from 'lucide-react';
import { useData } from '../../context/GlobalDataContext';
import CustomDatePicker from '../../components/CustomDatePicker';

const Audits = () => {
  const { audits, addAudit, updateAudit, deleteAudit } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('view');
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ type: '', auditor: '', date: '', accuracy: '', status: 'In Progress' });

  const filteredAudits = audits.filter(a =>
    a.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.auditor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(a.id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = (type, audit) => {
    setSelectedAudit(audit);
    setModalType(type);
    setFormData(audit.id ? { ...audit } : { type: '', auditor: '', date: new Date().toISOString().split('T')[0], accuracy: 'Pending', status: 'In Progress' });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (modalType === 'add') {
      addAudit(formData);
    } else if (modalType === 'edit') {
      updateAudit({ ...selectedAudit, ...formData });
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    deleteAudit(selectedAudit.id);
    setIsModalOpen(false);
  };

  const columns = [
    { header: "Audit ID", accessor: "id" },
    { header: "Audit Title", accessor: "type" },
    { header: "Auditor", accessor: "auditor" },
    { header: "Audit Date", accessor: "date" },
    { header: "Result/Score", accessor: "accuracy" },
    { header: "Status", accessor: "status" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Procurement Audits</h1>
          <p className="text-secondary mt-1">Compliance tracking and departmental spend auditing system.</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => handleAction('add', {})}>
          <ClipboardCheck size={16} /> New Security Audit
        </button>
      </div>

      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              type="text"
              placeholder="Search reports or auditors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredAudits}
          actions={true}
          onView={(item) => handleAction('view', item)}
          onEdit={(item) => handleAction('edit', item)}
          onDelete={(item) => handleAction('delete', item)}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalType === 'view' ? 'Audit Report Details' :
            modalType === 'edit' ? 'Update Audit Progress' :
              modalType === 'delete' ? 'Delete Audit Record' : 'Initialize New Audit'
        }
      >
        {selectedAudit && (
          <div className="space-y-6">
            {modalType === 'delete' ? (
              <div className="space-y-4">
                <p className="text-secondary">WARNING: deleting audit <span className="text-primary font-bold">{selectedAudit.id}</span> may affect compliance history. Proceed?</p>
                <div className="flex gap-3 justify-end pt-4">
                  <button onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                  <button onClick={handleDelete} className="px-6 py-2 bg-danger text-white rounded-lg font-bold">Delete Permanent</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted uppercase">Audit ID</label>
                    <input type="text" value={formData.id || 'NEW'} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none" disabled />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted uppercase">Audit Title</label>
                    <input type="text" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none" disabled={modalType === 'view'} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted uppercase">Auditor Name</label>
                    <input type="text" value={formData.auditor} onChange={(e) => setFormData({ ...formData, auditor: e.target.value })} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none" disabled={modalType === 'view'} />
                  </div>
                  <div className="space-y-1">
                    <CustomDatePicker
                      label="Execution Date"
                      selectedDate={formData.date}
                      onChange={(date) => setFormData({ ...formData, date })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted uppercase">Result Score</label>
                    <input type="text" value={formData.accuracy} onChange={(e) => setFormData({ ...formData, accuracy: e.target.value })} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none" disabled={modalType === 'view'} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted uppercase">Status</label>
                    <select className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} disabled={modalType === 'view'}>
                      <option>Completed</option>
                      <option>In Progress</option>
                      <option>Scheduled</option>
                      <option>Failed</option>
                    </select>
                  </div>
                </div>

                {modalType === 'view' && (
                  <div className="mt-6 p-4 bg-white/5 rounded-xl border border-border space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <Shield size={16} className="text-accent" />
                      <span className="text-secondary">Security Level:</span>
                      <span className="font-bold">Protocol Tier 1</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <ArrowUpRight size={16} className="text-success" />
                      <span className="text-secondary">Compliance Impact:</span>
                      <span className="font-bold text-success">+12% Overall Improvement</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 justify-end pt-6">
                  <button onClick={() => setIsModalOpen(false)} className="btn-secondary">{modalType === 'view' ? 'Close' : 'Cancel'}</button>
                  {modalType !== 'view' && <button onClick={handleSave} className="btn-primary">Generate Final Report</button>}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Audits;
