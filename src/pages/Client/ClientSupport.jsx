import React, { useState } from 'react';
import { MessageSquare, Phone, Mail, ChevronRight, User, LifeBuoy, Clock, ShieldCheck } from 'lucide-react';

const ClientSupport = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Exclusive Support</h1>
                <p className="text-secondary mt-1">24/7 dedicated assistance for ZaneZion elite members.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="glass-card p-6 bg-accent/[0.03] border-accent/20 hover:border-accent/40 transition-all cursor-pointer group">
                            <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center text-accent mb-4 group-hover:scale-110 transition-transform">
                                <MessageSquare size={24} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Live Concierge Chat</h3>
                            <p className="text-xs text-secondary mb-4">Immediate assistance for event planning and service requests.</p>
                            <div className="flex items-center gap-2 text-xs font-bold text-accent">
                                Start Chat <ChevronRight size={14} />
                            </div>
                        </div>
                        <div className="glass-card p-6 bg-white/[0.02] border-border hover:border-accent/40 transition-all cursor-pointer group">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-secondary mb-4 group-hover:scale-110 transition-transform">
                                <LifeBuoy size={24} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Technical Registry</h3>
                            <p className="text-xs text-secondary mb-4">Manage portal access, institutional API keys, and security settings.</p>
                            <div className="flex items-center gap-2 text-xs font-bold text-accent">
                                Open Ticket <ChevronRight size={14} />
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8">
                        <h3 className="text-xl font-bold mb-6">Active Support Cases</h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-white/5 rounded-2xl border border-border group hover:bg-white/[0.08] transition-all cursor-pointer">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex gap-3 items-center">
                                        <span className="text-[10px] bg-accent/20 text-accent font-black px-2 py-0.5 rounded tracking-tighter">CASE #9022</span>
                                        <h4 className="font-bold text-sm">Luxury Yacht Provisioning Discrepancy</h4>
                                    </div>
                                    <span className="text-[10px] font-bold text-warning uppercase">In Progress</span>
                                </div>
                                <p className="text-xs text-secondary line-clamp-1 mb-3">Protocol update required for temperature-controlled gourmet storage units...</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 bg-accent/30 rounded-full flex items-center justify-center">
                                            <User size={10} className="text-accent" />
                                        </div>
                                        <span className="text-[10px] text-muted font-bold">Officer: Marcus T.</span>
                                    </div>
                                    <span className="text-[10px] text-muted">Updated 2h ago</span>
                                </div>
                            </div>

                            <div className="p-4 bg-white/5 rounded-2xl border border-border group opacity-60">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex gap-3 items-center">
                                        <span className="text-[10px] bg-white/10 text-muted font-black px-2 py-0.5 rounded tracking-tighter">CASE #8911</span>
                                        <h4 className="font-bold text-sm">International Customs Waiver Process</h4>
                                    </div>
                                    <span className="text-[10px] font-bold text-success uppercase">Resolved</span>
                                </div>
                                <p className="text-xs text-secondary line-clamp-1">Documentation verified by Sector 7 logistics hub...</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass-card p-6 border-accent/20">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <ShieldCheck size={18} className="text-success" /> Account Authority
                        </h3>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-accent relative">
                                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="Officer" className="object-cover" />
                            </div>
                            <div>
                                <p className="text-sm font-bold">Jonathan Sterling</p>
                                <p className="text-[10px] text-accent uppercase font-black">Executive Account Lead</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all group">
                                <div className="flex items-center gap-3">
                                    <Phone size={16} className="text-secondary group-hover:text-accent" />
                                    <span className="text-xs font-bold text-secondary group-hover:text-white">Direct Line</span>
                                </div>
                                <ChevronRight size={14} className="text-muted" />
                            </button>
                            <button className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all group">
                                <div className="flex items-center gap-3">
                                    <Mail size={16} className="text-secondary group-hover:text-accent" />
                                    <span className="text-xs font-bold text-secondary group-hover:text-white">Secure Mail</span>
                                </div>
                                <ChevronRight size={14} className="text-muted" />
                            </button>
                        </div>
                    </div>

                    <div className="glass-card p-6 border-accent/10">
                        <h4 className="font-bold text-sm mb-4">SLA Compliance</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-[11px]">
                                <span className="text-secondary flex items-center gap-1.5"><Clock size={12} /> Response Time</span>
                                <span className="font-bold text-success">&lt; 15 mins</span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-success" style={{ width: '92%' }} />
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                                <span className="text-secondary flex items-center gap-1.5"><LifeBuoy size={12} /> Resolution Rate</span>
                                <span className="font-bold text-accent">99.8%</span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-accent" style={{ width: '99%' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientSupport;
