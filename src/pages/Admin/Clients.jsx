import React, { useState } from 'react';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import { useData } from '../../context/GlobalDataContext';
import { Search, Plus, Download, User, MapPin, Package, CreditCard } from 'lucide-react';

const Clients = () => {
  const { clients, addClient, updateClient, deleteClient } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('view');
  const [selectedClient, setSelectedClient] = useState(null);
  const [formData, setFormData] = useState({
    name: '', location: '', orders: 0, inventory: 'Stable', status: 'Active',
    plan: 'Standard', billingCycle: 'Monthly', paymentMethod: 'Wire Transfer',
    contact: '', email: '', phone: '', address: ''
  });

  const [activeTab, setActiveTab] = useState('personal');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(client.id).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = (activeTab === 'personal' && client.clientType === 'Personal') ||
      (activeTab === 'saas' && client.clientType === 'SaaS');

    return matchesSearch && matchesTab;
  });

  const handleAction = (type, client) => {
    setSelectedClient(client);
    setModalType(type);
    setFormData(client.id ? {
      ...client,
      plan: client.plan || 'Standard',
      billingCycle: client.billingCycle || 'Monthly',
      paymentMethod: client.paymentMethod || 'Wire Transfer'
    } : {
      name: '', location: '', orders: 0, inventory: 'Stable', status: 'Active', source: 'Manual',
      clientType: activeTab === 'saas' ? 'SaaS' : 'Personal',
      plan: 'Standard', billingCycle: 'Monthly', paymentMethod: 'Wire Transfer',
      contact: '', email: '', phone: '', address: ''
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (modalType === 'add') {
      addClient({ ...formData, source: 'Manual', clientType: formData.clientType || (activeTab === 'saas' ? 'SaaS' : 'Personal') });
    } else if (modalType === 'edit') {
      updateClient({ ...selectedClient, ...formData });
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    deleteClient(selectedClient.id);
    setIsModalOpen(false);
  };

  const handleExport = () => {
    const headers = columns.map(col => col.header).join(',');
    const rows = filteredClients.map(client => {
      return columns.map(col => {
        const val = client[col.accessor] || '';
        return `"${val.toString().replace(/"/g, '""')}"`;
      }).join(',');
    });
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `clients_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    {
      header: "Category",
      accessor: "clientType",
      render: (row) => (
        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${row.clientType === 'SaaS' ? 'bg-info/20 text-info' : 'bg-primary/20 text-primary'}`}>
          {row.clientType || 'Personal'}
        </span>
      )
    },
    { header: "Location", accessor: "location" },
    {
      header: "Registry",
      accessor: "source",
      render: (row) => (
        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${row.source === 'Subscriber' ? 'bg-accent/20 text-accent' : 'bg-white/10 text-white'}`}>
          {row.source || 'Manual'}
        </span>
      )
    },
    { header: "Active Orders", accessor: "orders" },
    { header: "Account Status", accessor: "status" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Client Directory</h1>
          <p className="text-secondary mt-1">Manage luxury yacht Owners, private islands, and estate services.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2" onClick={handleExport}>
            <Download size={16} /> Export
          </button>
          <button className="btn-primary flex items-center gap-2" onClick={() => handleAction('add', {})}>
            <Plus size={16} /> Add Client
          </button>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex bg-background/50 p-1 rounded-xl border border-border">
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'personal' ? 'bg-accent text-black' : 'text-muted hover:text-white'}`}
            >
              Personal Clients
            </button>
            <button
              onClick={() => setActiveTab('saas')}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'saas' ? 'bg-accent text-black' : 'text-muted hover:text-white'}`}
            >
              SaaS Clients
            </button>
          </div>

          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              type="text"
              placeholder="Filter clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredClients}
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
          modalType === 'view' ? 'Client Details' :
            modalType === 'edit' ? 'Edit Client' :
              modalType === 'delete' ? 'Delete Client' : 'Add New Client'
        }
      >
        <div className="space-y-6">
          {modalType === 'delete' ? (
            <div className="space-y-4">
              <p className="text-secondary">Are you sure you want to delete <span className="text-primary font-bold">{selectedClient?.name}</span>? This action cannot be undone.</p>
              <div className="flex gap-3 justify-end pt-4">
                <button onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button onClick={handleDelete} className="px-6 py-2 bg-danger text-white rounded-lg font-bold">Delete Permanent</button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase">Client Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none"
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
                  <label className="text-[10px] font-bold text-muted uppercase">Active Orders</label>
                  <input
                    type="number"
                    value={formData.orders}
                    onChange={(e) => setFormData({ ...formData, orders: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none"
                    disabled={modalType === 'view'}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase">Inventory Status</label>
                  <input
                    type="text"
                    value={formData.inventory}
                    onChange={(e) => setFormData({ ...formData, inventory: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none"
                    disabled={modalType === 'view'}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase">Primary Contact Name</label>
                  <input
                    type="text"
                    value={formData.contact || ''}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none font-bold"
                    disabled={modalType === 'view'}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase">Primary Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none"
                    disabled={modalType === 'view'}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none"
                    disabled={modalType === 'view'}
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase">Physical / Shipping Address</label>
                  <input
                    type="text"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none"
                    disabled={modalType === 'view'}
                  />
                </div>

                {formData.clientType === 'SaaS' && (
                  <>
                    <div className="sm:col-span-2 pt-6 border-t border-border/50 mt-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-info mb-4">Institutional Branding Protocol</h4>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted uppercase">Custom Company Name</label>
                      <input
                        type="text"
                        value={formData.companyName || ''}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none font-bold"
                        placeholder="Corporate Identity..."
                        disabled={modalType === 'view'}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted uppercase">Institutional Logo URL</label>
                      <input
                        type="text"
                        value={formData.logo || ''}
                        onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none"
                        placeholder="https://asset.cdn/logo.png"
                        disabled={modalType === 'view'}
                      />
                    </div>
                  </>
                )}

                {/* Financial & Subscription Section */}
                <div className="sm:col-span-2 pt-6 border-t border-border/50 mt-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-accent mb-4">Financial & Subscription Protocol</h4>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase">Subscription Plan</label>
                  <select
                    value={formData.plan}
                    onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none"
                    disabled={modalType === 'view'}
                  >
                    <option>Standard</option>
                    <option>Executive</option>
                    <option>Platinum</option>
                    <option>Custom Enterprise</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase">Billing Cycle</label>
                  <select
                    value={formData.billingCycle}
                    onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none"
                    disabled={modalType === 'view'}
                  >
                    <option>Monthly</option>
                    <option>Yearly</option>
                    <option>Quarterly</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase">Payment Method</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none"
                    disabled={modalType === 'view'}
                  >
                    <option>Wire Transfer</option>
                    <option>Credit Card (Stripe)</option>
                    <option>Direct Debit</option>
                    <option>Cash / Institutional</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase">Account Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none"
                    disabled={modalType === 'view'}
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Warning</option>
                    <option>Pending Payment</option>
                  </select>
                </div>
              </div>

              {modalType === 'view' && (
                <div className="mt-6 p-4 bg-white/5 rounded-xl border border-border space-y-4 sm:col-span-2">
                  <div className="flex items-center gap-3 text-sm">
                    <User size={16} className="text-accent" />
                    <span className="text-secondary">Primary Contact:</span>
                    <span className="font-bold">{selectedClient?.contact || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin size={16} className="text-accent" />
                    <span className="text-secondary">Address:</span>
                    <span className="font-bold">{selectedClient?.address || selectedClient?.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Package size={16} className="text-accent" />
                    <span className="text-secondary">Subscription:</span>
                    <span className="font-bold">{selectedClient?.plan} Protocol ({selectedClient?.billingCycle})</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CreditCard size={16} className="text-accent" />
                    <span className="text-secondary">Billing:</span>
                    <span className="font-bold">{selectedClient?.paymentMethod}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <User size={16} className="text-accent" />
                    <span className="text-secondary">Primary Email:</span>
                    <span className="font-bold">{selectedClient?.email || 'N/A'}</span>
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
    </div>
  );
};

export default Clients;

