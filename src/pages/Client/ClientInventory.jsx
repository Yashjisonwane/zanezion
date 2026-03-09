import React, { useState } from 'react';
import Table from '../../components/Table';
import { Package, Search, PieChart, Activity, HardDrive, ShieldCheck } from 'lucide-react';
import { useData } from '../../context/GlobalDataContext';

const ClientInventory = () => {
    const { inventory, currentUser, clients, stockMovements } = useData();
    const [searchTerm, setSearchTerm] = useState('');

    // Identify client record for correct order attribution
    const myClient = (clients || []).find(c => {
        const cId = String(c.id).replace('CLT-', '');
        const uId = String(currentUser?.clientId).replace('CLT-', '');
        return (currentUser?.clientId && cId === uId) ||
            (currentUser?.email && c.email?.toLowerCase() === currentUser.email?.toLowerCase()) ||
            (currentUser?.name && c.name?.toLowerCase() === currentUser.name?.toLowerCase());
    });

    // Show items issued to this client OR all items if no match (demo mode)
    const myInventory = myClient
        ? inventory.filter(item =>
            item.issuedTo === myClient.name ||
            item.issuedTo === myClient.id
        )
        : inventory;

    // If client has no issued items, show all (demo graceful fallback)
    const displayInventory = myInventory.length > 0 ? myInventory : inventory;

    const filteredInventory = displayInventory.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // My issued movements from stock log
    const myMovements = stockMovements?.filter(m =>
        m.type === 'Issue' && (m.client === myClient?.name || !myClient)
    ) || [];


    const columns = [
        { header: "Product", accessor: "name" },
        { header: "Storage Facility", accessor: "location" },
        { header: "On-Hand Stock", accessor: "qty" },
        {
            header: "Health",
            accessor: "status",
            render: (row) => (
                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${row.status === 'Optimal' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
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
                    <h1 className="text-3xl font-bold tracking-tight">Enterprise Assets</h1>
                    <p className="text-secondary mt-1">Institutional audit of your precision stock levels and secured resources.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Filter resources..."
                            className="bg-white/5 border border-border rounded-xl py-2 px-10 text-sm focus:outline-none focus:border-accent w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                    </div>
                    <button className="btn-primary flex items-center gap-2">
                        <ShieldCheck size={16} /> Request Audit
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass-card p-6 border-accent/10">
                    <p className="text-xs text-secondary uppercase font-bold mb-1">Stock Valuation</p>
                    <p className="text-2xl font-bold text-accent">${displayInventory.reduce((a, i) => a + (parseFloat(i.price || 0) * parseInt(i.qty || 0)), 0).toLocaleString()}</p>
                </div>
                <div className="glass-card p-6 border-accent/10">
                    <p className="text-xs text-secondary uppercase font-bold mb-1">Items Issued To You</p>
                    <p className="text-2xl font-bold">{myMovements.length}</p>
                </div>
                <div className="glass-card p-6 border-accent/10">
                    <p className="text-xs text-secondary uppercase font-bold mb-1">SKU Count</p>
                    <p className="text-2xl font-bold">{displayInventory.length}</p>
                </div>
                <div className="glass-card p-6 border-accent/10">
                    <p className="text-xs text-secondary uppercase font-bold mb-1">System Integrity</p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-success rounded-full" />
                        <span className="text-sm font-bold text-success uppercase">Verifying</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold">Facility Breakdown</h3>
                        <button className="text-xs text-accent font-bold hover:underline">Download Report</button>
                    </div>
                    <Table
                        columns={columns}
                        data={filteredInventory}
                        actions={false}
                    />
                </div>

                <div className="space-y-6">
                    <div className="glass-card p-6">
                        <h3 className="font-bold mb-6 flex items-center gap-2">
                            <PieChart size={18} className="text-accent" /> Category Allocation
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-secondary">High-Value Assets</span>
                                    <span className="font-bold">40%</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-accent" style={{ width: '40%' }} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-secondary">Raw Materials</span>
                                    <span className="font-bold">35%</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: '35%' }} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-secondary">Logistics Supply</span>
                                    <span className="font-bold">25%</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-success" style={{ width: '25%' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6 bg-accent/[0.03] border-accent/20">
                        <h4 className="font-bold mb-2 flex items-center gap-2 text-accent">
                            <Activity size={16} /> Auto-Replenish
                        </h4>
                        <p className="text-xs text-secondary mb-4 italic">
                            ZaneZion SmartStock™ is monitoring 12 critical items. Automated re-order threshold reached for "Marine Fuel High-Grade".
                        </p>
                        <button className="btn-primary w-full text-xs">Manage Thresholds</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientInventory;
