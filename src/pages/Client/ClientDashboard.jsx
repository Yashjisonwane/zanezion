import React, { useState, useEffect } from 'react';
import KpiCard from '../../components/KpiCard';
import StatusBadge from '../../components/StatusBadge';
import OrderModal from '../../components/OrderModal';
import {
  Package, Truck, History, CreditCard, Wallet,
  MapPin, CheckCircle,
  ArrowUpRight, ShoppingBag, ShoppingCart, TrendingUp, Landmark,
  HelpCircle, FileText, Eye, Download, Link, ChevronRight, Zap
} from 'lucide-react';
import Modal from '../../components/Modal';
import { motion } from 'framer-motion';

import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/GlobalDataContext';

const ClientDashboard = () => {
  const { orders, invoices, settleInvoice, currentUser, clients } = useData();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState(null);

  const [orderTab, setOrderTab] = useState('open');
  const [invoiceTab, setInvoiceTab] = useState('unpaid');

  const clientData = (clients || []).find(c => c.id === currentUser?.clientId) || (clients?.[0] || { id: 'GUEST', name: 'Guest' });

  const clientOrders = (orders || []).filter(o => o.clientId === clientData.id || o.client === clientData.name);
  const clientInvoices = (invoices || []).filter(inv => inv.clientId === clientData.id || inv.client === clientData.name);
  const activeOrders = (clientOrders || []).filter(o => o.status !== 'Delivered');

  const handleAction = (type, order) => {
    setSelectedOrder(order);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handlePayment = (inv) => {
    const amount = inv.totalAmount - (inv.paidAmount || 0);
    if (window.confirm(`Settle institutional balance for ${inv.id}: $${amount.toLocaleString()}?`)) {
      settleInvoice(inv.id, { amount, method: 'Dashboard Fast-Pay' });
      alert(`✅ Settlement Successful: Institutional record ${inv.id} has been marked as Paid.`);
    }
  };

  const handleSave = (formData) => {
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen space-y-8 animate-fade-in pb-10">
      <div className="max-w-[1600px] mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white italic uppercase">Client Portal</h1>
            <p className="text-secondary text-[10px] md:text-xs mt-1 font-black uppercase tracking-[0.2em] opacity-70">Institutional management and luxury asset tracking.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/dashboard/support')}
              className="btn-secondary text-xs"
            >
              Contact Support
            </button>
            <button
              onClick={() => navigate('/dashboard/store')}
              className="btn-primary text-xs px-6"
            >
              Initialize New Order
            </button>
          </div>
        </div>

        {/* KPI Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card p-6">
            <p className="text-[10px] text-accent font-black uppercase tracking-widest mb-1">Active Orders</p>
            <p className="text-2xl font-black text-white italic font-heading tracking-tighter">{activeOrders.length.toString().padStart(2, '0')}</p>
          </div>
          <div className="glass-card p-6">
            <p className="text-[10px] text-secondary font-black uppercase tracking-widest mb-1">Total Shipments</p>
            <p className="text-2xl font-black text-info italic font-heading tracking-tighter">05</p>
          </div>
          <div className="glass-card p-6">
            <p className="text-[10px] text-secondary font-black uppercase tracking-widest mb-1">Asset Reserve</p>
            <p className="text-2xl font-black text-success italic font-heading tracking-tighter">72%</p>
          </div>
          <div className="glass-card p-6">
            <p className="text-[10px] text-secondary font-black uppercase tracking-widest mb-1">Protocol Audits</p>
            <p className="text-2xl font-black text-warning italic font-heading tracking-tighter">12</p>
          </div>
        </div>

        {/* Client Profile Section */}
        <div className="glass-card p-6 sm:p-10">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
              <img src="/logo.png" className="w-full h-full object-contain scale-[2.2] brightness-0" alt="ZaneZion" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 flex-1 w-full">
              <div className="space-y-1">
                <p className="text-[10px] text-accent font-black uppercase tracking-widest">Institutional ID</p>
                <p className="text-lg font-black text-white italic font-heading tracking-tighter">ZN-CLT-{clientData.id.toString().slice(-4)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-muted font-black uppercase tracking-widest">Primary Contact</p>
                <p className="text-sm font-black text-white italic">{clientData.contact}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-muted font-black uppercase tracking-widest">Email Address</p>
                <p className="text-sm font-black text-white italic truncate">{clientData.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-muted font-black uppercase tracking-widest">Location</p>
                <p className="text-sm font-black text-white italic truncate">{clientData.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Operational Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8">

          {/* Left Column - Active Protocols */}
          <div className="xl:col-span-8 space-y-6 sm:space-y-8 text-white">

            {/* Orders Section */}
            <div className="glass-card p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Requisition History</h3>
                <div className="flex bg-background border border-border p-1 rounded-xl">
                  <button
                    onClick={() => setOrderTab('open')}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${orderTab === 'open' ? 'bg-accent text-black' : 'text-muted hover:text-white'}`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setOrderTab('closed')}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${orderTab === 'closed' ? 'bg-accent text-black' : 'text-muted hover:text-white'}`}
                  >
                    Archived
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {(clientOrders || []).filter(o => orderTab === 'open' ? o.status !== 'Delivered' : o.status === 'Delivered').map((order, idx) => (
                  <motion.div
                    layout
                    key={idx}
                    className="group bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:border-accent/30 hover:bg-white/[0.04] transition-all duration-300 shadow-xl"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-background border border-white/10 rounded-xl flex items-center justify-center text-accent/40 group-hover:text-accent transition-colors shadow-inner">
                          <Package size={22} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-white text-sm sm:text-base group-hover:text-accent transition-colors truncate italic">
                            {order.product || order.items?.[0]?.name || "Consolidated Order"}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-black text-muted uppercase tracking-widest italic">{order.id}</span>
                            <span className="text-muted/30">•</span>
                            <span className="text-[10px] font-black text-muted uppercase tracking-widest italic">{order.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0">
                        <div className="text-left sm:text-right">
                          <p className="text-lg font-black text-white font-heading italic tracking-tighter">${parseFloat(order.total || 0).toLocaleString()}</p>
                          <StatusBadge status={order.status} />
                        </div>
                        <button
                          onClick={() => handleAction('view', order)}
                          className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-accent hover:text-black hover:border-accent transition-all duration-300 shadow-lg"
                        >
                          <ArrowUpRight size={20} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {(clientOrders || []).filter(o => orderTab === 'open' ? o.status !== 'Delivered' : o.status === 'Delivered').length === 0 && (
                  <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[2rem] bg-white/[0.01]">
                    <History size={64} strokeWidth={1} className="mx-auto mb-4 text-white/5" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted italic">No Requisition Logs Found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Concierge & Inventory Protocol Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard label="Open Requisitions" value={clientOrders.filter(o => o.status !== 'Delivered').length.toString()} change="+1" type="increase" color="text-info" icon={ShoppingCart} />
              <KpiCard label="SaaS Efficiency" value="98.2%" change="+2.4%" type="increase" color="text-success" icon={TrendingUp} />
              <KpiCard label="Fleet Status" value="4 Active" change="Stable" type="neutral" color="text-accent" icon={Truck} />
              <KpiCard label="Fiscal Reconcile" value={`$${clientOrders.reduce((acc, o) => acc + (parseFloat(o.total || 0)), 0).toLocaleString()}`} change="-120" type="decrease" color="text-success" icon={Landmark} />
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-6">Financial Reconcile</h3>
              <div className="flex bg-background border border-border p-1 rounded-xl w-fit mb-6">
                <button
                  onClick={() => setInvoiceTab('unpaid')}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${invoiceTab === 'unpaid' ? 'bg-danger text-white' : 'text-muted hover:text-white'}`}
                >
                  Unpaid
                </button>
                <button
                  onClick={() => setInvoiceTab('paid')}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${invoiceTab === 'paid' ? 'bg-success text-white' : 'text-muted hover:text-white'}`}
                >
                  Paid
                </button>
              </div>

              <div className="space-y-3">
                {(clientInvoices || []).filter(inv => invoiceTab === 'paid' ? inv.status === 'Paid' : inv.status !== 'Paid').map((inv, idx) => (
                  <motion.div
                    layout
                    key={idx}
                    className="group bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:border-accent/30 hover:bg-white/[0.04] transition-all duration-300 shadow-xl"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-background border border-white/10 rounded-xl flex items-center justify-center text-muted/40 group-hover:text-accent transition-colors shadow-inner">
                          <FileText size={22} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-white text-sm sm:text-base group-hover:text-accent transition-colors truncate italic">
                            {inv.id}
                          </p>
                          <p className="text-[10px] font-black text-muted uppercase tracking-widest mt-1 italic">{inv.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0">
                        <div className="text-left sm:text-right">
                          <p className="text-lg font-black text-white font-heading italic tracking-tighter">${parseFloat(inv.totalAmount || 0).toLocaleString()}</p>
                          <StatusBadge status={inv.status} />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setViewingInvoice(inv);
                              setIsInvoiceModalOpen(true);
                            }}
                            className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-accent/10 hover:text-accent transition-all shadow-lg"
                          >
                            <Eye size={18} />
                          </button>
                          {inv.status !== 'Paid' && (
                            <button
                              onClick={() => handlePayment(inv)}
                              className="px-6 h-10 bg-accent text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-lg shadow-accent/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                              Settle
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Logistics & Inventory */}
          <div className="xl:col-span-4 space-y-6 sm:space-y-8">
            <div className="glass-card p-6 sm:p-8">
              <h3 className="text-lg font-black text-white italic uppercase tracking-tighter mb-6">Concierge Active Requests</h3>
              <div className="space-y-3">
                <div className="p-4 bg-white/5 border border-border rounded-xl">
                  <p className="text-sm font-black text-white italic">Private Island Excursion</p>
                  <p className="text-[10px] text-accent font-black uppercase tracking-widest mt-1">April 12 - Confirmed</p>
                </div>
                <div className="p-4 bg-white/[0.02] border border-border rounded-xl opacity-40 text-xs">
                  <p className="text-muted">No other active requests.</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/dashboard/client-events')}
                className="w-full mt-6 py-2.5 bg-white/5 border border-border text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Initiate Request
              </button>
            </div>

            <div className="glass-card p-6 sm:p-8">
              <h3 className="text-lg font-black text-white italic uppercase tracking-tighter mb-6">Strategic Asset Reserve</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1 text-[10px] font-black uppercase tracking-widest">
                    <span className="text-muted">Beverage Reserve</span>
                    <span className="text-white italic">70%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 border border-border rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: '70%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1 text-[10px] font-black uppercase tracking-widest">
                    <span className="text-muted">Linen Protocol</span>
                    <span className="text-white italic">92%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 border border-border rounded-full overflow-hidden">
                    <div className="h-full bg-success" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate('/dashboard/client-inventory')}
                className="w-full mt-6 py-2.5 bg-white/5 border border-border text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                View Reserve Manifest
              </button>
            </div>

            <div className="glass-card p-6 sm:p-8">
              <h3 className="text-lg font-black text-white italic uppercase tracking-tighter mb-6 flex items-center gap-2">
                <Truck size={18} className="text-accent" /> Tracking Intel
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-1 h-12 bg-accent/20 rounded-full mt-1"></div>
                  <div>
                    <p className="text-[10px] font-black text-accent uppercase tracking-widest">In Transit</p>
                    <p className="text-sm font-black text-white italic">Nassau Harbour</p>
                    <p className="text-[10px] text-muted font-black uppercase tracking-widest mt-1">ETA: 11:30 AM AST</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate('/dashboard/track-delivery')}
                className="w-full mt-8 py-3 bg-white/5 border border-border text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all font-body active:scale-[0.98]"
              >
                Access Live Network
              </button>
            </div>

            <div className="glass-card p-6 sm:p-8">
              <h3 className="text-lg font-black text-white italic uppercase tracking-tighter mb-6">Quick Protocols</h3>
              <div className="space-y-2">
                {[
                  { label: "Request Concierge", path: "/dashboard/client-events" },
                  { label: "Audit Inventory", path: "/dashboard/client-inventory" },
                  { label: "Security Settings", path: "/dashboard/settings" }
                ].map((action, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(action.path)}
                    className="w-full py-3 bg-white/5 border border-border text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-between px-4 group font-body active:scale-[0.98]"
                  >
                    {action.label}
                    <ChevronRight size={14} className="text-muted group-hover:text-accent transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modalType={modalType}
        selectedOrder={selectedOrder}
        onSave={handleSave}
        onDelete={handleDelete}
        role="client"
      />

      <Modal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        title={`Institutional Invoice: ${viewingInvoice?.id}`}
      >
        <div className="space-y-6 py-4">
          <div className="p-6 bg-white/[0.02] border border-white/10 rounded-[2rem]">
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-1">
                <p className="text-[10px] text-accent font-black uppercase tracking-widest">Recipient Manifest</p>
                <p className="text-base font-bold text-white">{clientData.name}</p>
                <p className="text-[10px] text-muted font-bold truncate max-w-[200px]">{clientData.address}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-[10px] text-muted font-black uppercase tracking-widest">Protocol Date</p>
                <p className="text-base font-bold text-white tracking-tight">{viewingInvoice?.date}</p>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/5">
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] text-muted font-black uppercase tracking-widest">Asset Subtotal</span>
                <span className="text-sm font-black text-white tabular-nums">${parseFloat(viewingInvoice?.totalAmount || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] text-muted font-black uppercase tracking-widest">Logistics Surcharge</span>
                <span className="text-sm font-black text-white tabular-nums">$0.00</span>
              </div>
              <div className="flex justify-between items-center px-1 pt-4 border-t border-white/10 mt-2">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-black text-accent uppercase tracking-[0.2em] block">Total Valuation</span>
                  <div className="flex items-center gap-1.5 text-[9px] text-success font-bold uppercase">
                    <Zap size={10} className="fill-success" /> Institutional Protocol
                  </div>
                </div>
                <span className="text-2xl font-black text-accent tabular-nums shadow-accent/5 shadow-2xl">${parseFloat(viewingInvoice?.totalAmount || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={() => setIsInvoiceModalOpen(false)}
              className="flex-1 py-4 bg-white/5 text-white border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all font-body active:scale-[0.98]"
            >
              Close Ledger
            </button>
            <button
              onClick={() => {
                handlePayment(viewingInvoice);
                setIsInvoiceModalOpen(false);
              }}
              className="flex-1 py-4 bg-accent text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:shadow-[0_15px_30px_-5px_rgba(200,169,106,0.3)] transition-all font-body active:scale-[0.98]"
            >
              Finalize Settlement
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ClientDashboard;
