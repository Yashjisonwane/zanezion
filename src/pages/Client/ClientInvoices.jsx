import React, { useState, useMemo } from 'react';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import { FileText, Download, Search, CreditCard, Clock, CheckCircle2, MoreHorizontal, Zap, Landmark, QrCode, Banknote, CreditCard as CardIcon } from 'lucide-react';
import { useData } from '../../context/GlobalDataContext';

const ClientInvoices = () => {
    const { invoices, payments, settleInvoice, currentUser, clients, addInvoice, orders } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);
    const [invoiceFormData, setInvoiceFormData] = useState({ clientId: '', totalAmount: '', status: 'Unpaid', date: new Date().toISOString().split('T')[0] });
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [settlementMethod, setSettlementMethod] = useState('Stripe');

    const userRole = localStorage.getItem('userRole');
    const isInternalAdmin = userRole === 'superadmin';

    // Identify client record for correct order attribution
    const myClient = (clients || []).find(c => {
        const cId = String(c.id).replace('CLT-', '');
        const uId = String(currentUser?.clientId).replace('CLT-', '');
        return (currentUser?.clientId && cId === uId) ||
            (currentUser?.email && c.email?.toLowerCase() === currentUser.email?.toLowerCase()) ||
            (currentUser?.name && c.name?.toLowerCase() === currentUser.name?.toLowerCase());
    });

    // Filter invoices to only this client's
    const myInvoices = isInternalAdmin
        ? (invoices || [])
        : (invoices || []).filter(inv => !myClient || inv.clientId === myClient.id);

    // --- Institutional Financial Calculations ---
    const { paidYTD, outstanding } = useMemo(() => {
        const paid = myInvoices.reduce((acc, inv) => acc + parseFloat(inv.paidAmount || 0), 0);
        const total = myInvoices.reduce((acc, inv) => acc + parseFloat(inv.totalAmount || 0), 0);
        return {
            paidYTD: paid,
            outstanding: total - paid
        };
    }, [myInvoices]);

    const filteredInvoices = myInvoices.filter(inv =>
        inv.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { header: "Invoice #", accessor: "id", render: (item) => <span className="font-black text-white italic tracking-tighter">{item.id}</span> },
        { header: "Issue Date", accessor: "date", render: (item) => <span className="text-secondary font-black italic">{item.date || item.createdAt?.split('T')[0]}</span> },
        { header: "Paid", accessor: "paidAmount", render: (item) => <span className="text-success font-black italic tracking-tighter">${parseFloat(item.paidAmount || 0).toLocaleString()}</span> },
        { header: "Total", accessor: "totalAmount", render: (item) => <span className="text-white font-black italic tracking-tighter">${parseFloat(item.totalAmount || 0).toLocaleString()}</span> },
        { header: "Terms / Due", accessor: "dueDate", render: (item) => <span className="text-muted font-black uppercase tracking-widest text-[9px]">{item.dueDate || 'NET-15'}</span> },
        {
            header: "Status",
            accessor: "status",
            render: (row) => (
                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${row.status === 'Paid' ? 'bg-success/20 text-success' :
                    row.status === 'Partially Paid' ? 'bg-info/20 text-info' :
                        row.status === 'Pending' || row.status === 'Unpaid' ? 'bg-warning/20 text-warning' : 'bg-danger/20 text-danger'
                    }`}>
                    {row.status}
                </span>
            )
        },
        {
            header: "Action",
            accessor: "id",
            render: (row) => (
                row.status !== 'Paid' ? (
                    <button
                        onClick={() => handleSettleNow(row)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/20 text-accent rounded-lg text-[10px] font-black uppercase hover:bg-accent hover:text-black transition-all"
                    >
                        <CreditCard size={12} /> Pay Now
                    </button>
                ) : (
                    <span className="text-[10px] font-bold text-success uppercase flex items-center gap-1">
                        <CheckCircle2 size={12} /> Settled
                    </span>
                )
            )
        }
    ];

    const handleSettleNow = (inv) => {
        if (inv.status === 'Paid') {
            alert('This institutional asset is already settled.');
            return;
        }
        setSelectedInvoice(inv);
        const remaining = inv.totalAmount - (inv.paidAmount || 0);
        setPaymentAmount(remaining.toString());
        setIsPaymentModalOpen(true);
    };

    const confirmSettlement = () => {
        const amount = parseFloat(paymentAmount);
        const remaining = selectedInvoice.totalAmount - (selectedInvoice.paidAmount || 0);

        if (isNaN(amount) || amount <= 0 || amount > remaining) {
            alert('Invalid settlement amount detected.');
            return;
        }

        settleInvoice(selectedInvoice.id, { amount, method: settlementMethod });
        setIsPaymentModalOpen(false);
        alert(`Institutional settlement successful via ${settlementMethod}.`);
    };

    const handlePayAll = () => {
        const unpaid = invoices.filter(inv => inv.status !== 'Paid');
        if (unpaid.length === 0) {
            alert('All invoices are already settled.');
            return;
        }
        const totalOwed = unpaid.reduce((acc, inv) => acc + (inv.totalAmount - (inv.paidAmount || 0)), 0);
        const confirmed = window.confirm(`Bulk settlement: ${unpaid.length} invoice(s) — Total $${totalOwed.toLocaleString()}. Confirm payment?`);
        if (!confirmed) return;
        unpaid.forEach(inv => {
            const remaining = inv.totalAmount - (inv.paidAmount || 0);
            settleInvoice(inv.id, { amount: remaining, method: 'Bulk Settlement' });
        });
        alert(`✅ ${unpaid.length} invoice(s) settled successfully. Total paid: $${totalOwed.toLocaleString()}`);
    };

    const handleStatementDownload = () => {
        setIsStatementModalOpen(true);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white italic uppercase">Billing & Statements</h1>
                    <p className="text-secondary text-[10px] md:text-xs mt-1 font-black uppercase tracking-[0.2em] opacity-70">Institutional financial records and membership settlement logs.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass-card p-6 border-accent/10">
                    <p className="text-[10px] text-secondary font-black uppercase tracking-widest mb-1">Total Paid (YTD)</p>
                    <p className="text-2xl font-black text-white italic font-heading tracking-tighter">${paidYTD.toLocaleString()}</p>
                </div>
                <div className="glass-card p-6 border-accent/10 bg-warning/[0.03] border-warning/10">
                    <p className="text-[10px] text-secondary font-black uppercase tracking-widest mb-1">Outstanding Balance</p>
                    <p className="text-2xl font-black text-warning italic font-heading tracking-tighter">${outstanding.toLocaleString()}</p>
                </div>
                <div className="glass-card p-6 border-accent/10">
                    <p className="text-[10px] text-secondary font-black uppercase tracking-widest mb-1">Upcoming Due</p>
                    <p className="text-2xl font-black text-white italic font-heading tracking-tighter">{myInvoices.filter(i => i.status !== 'Paid').length} Items</p>
                </div>
                <div className="glass-card p-6 border-accent/10">
                    <p className="text-[10px] text-secondary font-black uppercase tracking-widest mb-1">Protocol Status</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-2 text-success italic">Active Registry</p>
                </div>
            </div>

            <div className="glass-card p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Document Archive</h3>
                    <div className="flex gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search IDs..."
                                className="bg-background border border-border rounded-lg py-1 px-8 text-xs focus:outline-none focus:border-accent w-40"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" size={12} />
                        </div>
                        <button
                            onClick={handleStatementDownload}
                            className="text-xs text-accent font-bold flex items-center gap-2 hover:bg-accent/10 px-3 py-1.5 rounded-lg transition-all"
                        >
                            <Download size={14} /> Annual Statement
                        </button>
                    </div>
                </div>
                <Table
                    columns={columns}
                    data={filteredInvoices}
                    actions={false}
                />
            </div>

            <div className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-6 border-accent/10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center text-accent">
                        <CreditCard size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold">Vaulted Payment Methods</h4>
                        <p className="text-xs text-secondary">AMEX Gold ending in •••• 4002 (Primary)</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="btn-secondary text-xs">Manage Wallets</button>
                    <button
                        onClick={handlePayAll}
                        disabled={invoices.every(inv => inv.status === 'Paid')}
                        className="btn-primary text-xs px-6 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {invoices.every(inv => inv.status === 'Paid') ? '✓ All Settled' : `Pay All Outstanding (${invoices.filter(i => i.status !== 'Paid').length})`}
                    </button>
                </div>
            </div>

            {/* Settlement Modal */}
            <Modal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                title={`Premium Settlement: ${selectedInvoice?.id}`}
            >
                {selectedInvoice && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                <p className="text-[10px] text-muted font-bold uppercase">Issue Date</p>
                                <p className="text-sm font-bold text-white">{selectedInvoice.date}</p>
                            </div>
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                <p className="text-[10px] text-muted font-bold uppercase">Order Reference</p>
                                <p className="text-sm font-bold text-accent">{selectedInvoice.orderId || 'N/A'}</p>
                            </div>
                        </div>

                        {selectedInvoice.orderId && (
                            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                <p className="text-[10px] text-muted font-bold uppercase mb-2">Itemized Manifest</p>
                                <div className="space-y-2">
                                    {(orders.find(o => o.id === selectedInvoice.orderId)?.items || []).map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-xs">
                                            <span className="text-secondary">{item.name} (x{item.qty})</span>
                                            <span className="text-white font-mono">${(item.price * item.qty).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="p-4 bg-accent/5 rounded-2xl border border-accent/20 space-y-3">
                            <div className="flex justify-between text-xs">
                                <span className="text-secondary">Outstanding Balance</span>
                                <span className="text-white font-bold">${(selectedInvoice.totalAmount - (selectedInvoice.paidAmount || 0)).toLocaleString()}</span>
                            </div>
                            <div className="h-px bg-white/10" />
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted uppercase">Settlement Amount</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-accent font-bold">$</span>
                                    <input
                                        type="number"
                                        className="w-full bg-background border border-border rounded-lg pl-8 pr-4 py-2 text-sm focus:border-accent outline-none font-bold"
                                        value={paymentAmount}
                                        onChange={(e) => setPaymentAmount(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-muted uppercase">Payment Architecture</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <button
                                    onClick={() => setSettlementMethod('Stripe')}
                                    className={`p-3 rounded-xl border text-[10px] font-bold flex flex-col items-center gap-2 transition-all ${settlementMethod === 'Stripe' ? 'border-accent bg-accent/10 text-accent' : 'border-white/5 bg-white/5 text-muted hover:border-white/10'}`}
                                >
                                    <Zap size={18} /> Stripe
                                </button>
                                <button
                                    onClick={() => setSettlementMethod('Credit Card')}
                                    className={`p-3 rounded-xl border text-[10px] font-bold flex flex-col items-center gap-2 transition-all ${settlementMethod === 'Credit Card' ? 'border-accent bg-accent/10 text-accent' : 'border-white/5 bg-white/5 text-muted hover:border-white/10'}`}
                                >
                                    <CreditCard size={18} /> Credit Card
                                </button>
                                <button
                                    onClick={() => setSettlementMethod('Bank Transfer')}
                                    className={`p-3 rounded-xl border text-[10px] font-bold flex flex-col items-center gap-2 transition-all ${settlementMethod === 'Bank Transfer' ? 'border-accent bg-accent/10 text-accent' : 'border-white/5 bg-white/5 text-muted hover:border-white/10'}`}
                                >
                                    <Landmark size={18} /> Bank Transfer
                                </button>
                                <button
                                    onClick={() => setSettlementMethod('PayPal')}
                                    className={`p-3 rounded-xl border text-[10px] font-bold flex flex-col items-center gap-2 transition-all ${settlementMethod === 'PayPal' ? 'border-accent bg-accent/10 text-accent' : 'border-white/5 bg-white/5 text-muted hover:border-white/10'}`}
                                >
                                    <Clock size={18} /> PayPal
                                </button>
                            </div>
                        </div>

                        {/* Dynamic Instruction Details */}
                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                            {settlementMethod === 'Stripe' && (
                                <div className="text-center py-2">
                                    <p className="text-xs text-secondary">Secure redirect to Stripe Gateway for Credit/Debit cards.</p>
                                </div>
                            )}
                            {settlementMethod === 'Credit Card' && (
                                <div className="text-center py-2">
                                    <p className="text-xs text-secondary">Direct institutional card processing terminal with end-to-end encryption.</p>
                                </div>
                            )}
                            {settlementMethod === 'Bank Transfer' && (
                                <div className="space-y-1 text-[11px]">
                                    <p className="text-secondary"><span className="text-muted">Bank:</span> Commonwealth Bank (Bahamas)</p>
                                    <p className="text-secondary"><span className="text-muted">A/C:</span> 1088 4421 9005</p>
                                    <p className="text-secondary"><span className="text-muted">Swift:</span> ZNBNPBSNAS</p>
                                </div>
                            )}
                            {settlementMethod === 'PayPal' && (
                                <div className="text-center py-2">
                                    <p className="text-xs text-secondary italic">Authorize settlement via secure PayPal gateway. Reference: <span className="text-white font-bold">{selectedInvoice.id}</span></p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 justify-end pt-2">
                            <button onClick={() => setIsPaymentModalOpen(false)} className="btn-secondary">Discard</button>
                            <button
                                onClick={confirmSettlement}
                                className="btn-primary px-8 shadow-lg shadow-accent/20"
                            >
                                Authorize Payment
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal
                isOpen={isInvoiceModalOpen}
                onClose={() => setIsInvoiceModalOpen(false)}
                title="Create Manual Institutional Invoice"
            >
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted uppercase">Target Client</label>
                        <select
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none font-bold"
                            value={invoiceFormData.clientId}
                            onChange={(e) => setInvoiceFormData({ ...invoiceFormData, clientId: e.target.value })}
                        >
                            <option value="">Select Client...</option>
                            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted uppercase">Total Amount (USD)</label>
                        <input
                            type="number"
                            placeholder="0.00"
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none font-bold"
                            value={invoiceFormData.totalAmount}
                            onChange={(e) => setInvoiceFormData({ ...invoiceFormData, totalAmount: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted uppercase">Initial Status</label>
                        <select
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none"
                            value={invoiceFormData.status}
                            onChange={(e) => setInvoiceFormData({ ...invoiceFormData, status: e.target.value })}
                        >
                            <option>Unpaid</option>
                            <option>Pending</option>
                            <option>Pro-Forma</option>
                        </select>
                    </div>
                    <div className="flex gap-3 justify-end pt-4">
                        <button onClick={() => setIsInvoiceModalOpen(false)} className="btn-secondary">Cancel</button>
                        <button
                            onClick={() => {
                                addInvoice({
                                    id: `INV-${Date.now()}`,
                                    ...invoiceFormData,
                                    paidAmount: 0,
                                    createdAt: new Date().toISOString()
                                });
                                setIsInvoiceModalOpen(false);
                            }}
                            className="btn-primary px-8"
                        >
                            Generate Invoice
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Statement Generation Modal */}
            <Modal
                isOpen={isStatementModalOpen}
                onClose={() => setIsStatementModalOpen(false)}
                title="Bespoke Statement Generation"
            >
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
                        <Download className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent" size={32} />
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-xl font-bold text-white tracking-tight">Compiling Fiscal Report</h4>
                        <p className="text-secondary text-sm max-w-xs mx-auto">
                            Sequencing 2024-2025 institutional records. Your encrypted PDF will be ready for download in a few seconds.
                        </p>
                    </div>
                    <div className="w-full max-w-xs bg-white/5 h-1 rounded-full overflow-hidden">
                        <div className="h-full bg-accent animate-[loading_3s_ease-in-out_infinite]" style={{ width: '45%' }}></div>
                    </div>
                    <button
                        onClick={() => setIsStatementModalOpen(false)}
                        className="btn-secondary px-8 text-xs font-bold"
                    >
                        Close Registry
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default ClientInvoices;
