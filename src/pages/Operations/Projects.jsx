import React, { useState } from 'react';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import {
  Plus, Search, Briefcase, Calendar,
  MapPin, Users, Target, Info, Clock
} from 'lucide-react';
import CustomDatePicker from '../../components/CustomDatePicker';

import { useData } from '../../context/GlobalDataContext';

const Projects = () => {
  const { projects, addProject, updateProject, deleteProject } = useData();
  const [formData, setFormData] = useState({ name: '', client: '', start: '', location: '', status: 'Pending', deliveryType: 'Road' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('view');
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredProjects = projects.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.status.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleAction = (type, prj) => {
    setSelectedProject(prj);
    setModalType(type);
    setFormData(prj.id ? { ...prj, deliveryType: prj.deliveryType || 'Road' } : { name: '', client: '', start: '', location: '', status: 'Pending', deliveryType: 'Road' });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (modalType === 'add') {
      addProject(formData);
    } else if (modalType === 'edit') {
      updateProject({ ...selectedProject, ...formData });
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    deleteProject(selectedProject.id);
    setIsModalOpen(false);
  };

  const columns = [
    { header: "Project ID", accessor: "id" },
    { header: "Project Name", accessor: "name" },
    { header: "Client", accessor: "client" },
    { header: "Start Date", accessor: "start" },
    { header: "Location", accessor: "location" },
    { header: "Status", accessor: "status" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Management</h1>
          <p className="text-secondary mt-1">Coordinate high-end hospitality projects and events.</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => handleAction('add', {})}>
          <Plus size={16} /> New Project
        </button>
      </div>

      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex flex-1 gap-4 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background border border-border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <select
              className="bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none font-bold"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredProjects}
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
          modalType === 'view' ? 'Project Details' :
            modalType === 'edit' ? 'Edit Project' :
              modalType === 'delete' ? 'Archive Project' : 'Create New Project'
        }
      >
        {selectedProject && (
          <div className="space-y-6">
            {modalType === 'delete' ? (
              <div className="space-y-4">
                <p className="text-secondary">Are you sure you want to archive <span className="text-primary font-bold">{selectedProject.name}</span>?</p>
                <div className="flex gap-3 justify-end pt-4">
                  <button onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                  <button onClick={handleDelete} className="px-6 py-2 bg-danger text-white rounded-lg font-bold">Archive Project</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted uppercase">Project ID</label>
                    <input type="text" defaultValue={selectedProject.id} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none" disabled={modalType === 'view' || modalType === 'edit'} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted uppercase">Project Name</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none" disabled={modalType === 'view'} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted uppercase">Client</label>
                    <input type="text" value={formData.client} onChange={(e) => setFormData({ ...formData, client: e.target.value })} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none" disabled={modalType === 'view'} />
                  </div>
                  <div className="space-y-1">
                    <CustomDatePicker
                      label="Start Date"
                      selectedDate={modalType === 'add' ? formData.start : selectedProject.start}
                      onChange={(date) => {
                        if (modalType === 'add') setFormData({ ...formData, start: date });
                        else setSelectedProject({ ...selectedProject, start: date });
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted uppercase">Location</label>
                    <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none" disabled={modalType === 'view'} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted uppercase">Status</label>
                    <select className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} disabled={modalType === 'view'}>
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </select>
                  </div>
                  <div className="col-span-2 space-y-1 pt-2">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Register Logistics Deployment</label>
                    <div className="flex gap-2">
                      {['Road', 'Sea', 'Air'].map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setFormData({ ...formData, deliveryType: mode })}
                          className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter border transition-all ${formData.deliveryType === mode
                            ? 'bg-accent/20 border-accent text-accent shadow-lg shadow-accent/5'
                            : 'bg-white/5 border-white/10 text-muted hover:border-white/30'
                            }`}
                          disabled={modalType === 'view'}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {modalType === 'view' && (
                  <div className="mt-6 p-4 bg-white/5 rounded-xl border border-border space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin size={16} className="text-accent" />
                      <span className="text-secondary">Location:</span>
                      <span className="font-bold">{selectedProject.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Target size={16} className="text-accent" />
                      <span className="text-secondary">Objective:</span>
                      <span className="font-bold">Full VIP Concierge Setup</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 justify-end pt-6">
                  <button onClick={() => setIsModalOpen(false)} className="btn-secondary">{modalType === 'view' ? 'Close' : 'Cancel'}</button>
                  {modalType !== 'view' && <button onClick={handleSave} className="btn-primary">Save Project</button>}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Projects;
