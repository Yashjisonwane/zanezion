import React, { useState } from 'react';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import { Calendar, MapPin, Plus, Star, Search, Clock, Users } from 'lucide-react';
import { useData } from '../../context/GlobalDataContext';
import CustomDatePicker from '../../components/CustomDatePicker';

const Events = () => {
  const { events, addEvent, updateEvent, deleteEvent } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('view');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ title: '', client: '', date: '', location: '', status: 'Planning', guestCount: 0 });

  const filteredEvents = events.filter(e =>
    e.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(e.id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = (type, evt) => {
    setSelectedEvent(evt);
    setModalType(type);
    setFormData(evt.id ? { ...evt } : { title: '', client: '', date: '', location: '', status: 'Planning', guestCount: 0 });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    // Date overlap warning (non-blocking)
    if (formData.date) {
      const overlapping = events.filter(e =>
        e.date === formData.date &&
        (modalType === 'add' || e.id !== selectedEvent?.id)
      );
      if (overlapping.length > 0) {
        const proceed = window.confirm(
          `⚠️ Overlap Warning: "${overlapping[0].title}" is already scheduled on ${formData.date}.\n\nDo you still want to schedule this event on the same date?`
        );
        if (!proceed) return;
      }
    }

    if (modalType === 'add') {
      addEvent(formData);
    } else if (modalType === 'edit') {
      updateEvent({ ...selectedEvent, ...formData });
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    deleteEvent(selectedEvent.id);
    setIsModalOpen(false);
  };

  const columns = [
    { header: "Event ID", accessor: "id" },
    { header: "Event Title", accessor: "title" },
    { header: "Primary Client", accessor: "client" },
    { header: "Date", accessor: "date" },
    {
      header: "Status",
      accessor: "status",
      render: (row) => (
        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${row.status === 'Active' ? 'bg-success/20 text-success' :
          row.status === 'Planning' ? 'bg-accent/20 text-accent' : 'bg-muted/20 text-muted'
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
          <h1 className="text-3xl font-bold tracking-tight">Events Management</h1>
          <p className="text-secondary mt-1">Coordinating luxury events and high-tier celebrations.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
              className="bg-white/5 border border-border rounded-xl py-2 px-10 text-sm focus:outline-none focus:border-accent w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
          </div>
          <button className="btn-primary flex items-center gap-2" onClick={() => handleAction('add', {})}>
            <Plus size={16} /> Schedule Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-accent/10">
          <p className="text-xs text-secondary uppercase font-bold mb-1">Upcoming This Week</p>
          <p className="text-3xl font-bold">12 Events</p>
        </div>
        <div className="glass-card p-6 border-accent/10">
          <p className="text-xs text-secondary uppercase font-bold mb-1">VIP Attendance</p>
          <p className="text-3xl font-bold">450 Guests</p>
        </div>
        <div className="glass-card p-6 border-accent/10">
          <p className="text-xs text-secondary uppercase font-bold mb-1">Total Venue Area</p>
          <p className="text-3xl font-bold">2,400 m²</p>
        </div>
      </div>

      <div className="glass-card p-6">
        <Table
          columns={columns}
          data={filteredEvents}
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
          modalType === 'view' ? 'Event Registry' :
            modalType === 'edit' ? 'Adjust Schedule' :
              modalType === 'delete' ? 'Cancel Event' : 'Schedule New Event'
        }
      >
        <div className="space-y-6">
          {modalType === 'delete' ? (
            <div className="space-y-4">
              <p className="text-secondary">Are you sure you want to cancel <span className="text-primary font-bold">{selectedEvent?.title}</span>? All related logs will be archived.</p>
              <div className="flex gap-3 justify-end pt-4">
                <button onClick={() => setIsModalOpen(false)} className="btn-secondary">Keep Event</button>
                <button onClick={handleDelete} className="px-6 py-2 bg-danger text-white rounded-lg font-bold">Confirm Cancellation</button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase">Event Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none"
                    disabled={modalType === 'view'}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase">Client Name</label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none"
                    disabled={modalType === 'view'}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase">Event Date</label>
                  <CustomDatePicker
                    selectedDate={formData.date}
                    onChange={(date) => setFormData({ ...formData, date })}
                    disabled={modalType === 'view'}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none"
                    disabled={modalType === 'view'}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase">Expected Guests</label>
                  <input
                    type="number"
                    value={formData.guestCount}
                    onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none"
                    disabled={modalType === 'view'}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase">Event Planner Name</label>
                  <input
                    type="text"
                    value={formData.plannerName || ''}
                    onChange={(e) => setFormData({ ...formData, plannerName: e.target.value })}
                    placeholder="Enter planner name"
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none"
                    disabled={modalType === 'view'}
                  />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase">Inspirational Picture / Moodboard</label>
                  <div className="border border-dashed border-border rounded-lg p-4 text-center hover:border-accent/50 cursor-pointer transition-colors">
                    <p className="text-xs text-secondary italic">Click to upload inspirational images or drag and drop</p>
                  </div>
                </div>
                <div className="col-span-1 md:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase">Special Requests & Notes</label>
                  <textarea
                    value={formData.specialRequests || ''}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    placeholder="Bespoke requests, dietary restrictions, etc."
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none min-h-[100px]"
                    disabled={modalType === 'view'}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none"
                    disabled={modalType === 'view'}
                  >
                    <option>Planning</option>
                    <option>Active</option>
                    <option>Setup</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>

              {modalType === 'view' && (
                <div className="mt-6 space-y-3">
                  <h5 className="text-xs font-bold text-accent uppercase tracking-widest">Protocol Details</h5>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-border">
                      <Users size={16} className="text-secondary" />
                      <div>
                        <p className="text-[10px] text-muted uppercase font-bold">Planned Attendance</p>
                        <p className="text-sm font-bold">150 Guests</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-border">
                      <Clock size={16} className="text-secondary" />
                      <div>
                        <p className="text-[10px] text-muted uppercase font-bold">Security Level</p>
                        <p className="text-sm font-bold">Tier 1 Platinum</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-4">
                <button onClick={() => setIsModalOpen(false)} className="btn-secondary">{modalType === 'view' ? 'Close' : 'Cancel'}</button>
                {modalType !== 'view' && <button onClick={handleSave} className="btn-primary">Finalize Schedule</button>}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Events;
