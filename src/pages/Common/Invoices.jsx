import React, { useState } from 'react';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import { useData } from '../../context/GlobalDataContext';
import {
    Plus, Search, FileText, Download,
    CheckCircle2, AlertCircle, DollarSign,
    Printer, Send, Trash2, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StatusBadge from '../../components/StatusBadge';

const Invoices = () => {
    const { invoices, orders, clients, addInvoice, settleInvoice, updateInvoice, deleteInvoice, currentUser } = useData();
    const isClient = currentUser?.role === 'client';

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [modalType, setModalType] = useState('view');
    const [actionStatus, setActionStatus] = useState(null); // 'printing', 'sending', 'settling'
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [invoiceToDelete, setInvoiceToDelete] = useState(null);

    const [formData, setFormData] = useState({
        orderId: '',
        clientId: '',
        totalAmount: 0,
        paidAmount: 0,
        status: 'Unpaid',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });

    const filteredInvoices = invoices.filter(inv => {
        const matchesClient = isClient ? (inv.clientId === currentUser?.clientId) : true;
        const matchesSearch = inv.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inv.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            clients.find(c => String(c.id).includes(String(inv.clientId)))?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesClient && matchesSearch;
    });

    const handleCreateInvoice = (e) => {
        e.preventDefault();
        const client = clients.find(c => c.id === formData.clientId);
        addInvoice({
            ...formData,
            id: `INV-${Math.floor(5000 + Math.random() * 999)}`,
            date: new Date().toISOString().split('T')[0],
            clientName: client?.name || 'Unknown'
        });
        setIsModalOpen(false);
        setFormData({ orderId: '', clientId: '', totalAmount: 0, paidAmount: 0, status: 'Unpaid', dueDate: '' });
    };

    const columns = [
        { header: "Invoice ID", accessor: "id" },
        { header: "Order Ref", accessor: "orderId" },
        {
            header: "Client",
            accessor: "clientId",
            render: (row) => {
                const client = clients.find(c => String(c.id).includes(String(row.clientId)));
                return (
                    <div className="flex flex-col">
                        <span className="font-bold">{client?.name || row.clientName || 'Institutional Asset'}</span>
                        <span className="text-[10px] text-muted">{row.clientId}</span>
                    </div>
                );
            }
        },
        {
            header: "Amount",
            accessor: "totalAmount",
            render: (row) => <span className="font-bold text-accent">${parseFloat(row.totalAmount).toLocaleString()}</span>
        },
        {
            header: "Balance",
            accessor: "paidAmount",
            render: (row) => {
                const balance = row.totalAmount - row.paidAmount;
                return (
                    <span className={`font-mono text-xs ${balance === 0 ? 'text-success' : 'text-danger'}`}>
                        ${balance.toLocaleString()}
                    </span>
                );
            }
        },
        { header: "Date", accessor: "date" },
        {
            header: "Status",
            accessor: "status",
            render: (row) => <StatusBadge status={row.status} />
        }
    ];

    const handleAction = (type, inv) => {
        setSelectedInvoice(inv);
        setModalType(type);
        if (type === 'add') {
            setFormData({
                orderId: '',
                clientId: '',
                totalAmount: 0,
                paidAmount: 0,
                status: 'Unpaid',
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            });
        }
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8">
            <style>
                {`
                    @media print {
                        /* ── Absolute Institutional Isolation ──────────────── */
                        .no-print-logic, aside, nav, header, [role="navigation"], [role="banner"], button {
                            display: none !important;
                        }

                        /* Terminate Grid and Position for Document Flow */
                        .lg\\:pl-72 {
                            padding-left: 0 !important;
                        }

                        main {
                            padding: 0 !important;
                            margin: 0 !important;
                            max-width: none !important;
                        }

                        body {
                            background: white !important;
                            color: black !important;
                        }

                        /* Enforce document-only container visibility */
                        .print-protocol-container {
                            display: block !important;
                            position: absolute !important;
                            top: 0 !important;
                            left: 0 !important;
                            width: 100% !important;
                            padding: 0 !important;
                            margin: 0 !important;
                            z-index: 99999 !important;
                            background: white !important;
                        }

                        .fixed, .sticky {
                            position: static !important;
                        }

                        @page {
                            margin: 1cm;
                            size: auto;
                        }
                    }
                `}
            </style>

            <div className="no-print-logic space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Financial Invoicing</h1>
                        <p className="text-secondary mt-1">Generate and oversee institutional billing & payment status.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <AnimatePresence>
                            {actionStatus && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="px-4 py-2 bg-accent/10 border border-accent/30 rounded-xl flex items-center gap-3"
                                >
                                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                    <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">
                                        {actionStatus === 'printing' ? 'Generating Secure Protocol...' :
                                            actionStatus === 'sending' ? 'Dispatching Secure Channel...' :
                                                'Settling Institutional Ledger...'}
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {!isClient && (
                            <button
                                onClick={() => handleAction('add', {})}
                                className="btn-primary flex items-center gap-2"
                            >
                                <Plus size={18} /> Create New Invoice
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Outstanding', value: filteredInvoices.filter(i => i.status !== 'Paid').reduce((acc, i) => acc + (i.totalAmount - i.paidAmount), 0), icon: AlertCircle, color: 'text-warning' },
                        { label: 'Revenue (MTD)', value: filteredInvoices.filter(i => i.status === 'Paid').reduce((acc, i) => acc + i.totalAmount, 0), icon: CheckCircle2, color: 'text-success' },
                        { label: 'Pending Approval', value: filteredInvoices.filter(i => i.status === 'Unpaid').length, icon: Clock, color: 'text-accent', isCount: true },
                        { label: 'Total Invoiced', value: filteredInvoices.reduce((acc, i) => acc + i.totalAmount, 0), icon: DollarSign, color: 'text-primary' }
                    ].map((stat, idx) => (
                        <div key={idx} className="glass-card p-6 border-white/5 relative overflow-hidden group">
                            <stat.icon className={`absolute -right-4 -bottom-4 w-24 h-24 opacity-5 ${stat.color} group-hover:scale-110 transition-transform`} />
                            <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">{stat.label}</p>
                            <p className="text-3xl font-bold">
                                {stat.isCount ? stat.value : `$${stat.value.toLocaleString()}`}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="glass-card p-6 border-white/5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div className="relative max-w-sm w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                            <input
                                type="text"
                                placeholder="Search by ID, Client or Order..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-background border border-border rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-accent font-bold"
                            />
                        </div>
                    </div>

                    <Table
                        columns={columns}
                        data={filteredInvoices}
                        actions={true}
                        onView={(inv) => handleAction('view', inv)}
                        onDelete={!isClient ? (inv) => {
                            setInvoiceToDelete(inv);
                            setShowDeleteConfirm(true);
                        } : null}
                    />
                </div>

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={modalType === 'add' ? 'Generate Institutional Invoice' : 'Invoice Protocol Details'}
                >
                    {modalType === 'add' ? (
                        <form onSubmit={handleCreateInvoice} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted uppercase tracking-widest">Linked Order</label>
                                    <select
                                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:border-accent outline-none font-bold"
                                        value={formData.orderId}
                                        onChange={(e) => {
                                            const order = orders.find(o => o.id === e.target.value);
                                            if (order) {
                                                setFormData({
                                                    ...formData,
                                                    orderId: order.id,
                                                    clientId: order.clientId,
                                                    totalAmount: order.total || 0
                                                });
                                            }
                                        }}
                                        required
                                    >
                                        <option value="">Select Order...</option>
                                        {orders.filter(o => !invoices.some(i => i.orderId === o.id)).map(o => (
                                            <option key={o.id} value={o.id}>{o.id} - {o.client} (${o.total})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted uppercase tracking-widest">Client Account</label>
                                    <select
                                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:border-accent outline-none font-bold"
                                        value={formData.clientId}
                                        onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                                        required
                                    >
                                        <option value="">Choose Client...</option>
                                        {clients.map(c => (
                                            <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted uppercase tracking-widest">Invoiced Amount</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
                                        <input
                                            type="number"
                                            className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-accent outline-none font-bold"
                                            value={formData.totalAmount}
                                            onChange={(e) => setFormData({ ...formData, totalAmount: parseFloat(e.target.value) })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted uppercase tracking-widest">Date of Maturity (Due Date)</label>
                                    <input
                                        type="date"
                                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:border-accent outline-none font-bold"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">Generate & Authenticate Invoice</button>
                            </div>
                        </form>
                    ) : selectedInvoice && (
                        <div className="space-y-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-3xl font-bold text-white">{selectedInvoice.id}</h2>
                                    <p className="text-[10px] text-accent font-bold uppercase tracking-widest mt-1">Institutional Billing Record</p>
                                </div>
                                <StatusBadge status={selectedInvoice.status} size="lg" />
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] text-muted font-black uppercase tracking-widest mb-1">Bill To</p>
                                        <p className="text-sm font-bold text-white">{clients.find(c => c.id === selectedInvoice.clientId)?.name || selectedInvoice.clientName}</p>
                                        <p className="text-xs text-secondary mt-1">{clients.find(c => c.id === selectedInvoice.clientId)?.address || 'Address not listed'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted font-black uppercase tracking-widest mb-1">Payment Method</p>
                                        <p className="text-xs text-white font-bold">{clients.find(c => c.id === selectedInvoice.clientId)?.paymentMethod || 'Corporate Wire Transfer'}</p>
                                    </div>
                                </div>
                                <div className="space-y-4 text-right">
                                    <div>
                                        <p className="text-[10px] text-muted font-black uppercase tracking-widest mb-1">Issue Date</p>
                                        <p className="text-xs font-bold text-white">{selectedInvoice.date}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted font-black uppercase tracking-widest mb-1">Due Date</p>
                                        <p className="text-xs font-bold text-danger">{selectedInvoice.dueDate || 'Immediate'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[10px] font-black text-muted uppercase tracking-widest">Description & Order References</span>
                                    <span className="text-[10px] font-black text-muted uppercase tracking-widest">Valuation</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-t border-white/5">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white">Full Service Procurement — Ref {selectedInvoice.orderId}</span>
                                        <span className="text-[10px] text-secondary">High-End Logistics & Supply Chain Management</span>
                                    </div>
                                    <span className="text-sm font-bold text-white">${parseFloat(selectedInvoice.totalAmount).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center py-6 border-t border-white/10 mt-6">
                                    <span className="text-sm font-bold text-accent uppercase tracking-widest">Total Due (USD)</span>
                                    <span className="text-3xl font-bold text-primary">${parseFloat(selectedInvoice.totalAmount).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-6 border-t border-white/5">
                                <div className="flex gap-2">
                                    <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>Close Archive</button>
                                    {selectedInvoice.status !== 'Paid' && (
                                        <button
                                            className="btn-primary bg-success hover:bg-success/80 border-success/20 flex items-center gap-2"
                                            onClick={() => {
                                                setActionStatus('settling');
                                                setTimeout(() => {
                                                    settleInvoice(selectedInvoice.id, { amount: selectedInvoice.totalAmount, method: 'Corporate Settlement' });
                                                    setActionStatus(null);
                                                    setIsModalOpen(false);
                                                }, 1500);
                                            }}
                                        >
                                            <CheckCircle2 size={16} /> Mark as Paid
                                        </button>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        className="btn-secondary flex items-center gap-2"
                                        onClick={() => window.print()}
                                    >
                                        <Printer size={16} /> Print
                                    </button>
                                    <button
                                        className="btn-primary flex items-center gap-2"
                                        onClick={() => window.print()}
                                    >
                                        <Download size={16} /> Export PDF Manifest
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>

                {/* --- PREMIUM DELETE CONFIRMATION MODAL --- */}
                <Modal
                    isOpen={showDeleteConfirm}
                    onClose={() => setShowDeleteConfirm(false)}
                    title="Institutional Record Termination"
                >
                    <div className="space-y-6">
                        <div className="p-4 bg-danger/10 border border-danger/20 rounded-2xl flex items-start gap-4">
                            <div className="p-2 bg-danger/20 rounded-lg text-danger">
                                <AlertCircle size={24} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white uppercase tracking-tight">Security Protocol Alert</h4>
                                <p className="text-xs text-secondary mt-1">You are about to permanently purge <span className="text-danger font-bold">{invoiceToDelete?.id}</span> from the sovereign financial ledger. This action is irreversible.</p>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end pt-4 border-t border-white/5">
                            <button onClick={() => setShowDeleteConfirm(false)} className="btn-secondary">Abort Termination</button>
                            <button
                                onClick={() => {
                                    deleteInvoice(invoiceToDelete.id);
                                    setShowDeleteConfirm(false);
                                    setInvoiceToDelete(null);
                                }}
                                className="px-6 py-2 bg-danger hover:bg-danger/80 text-white rounded-xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-danger/20"
                            >
                                Confirm Permanent Purge
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>

            {/* Hidden Printable Invoice Protocol */}
            <div className="hidden print:block print-protocol-container bg-white text-black p-0">
                {selectedInvoice && (
                    <div className="max-w-4xl mx-auto border-2 border-black p-10">
                        <div className="flex justify-between items-start border-b-2 border-black pb-8 mb-8">
                            <div>
                                <h1 className="text-4xl font-black uppercase tracking-tighter">ZANEZION INTELLIGENCE</h1>
                                <p className="text-xs font-bold uppercase tracking-widest mt-2 opacity-70">Corporate Headquarters | Sovereign Operations</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black italic">{selectedInvoice.id}</p>
                                <p className="text-xs font-bold uppercase tracking-widest">Protocol Date: {selectedInvoice.date}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-20 mb-12">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Bill To:</p>
                                <p className="text-lg font-bold">{clients.find(c => c.id === selectedInvoice.clientId)?.name || selectedInvoice.clientName}</p>
                                <p className="text-sm mt-1">{clients.find(c => c.id === selectedInvoice.clientId)?.address || 'Address not listed'}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Status:</p>
                                <p className="text-lg font-bold uppercase">{selectedInvoice.status}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest mt-4 mb-2 opacity-60">Due By:</p>
                                <p className="text-lg font-bold">{selectedInvoice.dueDate || 'Immediate'}</p>
                            </div>
                        </div>

                        <table className="w-full mb-12 border-collapse">
                            <thead>
                                <tr className="border-b-2 border-black">
                                    <th className="text-left py-4 text-xs font-black uppercase tracking-widest text-[10px]">Institutional Asset Manifest</th>
                                    <th className="text-center py-4 text-xs font-black uppercase tracking-widest text-[10px]">Qty</th>
                                    <th className="text-right py-4 text-xs font-black uppercase tracking-widest text-[10px]">Valuation</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/10">
                                {(selectedInvoice.items || []).length > 0 ? (
                                    selectedInvoice.items.map((item, idx) => (
                                        <tr key={idx} className="border-b border-black/5">
                                            <td className="py-4 text-left">
                                                <p className="font-bold text-sm tracking-tight">{item.name}</p>
                                                <p className="text-[10px] opacity-70 italic font-medium uppercase tracking-tighter">Sovereign Supply Protocol Ref</p>
                                            </td>
                                            <td className="text-center text-sm font-bold">{item.qty}</td>
                                            <td className="text-right font-black text-sm">${(parseFloat(item.price || 0) * (item.qty || 0)).toLocaleString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="border-b border-black/5">
                                        <td className="py-6 text-left">
                                            <p className="font-bold text-sm">Full Service Procurement — Ref {selectedInvoice.orderId}</p>
                                            <p className="text-xs mt-1 opacity-70 italic">High-End Logistics & Supply Chain Management.</p>
                                        </td>
                                        <td className="text-center text-sm font-bold">1</td>
                                        <td className="text-right font-black text-sm">${parseFloat(selectedInvoice.totalAmount).toLocaleString()}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <div className="flex justify-end border-t-2 border-black pt-8">
                            <div className="flex flex-col items-end gap-2">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Institutional Debt</p>
                                <p className="text-4xl font-black tracking-tighter">${parseFloat(selectedInvoice.totalAmount).toLocaleString()} USD</p>
                            </div>
                        </div>

                        <div className="mt-20 pt-10 border-t border-gray-100 flex justify-between items-end">
                            <div className="max-w-xs">
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Authorized Signature</p>
                                <div className="h-1 bg-black w-48 mt-8" />
                                <p className="text-[10px] font-black mt-2">Executive Office | ZANEZION</p>
                            </div>
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">The Sovereign Financial Protocol — Confidential Document</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Invoices;
