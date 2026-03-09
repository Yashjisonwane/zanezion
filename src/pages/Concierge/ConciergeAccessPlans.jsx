import React, { useState } from 'react';
import { ShieldCheck, Search, Plus, Star, Crown, CheckCircle } from 'lucide-react';

const ConciergeAccessPlans = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const vipPlans = [
        { id: 'VIP-001', client: 'Mr. Sterling', type: 'Diamond Access', status: 'Active', requested: '2024-06-01' },
        { id: 'VIP-002', client: 'Oceania Resorts', type: 'Corporate Elite', status: 'Pending', requested: '2024-06-05' },
        { id: 'VIP-003', client: 'Mendoza Family', type: 'Gold Tier', status: 'Active', requested: '2024-05-15' },
    ];

    const filteredPlans = vipPlans.filter(p => p.client.toLowerCase().includes(searchTerm.toLowerCase()) || p.type.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">VIP Access Setup</h1>
                    <p className="text-secondary mt-1">Manage luxury venue access and VIP tier allocations for clients.</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn-primary flex items-center gap-2">
                        <Plus size={16} /> New VIP Access
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 flex flex-col gap-2">
                    <Crown className="text-accent" size={24} />
                    <h3 className="font-bold">Diamond Tier</h3>
                    <p className="text-xs text-secondary">Unlimited event & yacht access</p>
                    <div className="mt-4 text-2xl font-black">12 Active</div>
                </div>
                <div className="glass-card p-6 flex flex-col gap-2">
                    <Star className="text-warning" size={24} />
                    <h3 className="font-bold">Gold Tier</h3>
                    <p className="text-xs text-secondary">Priority bookings & dining</p>
                    <div className="mt-4 text-2xl font-black">45 Active</div>
                </div>
                <div className="glass-card p-6 flex flex-col gap-2">
                    <ShieldCheck className="text-success" size={24} />
                    <h3 className="font-bold">Corporate Elite</h3>
                    <p className="text-xs text-secondary">Team access & bulk reservations</p>
                    <div className="mt-4 text-2xl font-black">8 Active</div>
                </div>
            </div>

            <div className="glass-card p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Search VIP Plans..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-accent"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border/50 text-xs uppercase tracking-wider text-muted font-bold">
                                <th className="p-4 rounded-tl-xl">Plan Ref</th>
                                <th className="p-4">Client</th>
                                <th className="p-4">Access Type</th>
                                <th className="p-4">Requested</th>
                                <th className="p-4 rounded-tr-xl">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {filteredPlans.map((plan, idx) => (
                                <tr key={idx} className="border-b border-border/50 hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-4 font-black text-accent">{plan.id}</td>
                                    <td className="p-4 font-bold">{plan.client}</td>
                                    <td className="p-4 text-secondary">{plan.type}</td>
                                    <td className="p-4 text-secondary">{plan.requested}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${plan.status === 'Active' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
                                            {plan.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {filteredPlans.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-muted font-bold">No access plans found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ConciergeAccessPlans;
