import React, { useState } from 'react';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import {
  Plus, Search, FileText, Store,
  DollarSign, Clock, CheckCircle, XCircle,
  BarChart3, ShieldCheck, Trash2, Calendar, HardDrive
} from 'lucide-react';
import { useData } from '../../context/GlobalDataContext';
import CustomDatePicker from '../../components/CustomDatePicker';
import StatusBadge from '../../components/StatusBadge';

const Quotes = () => {
  const { quotes, addQuote, updateQuote, deleteQuote, addOrder } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('view');
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    vendor: '',
    vendorId: 1,
    items: [{ name: '', qty: 1, price: 0 }],
    leadTime: '',
    validity: '',
    status: 'Active'
  });

  const filteredQuotes = quotes.filter(q =>
    (q.vendorId?.toString().includes(searchTerm)) ||
    (q.items && q.items.some(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()))) ||
    String(q.id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = (type, quote) => {
    setSelectedQuote(quote);
    setModalType(type);
    setFormData(quote.id ? {
      ...quote,
      items: quote.items || [{ name: '', qty: 1, price: 0 }]
    } : {
      vendor: '',
      vendorId: 1,
      items: [{ name: '', qty: 1, price: 0 }],
      leadTime: '3 Days',
      validity: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleAddItem = () => {
    setFormData({ ...formData, items: [...formData.items, { name: '', qty: 1, price: 0 }] });
  };

  const removeItem = (index) => {
    setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) });
  };

  const handleSave = () => {
    const total = formData.items.reduce((acc, i) => acc + (parseFloat(i.price) * parseInt(i.qty)), 0);
    const finalData = { ...formData, total, date: new Date().toISOString().split('T')[0] };
    if (modalType === 'add') {
      addQuote(finalData);
    } else if (modalType === 'edit') {
      updateQuote(finalData);
    } else if (modalType === 'delete') {
      deleteQuote(selectedQuote.id);
    }
    setIsModalOpen(false);
  };

  const handleAccept = () => {
    addOrder({
      clientId: 1, // Default or selected
      client: 'Platinum Client X',
      items: selectedQuote.items,
      vendorId: selectedQuote.vendorId,
      vendor: 'Monaco Global', // Derived from ID usually
      status: 'Confirmed',
      location: 'Central Vault'
    });
    updateQuote({ ...selectedQuote, status: 'Accepted' });
    setIsModalOpen(false);
  };

  const columns = [
    { header: "Institutional ID", accessor: "id", render: (row) => <span className="font-mono font-bold text-accent">{row.id}</span> },
    { header: "Supply Partner", accessor: "vendor" },
    { header: "Request Date", accessor: "date" },
    { header: "Protocol Validity", accessor: "validity" },
    {
      header: "Settlement Value",
      accessor: "total",
      render: (row) => <span className="font-black text-white">${parseFloat(row.total || 0).toLocaleString()}</span>
    },
    {
      header: "Protocol Status",
      accessor: "status",
      render: (row) => <StatusBadge status={row.status} />
    },
  ];

  const totalValue = quotes.reduce((acc, q) => acc + parseFloat(q.total || 0), 0);
  const activeQuotes = quotes.filter(q => q.status === 'Active').length;
  const acceptedQuotes = quotes.filter(q => q.status === 'Accepted').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Institutional Quoting</h1>
          <p className="text-secondary mt-1 text-sm">Manage luxury asset acquisition and vendor competitive analysis.</p>
        </div>
        <button className="btn-primary flex items-center gap-2 self-start" onClick={() => handleAction('add', {})}>
          <Plus size={16} /> New Quote Request
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Quotes', value: quotes.length, icon: FileText, color: 'text-accent' },
          { label: 'Total Value', value: `$${totalValue.toLocaleString()}`, icon: DollarSign, color: 'text-success' },
          { label: 'Active', value: activeQuotes, icon: Clock, color: 'text-info' },
          { label: 'Accepted', value: acceptedQuotes, icon: CheckCircle, color: 'text-success' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-5 flex items-center gap-4 hover:border-accent/20 transition-all group">
            <div className={`w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform flex-shrink-0`}>
              <stat.icon size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black text-muted uppercase tracking-widest truncate">{stat.label}</p>
              <p className="text-xl font-black text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              type="text"
              placeholder="Search by ID or Manifest..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredQuotes}
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
          modalType === 'view' ? 'Institutional Quote Manifest' :
            modalType === 'edit' ? 'Update Procurement Terms' :
              modalType === 'delete' ? 'Discard Quote' : 'Initiate Quote Submission'
        }
      >
        <div className="space-y-6">
          {modalType === 'delete' ? (
            <div className="space-y-4">
              <p className="text-secondary">Are you sure you want to permanently discard the quote request <span className="text-accent font-bold">{selectedQuote?.id}</span>?</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-bold text-muted uppercase">Supply Partner</label>
                  <input type="text" value={formData.vendor} onChange={(e) => setFormData({ ...formData, vendor: e.target.value })} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none font-bold" disabled={modalType === 'view'} placeholder="e.g. Monaco Global Services" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase">Protocol ID</label>
                  <input type="text" value={formData.id || 'AUTO'} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none font-mono text-accent" disabled={true} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase">Protocol Status</label>
                  <select className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none font-bold" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} disabled={modalType === 'view'}>
                    <option>Draft</option>
                    <option>Sent</option>
                    <option>Approved</option>
                    <option>Declined</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase">Projected Lead Time</label>
                  <input type="text" value={formData.leadTime} onChange={(e) => setFormData({ ...formData, leadTime: e.target.value })} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none" disabled={modalType === 'view'} placeholder="e.g. 5 Business Days" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase">Validity Threshold</label>
                  <input type="date" value={formData.validity} onChange={(e) => setFormData({ ...formData, validity: e.target.value })} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none" disabled={modalType === 'view'} />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-bold text-muted uppercase">Institutional Quote PDF</label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 flex items-center justify-between bg-white/5 border border-dashed border-accent/20 rounded-xl px-4 py-3 cursor-pointer hover:bg-accent/5 transition-all">
                      <div className="flex items-center gap-3">
                        <HardDrive size={18} className="text-accent" />
                        <span className="text-xs text-secondary">{formData.pdfName || 'Upload signed protocol manifest...'}</span>
                      </div>
                      <span className="text-[10px] font-black text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-lg">Browse</span>
                      <input type="file" className="hidden" onChange={(e) => setFormData({ ...formData, pdfName: e.target.files[0]?.name })} disabled={modalType === 'view'} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Asset Manifest Highlights</label>
                  {modalType !== 'view' && (
                    <button onClick={handleAddItem} className="text-[10px] font-bold text-accent hover:underline flex items-center gap-1">
                      <Plus size={10} /> Add Item
                    </button>
                  )}
                </div>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {formData.items.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-end bg-white/5 p-2 rounded-lg border border-border">
                      <div className="flex-1 space-y-1">
                        <label className="text-[8px] text-muted uppercase">Asset Name</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => {
                            const newItems = [...formData.items];
                            newItems[idx].name = e.target.value;
                            setFormData({ ...formData, items: newItems });
                          }}
                          className="w-full bg-transparent border-0 border-b border-border focus:border-accent text-xs p-0 outline-none"
                          placeholder="Product Title"
                          disabled={modalType === 'view'}
                        />
                      </div>
                      <div className="w-16 space-y-1">
                        <label className="text-[8px] text-muted uppercase">Qty</label>
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) => {
                            const newItems = [...formData.items];
                            newItems[idx].qty = e.target.value;
                            setFormData({ ...formData, items: newItems });
                          }}
                          className="w-full bg-transparent border-0 border-b border-border focus:border-accent text-xs p-0 outline-none"
                          disabled={modalType === 'view'}
                        />
                      </div>
                      <div className="w-20 space-y-1">
                        <label className="text-[8px] text-muted uppercase">Unit Price</label>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => {
                            const newItems = [...formData.items];
                            newItems[idx].price = e.target.value;
                            setFormData({ ...formData, items: newItems });
                          }}
                          className="w-full bg-transparent border-0 border-b border-border focus:border-accent text-xs p-0 outline-none"
                          disabled={modalType === 'view'}
                          step="0.01"
                        />
                      </div>
                      {modalType !== 'view' && formData.items.length > 1 && (
                        <button onClick={() => removeItem(idx)} className="p-1.5 text-danger hover:bg-danger/10 rounded-lg">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {modalType === 'view' && (
                <div className="mt-6 p-4 bg-white/5 rounded-xl border border-border space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-secondary">
                      <DollarSign size={16} className="text-accent" /> Total Manifest Value
                    </div>
                    <span className="text-xl font-bold font-mono text-accent">
                      ${formData.items.reduce((acc, i) => acc + (parseFloat(i.price) * parseInt(i.qty)), 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-6">
                <button onClick={() => setIsModalOpen(false)} className="btn-secondary">{modalType === 'view' ? 'Close' : 'Cancel'}</button>
                {modalType === 'view' && formData.status === 'Active' && (
                  <button onClick={handleAccept} className="btn-primary bg-success hover:bg-success/90 border-success">Accept & Generate Order</button>
                )}
                {modalType === 'delete' && <button onClick={handleSave} className="btn-primary bg-danger hover:bg-danger/80 border-danger">Confirm Delete</button>}
                {(modalType === 'add' || modalType === 'edit') && <button onClick={handleSave} className="btn-primary">Finalize Procurement Offer</button>}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Quotes;
