import React, { createContext, useContext, useState } from 'react';
import { CLIENTS, VENDOR_PERFORMANCE, INVENTORY_ALERTS, RECENT_ORDERS, ACCESS_PLANS } from '../utils/data';

const GlobalDataContext = createContext();

export const GlobalDataProvider = ({ children }) => {
    // Initial States from data.js
    const [subscriptionRequests, setSubscriptionRequests] = useState([
        { id: 'SUB-REQ-001', clientName: 'Blue Ocean Charters', plan: 'Executive Protocol', contact: 'Capt. Nemo', status: 'Pending', date: '2025-03-05', email: 'nemo@blueocean.com', country: 'Bahamas', requirements: 'Full fleet tracking for 12 vessels.', propertyType: 'Yacht / Fleet', throughput: 'High' },
        { id: 'SUB-REQ-002', clientName: 'Royal Palm Resort', plan: 'Platinum Protocol', contact: 'Sarah Miller', status: 'Pending', date: '2025-03-05', email: 's.miller@royalpalm.com', country: 'Bahamas', requirements: 'Integrated procurement for 5-star hospitality.', propertyType: 'Luxury Resort', throughput: 'Medium' }
    ]);

    const [clients, setClients] = useState([
        {
            id: 'CLT-001',
            name: "Goldwynn Residences",
            location: "Cable Beach, Nassau",
            address: "123 Cable Beach Rd, Nassau, Bahamas",
            contact: "John Pemberton",
            email: "pemberton@goldwynn.com",
            phone: "+242-555-1000",
            orders: 18,
            inventory: "Stable",
            status: "Active",
            source: 'Manual',
            clientType: 'Personal',
            plan: 'Executive',
            billingCycle: 'Monthly',
            paymentMethod: 'Wire Transfer'
        },
        {
            id: 'CLT-002',
            name: 'Bahamas Luxury Estates',
            location: 'Nassau',
            orders: 12,
            inventory: 'Stable',
            status: 'Active',
            source: 'Subscriber',
            clientType: 'Personal',
            contact: 'John Smith',
            email: 'john@bahamasluxury.com',
            phone: '+1-242-555-1212',
            address: '123 Ocean Drive, Nassau, NP'
        },
        {
            id: 'CLT-003',
            name: 'Yacht "Sea Star"',
            location: 'Highbourne Cay',
            orders: 8,
            inventory: 'Low Stock',
            status: 'Warning',
            source: 'Manual',
            clientType: 'Personal',
            contact: 'Capt. James Hook',
            email: 'captain@seastar.com',
            phone: '+1-242-555-4545',
            address: 'Slip 42, Marina Bay, Exuma'
        }
    ]);

    const [vendors, setVendors] = useState([
        { id: 'VND-001', name: 'Caribbean Fine Provisions', rating: 97, delivery: 94, category: 'Grocery', contact: 'Mark Evans', address: '12 Industrial Way, Nassau', phone: '+242-321-4567', email: 'info@caribbeanfine.com' },
        { id: 'VND-002', name: 'Nassau Wine & Spirits', rating: 95, delivery: 91, category: 'Jewelry', contact: 'Sarah J.', address: '45 Bay St, Nassau', phone: '+242-456-7890', email: 'orders@nassauwine.com' },
        { id: 'VND-003', name: 'Bahamas Marine Tech', rating: 89, delivery: 96, category: 'Automotive', contact: 'Dave Rolle', address: 'Marina Point, Nassau', phone: '+242-567-8901', email: 'tech@bahamasmarine.com' },
        { id: 'VND-004', name: 'Island Linen & Hospitality', rating: 93, delivery: 90, category: 'Stationary Supplies', contact: 'Linda K.', address: '10 Oakes Field, Nassau', phone: '+242-678-9012', email: 'supplies@islandlinen.com' },
        { id: 'VND-005', name: 'Local Pharmacy Plus', rating: 91, delivery: 88, category: 'Pharmacy', contact: 'Dr. Mike', address: 'West Bay St, Nassau', phone: '+242-322-1100', email: 'rx@localpharmacy.com' },
        { id: 'VND-006', name: 'Nassau Maintenance Group', rating: 85, delivery: 92, category: 'Maintenance', contact: 'Sam Taylor', address: 'Soldier Rd, Nassau', phone: '+242-325-1122', email: 'service@nassaumaint.com' },
        { id: 'VND-007', name: 'General Supply Bahamas', rating: 88, delivery: 85, category: 'General', contact: 'Rose B.', address: 'Bloom St, Nassau', phone: '+242-789-0123', email: 'rose@tropicalblooms.com' },
    ]);

    const [inventory, setInventory] = useState([
        { id: 1, name: "Dom Perignon Champagne (2015)", category: "Beverage", price: 350, qty: 18, location: "Nassau Warehouse", status: "Warning", stockDate: '2025-02-10', stockValue: 6300, vendorId: 2, vendorName: 'Nassau Wine & Spirits', issuedTo: null },
        { id: 2, name: "Marine Grade Fuel (ULP)", category: "Marine Supply", price: 1.85, qty: 2200, location: "Nassau Fuel Terminal", status: "Critical", stockDate: '2025-03-01', stockValue: 4070, vendorId: 3, vendorName: 'Bahamas Marine Tech', issuedTo: null },
        { id: 3, name: "Fresh Atlantic Lobster", category: "Provisions", price: 85, qty: 22, location: "Island Fresh Distribution", status: "Warning", stockDate: '2025-03-02', stockValue: 1870, vendorId: 1, vendorName: 'Caribbean Fine Provisions', issuedTo: null },
        { id: 4, name: "Imperial Oolong Tea (Loose Leaf)", category: "Provisions", price: 45, qty: 120, location: "Island Fresh Distribution", status: "Stable", stockDate: '2025-03-02', stockValue: 5400, vendorId: 1, vendorName: 'Caribbean Fine Provisions', issuedTo: null },
        { id: 5, name: "Egyptian Cotton Linens (King Set)", category: "Housekeeping", price: 45, qty: 80, location: "Nassau Hub", status: "Stable", stockDate: '2025-01-15', stockValue: 3600, vendorId: 4, vendorName: 'Island Linen & Hospitality', issuedTo: null },
    ]);

    const [users, setUsers] = useState([
        { id: 1, name: "Marcus Sterling", email: "marcus@zanezion.com", password: "admin", role: "Super Admin", status: "Active", joinedDate: '2020-01-15', isSalaried: true, vacationBalance: 80, bankingInfo: { bank: 'Commonwealth Bank', account: '****4821', routing: '00100', method: 'Direct Deposit' } },
        { id: 2, name: "Amara Thompson", email: "amara@zanezion.com", password: "staff", role: "Operational Staff", status: "Active", joinedDate: '2021-03-10', isSalaried: true, vacationBalance: 80, bankingInfo: { bank: 'Royal Bank of Canada (Nassau)', account: '****3317', routing: '00201', method: 'Direct Deposit' } },
        { id: 3, name: "Devon Williams", email: "devon@zanezion.com", password: "staff", role: "Operational Staff", status: "Active", joinedDate: '2019-11-20', isSalaried: true, vacationBalance: 40, bankingInfo: { bank: 'Bank of The Bahamas', account: '****7743', routing: '00302', method: 'Direct Deposit' } },
        { id: 4, name: "Kezia Clarke", email: "kezia@zanezion.com", password: "staff", role: "Operational Staff", status: "Active", joinedDate: '2022-06-05', isSalaried: true, vacationBalance: 80, bankingInfo: { bank: 'Scotiabank Bahamas', account: '****5509', routing: '00403', method: 'Direct Deposit' } },
        { id: 5, name: "Jaheem Brown", email: "jaheem@zanezion.com", password: "staff", role: "Field Staff", status: "Active", joinedDate: '2023-08-12', isSalaried: false, vacationBalance: 0, bankingInfo: { bank: 'Commonwealth Bank', account: '****2284', routing: '00100', method: 'Direct Deposit' }, isAvailable: true },
        { id: 6, name: "Andre Rolle", email: "andre@zanezion.com", password: "staff", role: "Field Staff", status: "Active", joinedDate: '2016-02-28', isSalaried: false, vacationBalance: 0, bankingInfo: { bank: 'Fidelity Bank Bahamas', account: '****6612', routing: '00504', method: 'Direct Deposit' }, isAvailable: false },
        { id: 7, name: "John Pemberton", email: "pemberton@goldwynn.com", password: "client", role: "client", status: "Active", joinedDate: '2024-01-10', clientId: 1 },
    ]);

    const [purchaseRequests, setPurchaseRequests] = useState([
        { id: 'REQ-001', items: [{ name: 'Fresh Atlantic Lobster', qty: 15, price: 85 }], requester: 'Amara Thompson', date: '2025-03-01', priority: 'High', status: 'Pending', department: 'Catering', createdAt: '2025-03-01T09:00:00Z', clientId: 1 },
        { id: 'REQ-002', items: [{ name: 'Dom Perignon Champagne', qty: 12, price: 350 }], requester: 'Kezia Clarke', date: '2025-03-01', priority: 'Urgent', status: 'Approved', department: 'Beverage', createdAt: '2025-03-01T10:30:00Z', clientId: 2 },
    ]);

    const [quotes, setQuotes] = useState([
        { id: 'Q-901', vendorId: 3, items: [{ name: 'Organic Berries', price: 300, qty: 1 }], total: 300, date: '2024-06-05', status: 'Active', leadTime: '2 days', validity: '2024-06-30' },
        { id: 'Q-903', vendorId: 1, items: [{ name: 'Fine Linen Set', price: 1200, qty: 1 }], total: 1200, date: '2024-06-04', status: 'Accepted', leadTime: '5 days', validity: '2024-06-25' },
    ]);

    const [orders, setOrders] = useState([
        { id: 'ORD-001', clientId: 1, client: 'Goldwynn Residences', items: [{ name: 'Dom Perignon Champagne', qty: 6, price: 350 }], total: 2100, vendorId: 2, vendor: 'Nassau Wine & Spirits', status: 'Delivered', date: '2025-03-01', createdAt: '2025-03-01T08:00:00Z', type: 'Provisioning' },
        { id: 'ORD-002', clientId: 2, client: 'SY Azure', items: [{ name: 'Fresh Atlantic Lobster', qty: 10, price: 85 }], total: 850, vendorId: 1, vendor: 'Caribbean Fine Provisions', status: 'In Transit', date: '2025-03-02', createdAt: '2025-03-02T09:00:00Z', type: 'Procurement' },
        { id: 'ORD-003', clientId: 3, client: 'Lyford Cay Estate', items: [{ name: 'Egyptian Cotton Linens', qty: 20, price: 45 }], total: 900, vendorId: 4, vendor: 'Island Linen & Hospitality', status: 'Processing', date: '2025-03-02', createdAt: '2025-03-02T11:00:00Z', type: 'Inventory' },
    ]);

    const [invoices, setInvoices] = useState([
        { id: 'INV-001', orderId: 'ORD-001', clientId: 1, totalAmount: 2100, paidAmount: 2100, status: 'Paid', date: '2025-03-01' },
        { id: 'INV-002', orderId: 'ORD-002', clientId: 2, totalAmount: 850, paidAmount: 0, status: 'Unpaid', date: '2025-03-02' },
        { id: 'INV-003', orderId: 'ORD-003', clientId: 3, totalAmount: 900, paidAmount: 450, status: 'Partially Paid', date: '2025-03-02' },
    ]);

    const [payments, setPayments] = useState([
        { id: 'PAY-001', invoiceId: 'INV-001', amount: 2100, method: 'Wire Transfer', date: '2025-03-01' },
        { id: 'PAY-002', invoiceId: 'INV-003', amount: 450, method: 'Credit Card', date: '2025-03-02' },
    ]);

    const [deliveries, setDeliveries] = useState([
        { id: 'DEL-001', orderId: 'ORD-001', item: 'Champagne Delivery — Goldwynn', items: [{ name: 'Dom Perignon', qty: 6 }], vehicleId: 'VAN-01', mode: 'Road', eta: '9:15 AM', location: 'Cable Beach, Nassau', status: 'Completed', driver: 'Jaheem Brown', clientId: 1, pod: { signature: 'J. Pemberton', image: null }, isAbroad: false },
        { id: 'DEL-002', orderId: 'ORD-002', item: 'Seafood Run — SY Azure', items: [{ name: 'Atlantic Lobster', qty: 10 }], vehicleId: 'VSL-02', mode: 'Sea', eta: '11:30 AM', location: 'Nassau Harbour Marina', status: 'In Transit', driver: 'Devon Williams', clientId: 2, isAbroad: true },
        { id: 'DEL-003', orderId: 'ORD-003', item: 'Linen Supply — Lyford Cay', items: [{ name: 'Cotton Linens', qty: 20 }], vehicleId: 'VAN-01', mode: 'Road', eta: '2:00 PM', location: 'Lyford Cay, Nassau', status: 'Pending', driver: 'Andre Rolle', clientId: 3, isAbroad: false },
        { id: 'DEL-004', orderId: 'ORD-004', item: 'Imperial Oolong Tea — High Tea Protocol', items: [{ name: 'Imperial Oolong Tea (Loose Leaf)', qty: 5 }], vehicleId: 'VAN-02', mode: 'Road', eta: '4:30 PM', location: 'Goldwynn Residences — Penthouse Lounge', status: 'Pending', driver: 'Jaheem Brown', clientId: 1, isAbroad: false },
    ]);

    const [logs, setLogs] = useState([]);
    const [fleet, setFleet] = useState([
        { id: 'VAN-01', type: 'Cargo Van', model: 'Ford Transit Refrigerated', fuel: '78%', status: 'Active', capacity: '900KG', insurancePolicy: 'POL-991', registrationExpiry: '2025-10-15', inspectionDate: '2024-06-01', diagnosticStatus: 'Healthy' },
        { id: 'VAN-02', type: 'Luxury Van', model: 'Mercedes Sprinter', fuel: '91%', status: 'Active', capacity: '700KG', insurancePolicy: 'POL-992', registrationExpiry: '2025-11-20', inspectionDate: '2024-05-15', diagnosticStatus: 'Service Due' },
        { id: 'VSL-01', type: 'Supply Vessel', model: 'Boston Whaler 270', fuel: '65%', status: 'Active', capacity: '500KG', insurancePolicy: 'POL-MAR-01', registrationExpiry: '2026-03-30', inspectionDate: '2024-02-10', diagnosticStatus: 'Healthy' },
        { id: 'VSL-02', type: 'Speed Boat', model: 'Hydra-Sports 3000', fuel: '88%', status: 'Active', capacity: '300KG', insurancePolicy: 'POL-MAR-02', registrationExpiry: '2025-08-05', inspectionDate: '2024-03-12', diagnosticStatus: 'Maintenance Required' },
    ]);

    const [supportTickets, setSupportTickets] = useState([
        { id: 'TKT-101', clientId: 'CLT-001', clientName: 'Goldwynn Residences', subject: 'Customs Clearance Delay', category: 'Logistics', status: 'Open', priority: 'High', date: '2025-03-05', messages: [{ sender: 'client', text: 'Our gourmet provision shipment is held at the dock.', time: '10:00 AM' }] },
        { id: 'TKT-102', clientId: 'CLT-002', clientName: 'Bahamas Luxury Estates', subject: 'Invoice Discrepancy', category: 'Finance', status: 'Resolved', priority: 'Medium', date: '2025-03-04', messages: [{ sender: 'client', text: 'Double billing on last weeks delivery.', time: '02:30 PM' }, { sender: 'admin', text: 'Corrected. Credit note issued.', time: '04:00 PM' }] }
    ]);

    const [projects, setProjects] = useState([
        { id: 'PRJ-001', name: "Blue Lagoon Island Wedding Setup", client: "The Pemberton Family", start: "2025-04-10", location: "Blue Lagoon Island, Nassau", status: "In Progress" },
        { id: 'PRJ-002', name: "Goldwynn Poolside Gala", client: "Goldwynn Residences", start: "2025-04-18", location: "Cable Beach, Nassau", status: "Planning" },
        { id: 'PRJ-003', name: "SY Azure Full Provision Run", client: "SY Azure", start: "2025-03-05", location: "Nassau Harbour Marina", status: "In Progress" },
    ]);

    const [staffAssignments, setStaffAssignments] = useState([
        { id: 'TSK-001', task: 'Deliver Champagne to Goldwynn Penthouse', location: 'Cable Beach, Nassau', status: 'Completed', priority: 'High', assignee: 'Jaheem Brown', assigneeId: '5', distance: '4.2km' },
        { id: 'TSK-002', task: 'Seafood Delivery to SY Azure (Dock 7)', location: 'Nassau Harbour Marina', status: 'In Progress', priority: 'Critical', assignee: 'Devon Williams', assigneeId: '3', distance: '2.8km' },
        { id: 'TSK-003', task: 'Linen & Supplies — Lyford Cay Estate', location: 'Lyford Cay, Nassau', status: 'Pending', priority: 'Normal', assignee: 'Alex Sterling', assigneeId: '1', distance: '11km' },
        { id: 'TSK-004', task: 'Blue Lagoon Island — Event Setup Supplies', location: 'Blue Lagoon Island (Boat)', status: 'Pending', priority: 'High', assignee: 'Alex Sterling', assigneeId: '1', distance: 'Sea Route' },
        { id: 'TSK-005', task: 'VIP Guest Pick-up — Lynden Pindling International', location: 'Nassau Airport (LPIA)', status: 'Pending', priority: 'High', assignee: 'Alex Sterling', assigneeId: '1', distance: '14.5km', dispatcherNotes: 'Guest arrives on private jet N1234. Protocol Alpha.' },
    ]);

    const [payHistory, setPayHistory] = useState([
        { id: 'PAY-H01', period: 'Mar 1 - Mar 15, 2025', date: '2025-03-16', hours: 88, total: '$2,200.00', status: 'Paid' },
        { id: 'PAY-H02', period: 'Feb 15 - Feb 28, 2025', date: '2025-03-01', hours: 80, total: '$1,600.00', status: 'Paid' },
        { id: 'PAY-H03', period: 'Feb 1 - Feb 14, 2025', date: '2025-02-15', hours: 76, total: '$1,520.00', status: 'Paid' },
    ]);

    const [teams, setTeams] = useState([
        { id: 'TM-01', team: 'Delivery Team', lead: 'Jaheem Brown', location: 'Nassau Hub', members: 3, status: 'Active' },
        { id: 'TM-02', team: 'Concierge Team', lead: 'Amara Thompson', location: 'Nassau Office', members: 4, status: 'Active' },
        { id: 'TM-03', team: 'Marine Logistics', lead: 'Devon Williams', location: 'Nassau Harbour', members: 2, status: 'Active' },
    ]);

    const [audits, setAudits] = useState([
        { id: 'IA-2024-001', date: '2024-06-01', type: 'Full Stock Audit', auditor: 'Marcus Sterling', status: 'Verified', accuracy: '99.8%', results: [] },
        { id: 'IA-2024-002', date: '2024-05-15', type: 'Spot Check (Section B)', auditor: 'Devon Williams', status: 'Verified', accuracy: '100%', results: [] },
        { id: 'IA-2024-003', date: '2024-05-01', type: 'Fuel Reservoir Audit', auditor: 'Amara Thompson', status: 'Discrepancy', accuracy: '94.2%', results: [{ item: 'Marine Fuel', expected: 2500, actual: 2200, variance: -300 }] },
    ]);

    const [warehouses, setWarehouses] = useState([
        { id: 1, name: 'Nassau Central Hub', location: 'Nassau, NP', capacity: '68%', manager: 'Kezia Clarke', status: 'Stable' },
        { id: 2, name: 'Harbour Cold Storage', location: 'Potters Cay, Nassau', capacity: '55%', manager: 'Devon Williams', status: 'Stable' },
    ]);

    const [guestRequests, setGuestRequests] = useState([
        { id: 1, guest: 'Penthouse 5 — Mr. Pemberton', request: 'Veuve Clicquot x6 & Cheese Board for arrival', time: '6:00 PM', priority: 'High', status: 'In Progress' },
        { id: 2, guest: 'SY Azure — Captain Hayes', request: 'Fresh Sushi Grade Fish & Ice Delivery (50lbs)', time: '10:00 AM', priority: 'Immediate', status: 'Confirmed' },
        { id: 3, guest: 'Lyford Cay — Lady Morrison', request: 'Tropical Floral Arrangement — Master Suite', time: '2:00 PM', priority: 'Medium', status: 'Pending' },
    ]);

    const [events, setEvents] = useState([
        { id: 1, title: 'Blue Lagoon Island Wedding', date: '2025-04-12', location: 'Blue Lagoon Island', status: 'Planning', client: 'The Pemberton Family' },
        { id: 2, title: 'Goldwynn Poolside Gala', date: '2025-04-18', location: 'Cable Beach, Nassau', status: 'Active', client: 'Goldwynn Residences' },
        { id: 3, title: 'SY Azure Charter Dinner', date: '2025-03-08', location: 'Nassau Harbour', status: 'Completed', client: 'SY Azure' },
    ]);

    const [luxuryItems, setLuxuryItems] = useState([
        { id: 1, item: 'Richard Mille Watch RM-011', owner: 'Confidential', vault: 'Vault Alpha', value: '$285K', status: 'Stored' },
        { id: 2, item: 'SY Azure — Tender Keys', owner: 'Capt. D. Hayes', vault: 'Vault Beta', value: 'N/A', status: 'In Transit' },
        { id: 3, item: 'Estate Jewelry Collection', owner: 'Lady Morrison', vault: 'Vault Alpha', value: '$620K', status: 'Stored' },
    ]);

    const [routes, setRoutes] = useState([
        { id: 1, name: 'Nassau Hub → Cable Beach', type: 'Cargo Van', status: 'Active', driver: 'Jaheem Brown', dist: '14km', time: '25m' },
        { id: 2, name: 'Potters Cay → Blue Lagoon Island', type: 'Supply Vessel', status: 'Active', driver: 'Devon Williams', dist: '8.5nm', time: '40m' },
        { id: 3, name: 'Nassau → Kamalame Cay (Andros)', type: 'Speed Boat', status: 'Active', driver: 'Robert Fox', dist: '32nm', time: '1h 10m' },
        { id: 4, name: 'Nassau Hub → Lyford Cay', type: 'Cargo Van', status: 'Active', driver: 'Andre Rolle', dist: '22km', time: '35m' },
    ]);

    const [urgentTasks, setUrgentTasks] = useState([
        { id: 1, task: 'SY Azure — Ice & Provisions ASAP', location: 'Nassau Harbour Dock 7', time: 'ASAP', priority: 'Tier 1' },
        { id: 2, task: 'Cold Storage Temp Alert — Harbour Unit', location: 'Potters Cay Storage', time: '30 mins', priority: 'Tier 1' },
        { id: 3, task: 'Lyford Cay — Same Day Floral Request', location: 'Lyford Cay, Nassau', time: 'By 3:00 PM', priority: 'Critical' },
    ]);

    const [tracking, setTracking] = useState([
        { id: 'TRK-501', asset: 'Vintage Champagne Case', location: 'Marina Port', signal: 'Strong', status: 'Active', eta: '5 mins' },
        { id: 'TRK-502', asset: 'Luxury Furniture Set', location: 'Grand Ballroom', signal: 'Stable', status: 'On Way', eta: '15 mins' },
    ]);
    const [stockMovements, setStockMovements] = useState([
        { id: 'SM-1001', client: 'Goldwynn Residences', item: 'Dom Perignon Champagne', qty: 2, warehouse: 'Warehouse A', issuedBy: 'Kezia Clarke', date: '2025-03-01', time: '10:30 AM', type: 'Issue' },
        { id: 'SM-1002', vendor: 'Nassau Wine & Spirits', item: 'Vintage Merlot', qty: 24, warehouse: 'Warehouse A', price: 45, date: '2025-03-02', time: '02:15 PM', type: 'Entry' },
    ]);

    const [cart, setCart] = useState([]);
    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, { ...item, qty: 1 }];
        });
        addLog({ action: 'Cart Update', detail: `Added ${item.name} to the procurement queue.`, type: 'system' });
    };

    const removeFromCart = (id) => {
        setCart(prev => {
            const item = prev.find(i => i.id === id);
            if (item && item.qty > 1) {
                return prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i);
            }
            return prev.filter(i => i.id !== id);
        });
    };
    const clearCart = () => setCart([]);

    const [currentUser, setCurrentUser] = useState({
        id: 1,
        name: 'Alex Sterling',
        email: 'alex@zanezion.com',
        location: 'Monaco HQ',
        role: 'Super Admin'
    });

    const [leaveRequests, setLeaveRequests] = useState([
        { id: 1, userId: 3, name: 'Devon Williams', type: 'Vacation Leave', start: '2024-07-01', end: '2024-07-15', status: 'Pending', reason: 'Annual Leave' },
        { id: 2, userId: 2, name: 'Amara Thompson', type: 'Sick Leave', start: '2024-06-10', end: '2024-06-12', status: 'Approved', reason: 'Medical' },
        { id: 3, userId: 5, name: 'Jaheem Brown', type: 'Death Leave', start: '2025-04-01', end: '2025-04-04', status: 'Approved', reason: 'Immediate family bereavement' }
    ]);

    const [revenueFilter, setRevenueFilter] = useState('Weekly');
    const [activePlan, setActivePlan] = useState('Institutional Premium');
    const [accessPlans, setAccessPlans] = useState(ACCESS_PLANS);

    const addPlan = (plan) => {
        setAccessPlans(prev => [...prev, { ...plan, id: plan.id || `plan-${Date.now()}` }]);
        addLog({ action: 'Plan Created', detail: `Super Admin created new protocol: ${plan.name}`, type: 'system' });
    };

    const recordLoss = (loss) => {
        const itemVal = inventory.find(i => i.name === loss.item)?.price || 0;
        const lossValue = itemVal * parseInt(loss.qty);

        setStockMovements(prev => [{
            ...loss,
            id: `LS-${Date.now()}`,
            type: 'Loss',
            value: lossValue,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString()
        }, ...prev]);

        setInventory(prev => prev.map(i => {
            if (i.name === loss.item) {
                const newQty = Math.max(0, i.qty - parseInt(loss.qty));
                return {
                    ...i,
                    qty: newQty,
                    status: newQty <= 5 ? 'Critical' : newQty < 10 ? 'Warning' : 'Stable'
                };
            }
            return i;
        }));
        addLog({ action: 'Asset Loss Recorded', detail: `Loss of ${loss.qty} units for ${loss.item} noted: ${loss.reason || 'No reason provided'}. Auditor notified.`, type: 'inventory' });
    };

    const addStockEntry = (entry) => {
        setStockMovements(prev => [{ ...entry, id: `SE-${Date.now()}`, type: 'Entry', date: new Date().toISOString().split('T')[0], time: new Date().toLocaleTimeString() }, ...prev]);
        setInventory(prev => {
            const existing = prev.find(i => i.name === entry.item);
            if (existing) {
                return prev.map(i => i.name === entry.item ? { ...i, qty: i.qty + parseInt(entry.qty), price: entry.price || i.price } : i);
            }
            return [...prev, { id: Date.now(), name: entry.item, category: entry.category, qty: parseInt(entry.qty), price: entry.price, location: entry.warehouse, status: 'In Stock', stockDate: new Date().toISOString().split('T')[0] }];
        });

        // Update PR status if linked
        if (entry.prRef) {
            setPurchaseRequests(prev => prev.map(pr => pr.id === entry.prRef ? { ...pr, status: 'Received' } : pr));
        }

        addLog({ action: 'Stock Entry', detail: `Procured ${entry.qty} units of ${entry.item} from ${entry.vendor || entry.vendorName || 'Unknown Partner'}.`, type: 'inventory' });
    };

    const issueStock = (issue) => {
        setStockMovements(prev => [{ ...issue, id: `SI-${Date.now()}`, type: 'Issue', date: new Date().toISOString().split('T')[0], time: new Date().toLocaleTimeString() }, ...prev]);
        setInventory(prev => prev.map(i => {
            if (i.name === issue.item) {
                const newQty = Math.max(0, i.qty - parseInt(issue.qty));

                // Automate low stock alert to Purchase Requests as per flow chart
                if (newQty < 10) {
                    setPurchaseRequests(prList => {
                        // Prevent duplicate pending PRs for same item
                        if (prList.some(pr => pr.item === issue.item && pr.status !== 'Received' && pr.status !== 'Approved')) return prList;
                        return [{
                            id: `PR-${Math.floor(8000 + Math.random() * 999)}`,
                            item: issue.item,
                            qty: 50, // Auto restock batch
                            department: 'Automated Replenishment',
                            status: 'Pending',
                            priority: 'High',
                            date: new Date().toISOString().split('T')[0]
                        }, ...prList];
                    });
                    addLog({ action: 'Automated Procurement Alert', detail: `Low stock detected for ${issue.item}. System generated auto-PR.`, type: 'automated' });
                }

                return {
                    ...i,
                    qty: newQty,
                    status: newQty <= 5 ? 'Critical' : newQty < 10 ? 'Warning' : 'Stable',
                    issuedTo: issue.issuedTo || i.issuedTo,
                    lastIssuedDate: new Date().toISOString().split('T')[0]
                };
            }
            return i;
        }));
        addLog({ action: 'Stock Issue', detail: `Issued ${issue.qty} units of ${issue.item} to ${issue.client || issue.issuedTo}.`, type: 'inventory' });
    };

    const updatePlan = (updated) => {
        setAccessPlans(prev => prev.map(p => p.id === updated.id ? updated : p));
        addLog({ action: 'Plan Updated', detail: `Super Admin modified protocol: ${updated.name}`, type: 'system' });
    };

    const deletePlan = (id) => {
        setAccessPlans(prev => prev.filter(p => p.id !== id));
        addLog({ action: 'Plan Deleted', detail: `Super Admin removed protocol ID: ${id}`, type: 'system' });
    };


    const dispatchSubscriptionRequest = (request) => {
        setSubscriptionRequests(prev => [...prev, {
            ...request,
            id: `SUB-REQ-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            status: 'Pending'
        }]);
        addLog({ action: 'Subscription Request', detail: `New protocol request from ${request.clientName} for ${request.plan}.`, type: 'system' });
    };

    const updateSubscriptionRequest = (id, status) => {
        setSubscriptionRequests(prev => prev.map(req =>
            req.id === id ? { ...req, status } : req
        ));

        const req = (subscriptionRequests || []).find(r => r.id === id);
        if (status === 'Approved' && req) {
            const clientId = Date.now();
            const password = Math.random().toString(36).slice(-8); // Random 8-char password

            // 1. Create the Client Entity
            addClient({
                id: clientId,
                name: req.clientName,
                contact: req.contact,
                email: req.email,
                location: req.country || 'Bahamas',
                status: 'Active',
                source: 'Subscriber',
                clientType: 'SaaS',
                plan: req.plan.replace(' Protocol', ''),
                balance: 0,
                joinedDate: new Date().toISOString().split('T')[0]
            });

            // 2. Create the User Credentials
            addUser({
                id: `USR-${Date.now()}`,
                name: req.contact,
                email: req.email,
                password: password, // In UI Phase, we store it plainly for demo
                role: 'client',
                clientId: clientId,
                status: 'Active',
                joinedDate: new Date().toISOString().split('T')[0]
            });

            addLog({ action: 'Request Approved', detail: `Provisioned workspace for ${req.clientName}. Protocol: ${req.plan}. Credentials generated for ${req.email}.`, type: 'system' });

            return { email: req.email, password: password, clientName: req.clientName, plan: req.plan };
        } else if (req) {
            addLog({ action: 'Request Updated', detail: `Registration for ${req.clientName} marked as ${status}.`, type: 'alert' });
        }
        return null;
    };

    const deleteSubscriptionRequest = (id) => {
        setSubscriptionRequests(prev => prev.filter(req => req.id !== id));
        addLog({ action: 'Request Purged', detail: `Institutional request ${id} removed from queue.`, type: 'alert' });
    };

    const getRevenueChartData = () => {
        switch (revenueFilter) {
            case 'Daily':
                return [
                    { name: '08:00', revenue: 2000 },
                    { name: '10:00', revenue: 5000 },
                    { name: '12:00', revenue: 8000 },
                    { name: '14:00', revenue: 12000 },
                    { name: '16:00', revenue: 15000 },
                    { name: '18:00', revenue: 18000 },
                    { name: '20:00', revenue: 22000 },
                ];
            case 'Weekly':
                return [
                    { name: 'Mon', revenue: 12000 },
                    { name: 'Tue', revenue: 15000 },
                    { name: 'Wed', revenue: 9000 },
                    { name: 'Thu', revenue: 18000 },
                    { name: 'Fri', revenue: 22000 },
                    { name: 'Sat', revenue: 25000 },
                    { name: 'Sun', revenue: 21000 },
                ];
            case 'Monthly':
                return [
                    { name: 'Week 1', revenue: 45000 },
                    { name: 'Week 2', revenue: 52000 },
                    { name: 'Week 3', revenue: 48000 },
                    { name: 'Week 4', revenue: 61000 },
                ];
            case 'Quarterly':
                return [
                    { name: 'Jan', revenue: 45000 },
                    { name: 'Feb', revenue: 52000 },
                    { name: 'Mar', revenue: 48000 },
                ];
            case 'Yearly':
            case 'Total':
                return [
                    { name: '2021', revenue: 850000 },
                    { name: '2022', revenue: 1200000 },
                    { name: '2023', revenue: 1800000 },
                    { name: '2024', revenue: 2400000 },
                    { name: '2025', revenue: 3800000 },
                    { name: '2026', revenue: 5200000 },
                ];
            case 'Annual':
                return [
                    { name: '2020', revenue: 450000 },
                    { name: '2021', revenue: 520000 },
                    { name: '2022', revenue: 480000 },
                    { name: '2023', revenue: 610000 },
                    { name: '2024', revenue: 750000 },
                ];
            default:
                return [];
        }
    };

    const hasPermission = (permission) => {
        if (!currentUser) return false;
        if (currentUser.role === 'Super Admin') return true;
        // Financial restrictions
        if (['financial_reports', 'revenue_analytics', 'invoice_management'].includes(permission)) {
            return currentUser.role === 'Super Admin';
        }
        return true;
    };

    // --- INTEGRATED DATA FLOW ACTIONS ---

    const addOrder = (order) => {
        if (!order.items || order.items.length === 0) {
            alert("Order Error: No items in manifest.");
            return;
        }

        // 0. Resolve Client ID if missing but name is present
        let targetClientId = order.clientId;
        if (!targetClientId && order.client) {
            const foundClient = clients.find(c => c.name === order.client);
            if (foundClient) targetClientId = foundClient.id;
        }
        if (!targetClientId) targetClientId = 1;

        const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
        const total = (order.items || []).reduce((acc, item) => acc + (parseFloat(item.price || 0) * parseInt(item.qty || 0)), 0);

        const newOrder = {
            ...order,
            id: orderId,
            clientId: targetClientId,
            total,
            status: 'Pending Review', // Changed from Processing to Pending Review
            createdAt: new Date().toISOString(),
            deliveryType: order.deliveryType || 'Road'
        };

        // 1. Save Order ONLY - Business protocol Phase 3
        setOrders(prev => [newOrder, ...prev]);

        addLog({
            action: 'Order Received',
            detail: `${orderId} submitted by client. Awaiting Admin Review & Project Conversion.`,
            type: 'system'
        });
    };

    const generateInvoiceFromOrder = (order) => {
        const invoiceId = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
        const total = (order.items || []).reduce((acc, item) => acc + (parseFloat(item.price || 0) * parseInt(item.qty || 0)), 0);

        const newInvoice = {
            id: invoiceId,
            orderId: order.id,
            clientId: order.clientId,
            client: order.client || 'Institutional Guest',
            date: new Date().toISOString().split('T')[0],
            dueDate: order.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            totalAmount: total,
            paidAmount: 0,
            status: 'Unpaid',
            items: order.items,
            createdAt: new Date().toISOString()
        };

        setInvoices(prev => [newInvoice, ...prev]);
        addLog({ action: 'Manual Ledger Commit', detail: `Institutional Ledger ${invoiceId} generated for mission ${order.id}${order.dueDate ? ` with terms due ${order.dueDate}` : ''}.`, type: 'system' });
        return invoiceId;
    };

    const settleInvoice = (invoiceId, paymentData) => {
        setInvoices(prev => prev.map(inv => {
            if (inv.id === invoiceId) {
                const newPaidAmount = (inv.paidAmount || 0) + (paymentData.amount || 0);
                const status = newPaidAmount >= inv.totalAmount ? 'Paid' : 'Partially Paid';
                return { ...inv, paidAmount: newPaidAmount, status: status };
            }
            return inv;
        }));
        const paymentId = `PAY-${Date.now()}`;
        setPayments(prev => [{
            id: paymentId,
            invoiceId: invoiceId,
            amount: paymentData.amount,
            method: paymentData.method || 'Stripe',
            date: new Date().toISOString().split('T')[0]
        }, ...prev]);
        addLog({ action: 'Payment Processed', detail: `Invoice ${invoiceId} updated with payment of ${paymentData.amount} via ${paymentData.method}`, type: 'system' });
    };

    const updateDelivery = (updated) => {
        setDeliveries(prev => prev.map(d => d.id === updated.id ? {
            ...updated,
            updatedAt: new Date().toISOString()
        } : d));

        // If delivered, update order status
        if (updated.status === 'Delivered' || updated.status === 'Completed') {
            setOrders(prev => prev.map(o => o.id === updated.orderId ? { ...o, status: 'Delivered' } : o));
        }
    };

    const updateInvoice = (updated) => {
        setInvoices(prev => prev.map(inv => inv.id === updated.id ? updated : inv));
        addLog({ action: 'Invoice Updated', detail: `Institutional ledger ${updated.id} parameters recalibrated.`, type: 'system' });
    };

    const deleteInvoice = (id) => {
        setInvoices(prev => prev.filter(inv => inv.id !== id));
        addLog({ action: 'Invoice Terminated', detail: `Financial record ${id} removed from ledger.`, type: 'alert' });
    };

    const confirmDeliveryReceipt = (deliveryId, clientName) => {
        setDeliveries(prev => prev.map(d => d.id === deliveryId ? {
            ...d,
            clientConfirmed: true,
            clientConfirmedAt: new Date().toISOString(),
            clientSignature: clientName,
            status: 'Delivered' // Ensure status is set to Delivered if client confirms
        } : d));

        const delivery = deliveries.find(d => d.id === deliveryId);
        if (delivery) {
            setOrders(prev => prev.map(o => o.id === delivery.orderId ? { ...o, status: 'Delivered' } : o));
        }

        addLog({
            action: 'Client Confirmation',
            detail: `Client ${clientName} confirmed receipt of dispatch ${deliveryId}.`,
            type: 'system'
        });
    };

    // --- UNIVERSAL CRUD PROTOCOLS ---
    const addVendor = (vendor) => {
        setVendors(prev => [{ ...vendor, id: Date.now() }, ...prev]);
        addLog({ action: 'Vendor Onboarding', detail: `Registered ${vendor.name} as verified partner.`, type: 'system' });
    };

    const updateVendor = (updated) => {
        setVendors(prev => prev.map(v => v.id === updated.id ? updated : v));
        addLog({ action: 'Vendor Update', detail: `Recalibrated profile for ${updated.name}.`, type: 'system' });
    };

    const deleteVendor = (id) => {
        setVendors(prev => prev.filter(v => v.id !== id));
        addLog({ action: 'Vendor Removal', detail: `Decommissioned vendor reference ID ${id}.`, type: 'system' });
    };

    const addUser = (user) => {
        setUsers(prev => [{ ...user, id: user.id || Date.now() }, ...prev]);
        addLog({ action: 'User Onboarding', detail: `Registered ${user.name} as ${user.role}.`, type: 'system' });
    };

    const updateUser = (updated) => {
        setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
        addLog({ action: 'User Profile Updated', detail: `Synchronized credentials for ${updated.name}.`, type: 'system' });
    };

    const deleteUser = (id) => {
        setUsers(prev => prev.filter(u => u.id !== id));
        addLog({ action: 'User Decommissioned', detail: `Revoked access for User ID ${id}.`, type: 'system' });
    };

    const addInventory = (item) => {
        setInventory(prev => [{
            ...item,
            id: Date.now(),
            stockValue: (parseFloat(item.price) || 0) * (parseInt(item.qty) || 0),
            stockDate: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString()
        }, ...prev]);
        addLog({ action: 'Asset Intake', detail: `Ingested ${item.name} into Warehouse.`, type: 'system' });
    };

    const updateInventory = (updated) => {
        setInventory(prev => prev.map(i => i.id === updated.id ? {
            ...updated,
            stockValue: (parseFloat(updated.price) || 0) * (parseInt(updated.qty) || 0)
        } : i));
        addLog({ action: 'Asset Recalibration', detail: `Updated stock metrics for ${updated.name}.`, type: 'system' });
    };

    const deleteInventory = (id) => {
        setInventory(prev => prev.filter(i => i.id !== id));
        addLog({ action: 'Asset Decommission', detail: `Removed asset ID ${id} from ledger.`, type: 'system' });
    };

    const issueInventory = (id, qty, issuedTo) => {
        setInventory(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(0, item.qty - qty);
                return {
                    ...item,
                    qty: newQty,
                    stockValue: newQty * item.price,
                    issuedTo: issuedTo,
                    lastIssuedDate: new Date().toISOString().split('T')[0]
                };
            }
            return item;
        }));
        const item = inventory.find(i => i.id === id);
        addLog({ action: 'Asset Issued', detail: `Issued ${qty} of ${item?.name || id} to ${issuedTo}.`, type: 'system' });
    };

    const addClient = (client) => {
        setClients(prev => [{
            ...client,
            id: client.id || Date.now(),
            source: client.source || 'Manual'
        }, ...prev]);
        addLog({ action: 'Client Onboarding', detail: `Registered ${client.name} via ${client.source || 'Admin Dashboard'}.`, type: 'system' });
    };

    const updateClient = (updated) => setClients(prev => prev.map(c => c.id === updated.id ? updated : c));

    const deleteClient = (id) => {
        setClients(prev => prev.filter(c => c.id !== id));
        addLog({ action: 'Client Decommission', detail: `Removed client reference ${id}.`, type: 'system' });
    };

    const deleteOrder = (id) => setOrders(prev => prev.filter(o => o.id !== id));
    const updateOrder = (updated) => setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));

    const addLog = (log) => {
        setLogs(prev => [{
            ...log,
            id: Date.now(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }, ...prev].slice(0, 50));
    };

    const addProject = (project) => {
        const projectId = `PRJ-${Math.floor(200 + Math.random() * 99)}`;
        setProjects(prev => [{ ...project, id: projectId }, ...prev]);

        // Automatically create a corresponding Logistics/Delivery Mission
        const deliveryId = `DEL-P-${Math.floor(1000 + Math.random() * 999)}`;
        setDeliveries(prev => [{
            id: deliveryId,
            projectId: projectId,
            item: `Project Setup: ${project.name}`,
            status: 'Pending',
            location: project.location || 'Client Hub',
            mode: project.deliveryType || 'Road',
            pod: { signature: null, image: null, actualTime: null },
            clientId: project.clientId || 1,
            assignedStaff: project.assignedLeader || 'Operational Queue'
        }, ...prev]);

        addLog({ action: 'Project Deployment', detail: `Initiated ${project.name} for ${project.client}. Distribution protocol ${project.deliveryType || 'Road'} initialized under ${deliveryId}.`, type: 'system' });
    };

    const updateProject = (updated) => {
        setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
        addLog({ action: 'Project Redesign', detail: `Updated parameters for ${updated.name}.`, type: 'system' });
    };

    const deleteProject = (id) => {
        setProjects(prev => prev.filter(p => p.id !== id));
        addLog({ action: 'Project Decommission', detail: `Archived project reference ${id}.`, type: 'system' });
    };

    const updateAssignment = (updated) => {
        setStaffAssignments(prev => prev.map(a => a.id === updated.id ? updated : a));
    };

    const addStaffAssignment = (asg) => {
        const taskId = `TSK-${Math.floor(100 + Math.random() * 899)}`;
        let generatedOrderId = null;
        let generatedDeliveryId = null;

        if (asg.isOrder) {
            generatedOrderId = `ORD-${Math.floor(1000 + Math.random() * 9999)}`;
            setOrders(prev => [{
                id: generatedOrderId,
                clientId: 1,
                client: 'In-Field Bespoke Order',
                items: [{ name: asg.task, qty: 1, price: 0 }],
                status: 'Processing',
                date: new Date().toISOString().split('T')[0]
            }, ...prev]);
        }

        // If it's a delivery or order mission, propagate to logistics/finance coordination
        if (asg.isDelivery || asg.isOrder) {
            generatedDeliveryId = `DEL-${Math.floor(1000 + Math.random() * 999)}`;
            setDeliveries(prev => [{
                id: generatedDeliveryId,
                taskRef: taskId,
                orderId: generatedOrderId,
                item: asg.task,
                status: 'Pending',
                location: asg.location,
                mode: 'Road',
                pod: { signature: null, image: null, actualTime: null },
                clientId: 1,
                assignedStaff: asg.assignee,
                driver: asg.assignee
            }, ...prev]);
        }

        setStaffAssignments(prev => [{
            ...asg,
            id: taskId,
            orderId: generatedOrderId,
            deliveryId: generatedDeliveryId,
            status: asg.status || 'Pending'
        }, ...prev]);

        addLog({ action: 'Task Assigned', detail: `Mission delegated: ${asg.task} assigned to ${asg.assignee || 'Operational Queue'}.`, type: 'system' });
    };

    const addAudit = (audit) => {
        setAudits(prev => [{ ...audit, id: `AUD-${Math.floor(700 + Math.random() * 99)}` }, ...prev]);
        addLog({ action: 'Audit Initialized', detail: `Started ${audit.title} compliance screening.`, type: 'system' });
    };

    const updateAudit = (updated) => {
        setAudits(prev => prev.map(a => a.id === updated.id ? updated : a));
        addLog({ action: 'Audit Updated', detail: `Recalibrated metrics for ${updated.id}.`, type: 'system' });
    };

    const deleteAudit = (id) => {
        setAudits(prev => prev.filter(a => a.id !== id));
        addLog({ action: 'Audit Removal', detail: `Decommissioned audit record ${id}.`, type: 'system' });
    };

    const addQuote = (quote) => {
        setQuotes(prev => [{ ...quote, id: `Q-${Math.floor(900 + Math.random() * 99)}` }, ...prev]);
        addLog({ action: 'Quote Manifest', detail: `Received procurement offer from Vendor ${quote.vendorId}.`, type: 'system' });
    };

    const updateQuote = (updated) => {
        setQuotes(prev => prev.map(q => q.id === updated.id ? updated : q));
        addLog({ action: 'Quote Revision', detail: `Updated terms for ${updated.id}.`, type: 'system' });
    };

    const deleteQuote = (id) => {
        setQuotes(prev => prev.filter(q => q.id !== id));
        addLog({ action: 'Quote Discarded', detail: `Removed quote reference ${id}.`, type: 'system' });
    };

    const addPurchaseRequest = (req) => {
        setPurchaseRequests(prev => [{ ...req, id: `REQ-${Math.floor(100 + Math.random() * 99)}`, createdAt: new Date().toISOString() }, ...prev]);
        addLog({ action: 'Request Initialized', detail: `New purchase manifest submitted by ${req.requester}.`, type: 'system' });
    };

    const updatePurchaseRequest = (updated) => {
        setPurchaseRequests(prev => prev.map(r => r.id === updated.id ? updated : r));
        addLog({ action: 'Request Updated', detail: `Modified procurement request ${updated.id}.`, type: 'system' });
    };

    const deletePurchaseRequest = (id) => {
        setPurchaseRequests(prev => prev.filter(r => r.id !== id));
        addLog({ action: 'Request Purged', detail: `Removed request ID ${id} from queue.`, type: 'system' });
    };

    const addWarehouse = (wh) => {
        setWarehouses(prev => [{ ...wh, id: prev.length + 1 }, ...prev]);
        addLog({ action: 'Facility Added', detail: `Commissioned ${wh.name} into the network.`, type: 'system' });
    };

    const updateWarehouse = (updated) => {
        setWarehouses(prev => prev.map(w => w.id === updated.id ? updated : w));
        addLog({ action: 'Facility Updated', detail: `Modified configurations for ${updated.name}.`, type: 'system' });
    };

    const deleteWarehouse = (id) => {
        setWarehouses(prev => prev.filter(w => w.id !== id));
        addLog({ action: 'Facility Decommission', detail: `Removed warehouse reference ID ${id} from ledger.`, type: 'system' });
    };

    const addGuestRequest = (req) => {
        setGuestRequests(prev => [{ ...req, id: Date.now() }, ...prev]);
        addLog({ action: 'Bespoke Request', detail: `Guest instruction: ${req.request}`, type: 'system' });
    };

    const addLuxuryItem = (item) => {
        setLuxuryItems(prev => [{ ...item, id: Date.now() }, ...prev]);
        addLog({ action: 'Luxury Item Registered', detail: `New vault entry: ${item.item}`, type: 'system' });
    };

    const dispatchVehicle = (data) => {
        // Update Routes
        setRoutes(prev => prev.map(r => r.id === Number(data.routeId) ? { ...r, driver: data.driver, status: 'Active' } : r));

        // Update Fleet Asset Status
        setFleet(prev => prev.map(v => v.id === data.id ? { ...v, status: 'In Use' } : v));

        // Phase 4: Auto-Deduct Inventory on Dispatch
        const targetDel = (deliveries || []).find(d => d.id === data.deliveryId);
        const sourceItems = data.items || (targetDel && targetDel.items); // Use provided items or delivery's items

        if (sourceItems) {
            setInventory(prev => prev.map(invItem => {
                const match = sourceItems.find(mi =>
                    mi.name.toLowerCase().includes(invItem.name.toLowerCase()) ||
                    invItem.name.toLowerCase().includes(mi.name.toLowerCase())
                );
                if (match) {
                    const newQty = Math.max(0, invItem.qty - (match.qty || 1));
                    return { ...invItem, qty: newQty, status: newQty <= 5 ? 'Critical' : newQty < 10 ? 'Warning' : 'Stable' };
                }
                return invItem;
            }));
            addLog({ action: 'Inventory Auto-Sync', detail: `Dispatched ${data.deliveryId}: Stock levels adjusted in central ledger.`, type: 'inventory' });
        }

        // Update Deliveries
        if (data.deliveryId) {
            setDeliveries(prev => prev.map(d => d.id === data.deliveryId ? {
                ...d,
                status: 'In Transit',
                driver: data.driver,
                vehicleId: data.id,
                items: sourceItems || d.items, // Sync the actual manifest
                dispatchedAt: new Date().toISOString()
            } : d));

            // Phase 5: Automatically link live tracker for this mission
            const trackerId = `TRK-${Math.floor(600 + Math.random() * 300)}`;
            setTracking(prev => [{
                id: trackerId,
                asset: data.mission || 'Bespoke Asset',
                location: 'Initializing Signal...',
                signal: 'Moderate',
                status: 'En Route',
                eta: 'Calculating...',
                deliveryId: data.deliveryId
            }, ...prev]);
        }

        addLog({ action: 'Fleet Dispatch', detail: `Vehicle ${data.id} launched for ${data.mission}. Pilot: ${data.driver}`, type: 'system' });
    };

    const addTracking = (t) => {
        setTracking(prev => [{ ...t, id: `TRK-${Math.floor(500 + Math.random() * 99)}` }, ...prev]);
        addLog({ action: 'Tracker Linked', detail: `Connected asset ${t.asset} to Geo-Spatial Network.`, type: 'system' });
    };

    const updateTracking = (updated) => {
        setTracking(prev => prev.map(t => t.id === updated.id ? updated : t));
    };

    const deleteTracking = (id) => {
        setTracking(prev => prev.filter(t => t.id !== id));
        addLog({ action: 'Signal Severed', detail: `Decommissioned tracker ${id}.`, type: 'alert' });
    };

    const addLeaveRequest = (req) => {
        setLeaveRequests(prev => [{ ...req, id: Date.now(), status: 'Pending' }, ...prev]);
        addLog({ action: 'Leave Requested', detail: `${req.name} submitted a ${req.type} request.`, type: 'system' });
    };

    const updateLeaveRequest = (updated) => {
        setLeaveRequests(prev => prev.map(r => r.id === updated.id ? updated : r));
        addLog({ action: 'Leave Update', detail: `HR status updated for ${updated.name}'s request.`, type: 'system' });
    };

    const addEvent = (event) => {
        setEvents(prev => [{
            ...event,
            id: Date.now(),
            status: event.status || 'Pending',
            createdAt: new Date().toISOString()
        }, ...prev]);
        addLog({ action: 'Event Registry', detail: `New event request: ${event.title}`, type: 'system' });
    };

    const updateEvent = (updated) => {
        setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
        addLog({ action: 'Event Update', detail: `Synchronized details for ${updated.title}.`, type: 'system' });
    };

    const deleteEvent = (id) => {
        setEvents(prev => prev.filter(e => e.id !== id));
        addLog({ action: 'Event Cancellation', detail: `Removed event reference ID ${id}.`, type: 'system' });
    };

    const [deliveryPricing, setDeliveryPricing] = useState([
        { id: 1, min: 0, max: 10, price: 50 },
        { id: 2, min: 10, max: 20, price: 100 },
        { id: 3, min: 20, max: 50, price: 200 },
    ]);

    const [saasRequests, setSaasRequests] = useState([
        { id: 'REQ-01', name: 'Global Haulers Ltd', email: 'ops@globalhaulers.com', plan: 'Enterprise', status: 'Pending', date: '2024-06-15' },
        { id: 'REQ-02', name: 'Caribbean Supply Co', email: 'ceo@caribsupply.io', plan: 'Platinum', status: 'Pending', date: '2024-06-16' },
    ]);

    const toggleAvailability = (userId) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, isAvailable: !u.isAvailable } : u));
        if (currentUser?.id === userId) {
            setCurrentUser(prev => ({ ...prev, isAvailable: !prev.isAvailable }));
        }
    };

    const submitSaaSRequest = (data) => {
        const newReq = { ...data, id: `REQ-${Date.now()}`, date: new Date().toISOString().split('T')[0], status: 'Pending' };
        setSaasRequests(prev => [newReq, ...prev]);
        addLog({ action: 'SaaS Invite Request', detail: `New request from ${data.name} for ${data.plan} plan.`, type: 'system' });
    };

    const getVacationBalance = (userId) => {
        const user = users.find(u => u.id === userId);
        if (!user || user.role === 'client') return 0;

        const join = new Date(user.joinedDate || '2024-01-01');
        const now = new Date();
        const diffYears = (now - join) / (1000 * 60 * 60 * 24 * 365);
        const diffMonths = diffYears * 12;

        if (user.isSalaried) {
            if (diffYears > 10) return 15; // 3 weeks
            if (diffYears >= 1) return 10; // 2 weeks
            if (diffMonths >= 6) return 5;  // 1 week
            return 0;
        } else {
            // Hourly
            if (diffYears >= 1) return 10; // 2 weeks
            return 0;
        }
    };

    const processSaaSRequest = (id, action) => {
        setSaasRequests(prev => prev.map(req => req.id === id ? { ...req, status: action === 'approve' ? 'Approved' : 'Rejected' } : req));
        if (action === 'approve') {
            const req = saasRequests.find(r => r.id === id);
            addClient({
                name: req.name,
                email: req.email,
                location: 'TBD',
                status: 'Active',
                clientType: 'SaaS',
                source: 'Subscriber',
                plan: req.plan
            });
        }
    };

    const addRoute = (route) => {
        setRoutes(prev => [{ ...route, id: route.id || prev.length + 1 }, ...prev]);
        addLog({ action: 'Route Created', detail: `New logistics corridor: ${route.name} mapped.`, type: 'system' });
    };

    const updateRoute = (updated) => {
        setRoutes(prev => prev.map(r => r.id === updated.id ? updated : r));
        addLog({ action: 'Route Updated', detail: `Corridor ${updated.name} parameters recalibrated.`, type: 'system' });
    };

    const deleteRoute = (id) => {
        setRoutes(prev => prev.filter(r => r.id !== id));
        addLog({ action: 'Route Decommissioned', detail: `Path ID ${id} removed from distribution network.`, type: 'alert' });
    };

    const recordWorkSession = (session) => {
        // session = { userId, userName, start, end, durationHours }
        const entry = {
            id: `SESS-${Date.now()}`,
            userId: session.userId,
            userName: session.userName,
            period: `${new Date(session.start).toLocaleDateString()} ${new Date(session.start).toLocaleTimeString()} - ${new Date(session.end).toLocaleTimeString()}`,
            date: new Date().toISOString().split('T')[0],
            hours: Number(session.durationHours).toFixed(2),
            total: `$${(session.durationHours * 25).toFixed(2)}`, // Base calculated rate $25/hr
            status: 'Logged',
            type: 'Service Record'
        };
        setPayHistory(prev => [entry, ...prev]);
        addLog({
            action: 'Shift Hours Logged',
            detail: `${session.userName} completed ${session.durationHours.toFixed(2)}h shift. Pay added to cycle.`,
            type: 'system'
        });
    };

    const generateSaaSInvoice = (client) => {
        const invId = `SaaS-${Math.floor(1000 + Math.random() * 9000)}`;
        const newInvoice = {
            id: invId,
            clientId: client.id,
            clientName: client.name,
            totalAmount: client.plan === 'Platinum' ? 4999 : client.plan === 'Executive' ? 2499 : 999,
            paidAmount: 0,
            status: 'Unpaid',
            date: new Date().toISOString().split('T')[0],
            type: 'SaaS Subscription',
            orderId: `WS-${client.id}`
        };
        setInvoices(prev => [newInvoice, ...prev]);
        addLog({ action: 'SaaS Invoice Generated', detail: `Subscription invoice ${invId} issued for ${client.name}.`, type: 'finance' });
        return newInvoice;
    };

    return (
        <GlobalDataContext.Provider value={{
            clients, setClients, addClient, updateClient, deleteClient,
            vendors, setVendors, addVendor, updateVendor, deleteVendor,
            inventory, setInventory, addInventory, updateInventory, deleteInventory,
            orders, addOrder, updateOrder, deleteOrder,
            invoices, setInvoices, settleInvoice, updateInvoice, deleteInvoice, generateSaaSInvoice,
            payments, setPayments,
            deliveries, addDelivery: (del) => setDeliveries(prev => [...prev, del]), updateDelivery, confirmDeliveryReceipt,
            logs, addLog,
            fleet, setFleet,
            projects, setProjects, addProject, updateProject, deleteProject,
            staffAssignments, updateAssignment, addStaffAssignment, payHistory, recordWorkSession,
            leaveRequests, addLeaveRequest, updateLeaveRequest,
            teams, setTeams,
            audits, addAudit, updateAudit, deleteAudit,
            quotes, addQuote, updateQuote, deleteQuote,
            purchaseRequests, setPurchaseRequests, addPurchaseRequest, updatePurchaseRequest, deletePurchaseRequest,
            warehouses, addWarehouse, updateWarehouse, deleteWarehouse,
            guestRequests, setGuestRequests, addGuestRequest,
            events, addEvent, updateEvent, deleteEvent, setEvents,
            luxuryItems, setLuxuryItems, addLuxuryItem,
            routes, setRoutes, addRoute, updateRoute, deleteRoute,
            urgentTasks, setUrgentTasks, dispatchVehicle,
            tracking, addTracking, updateTracking, deleteTracking,
            currentUser, setCurrentUser,
            users, setUsers, addUser, updateUser, deleteUser,
            revenueFilter, setRevenueFilter, getRevenueChartData, hasPermission,
            activePlan, setActivePlan,
            accessPlans, addPlan, updatePlan, deletePlan,
            stockMovements, addStockEntry, issueStock,
            deliveryPricing, setDeliveryPricing,
            saasRequests, submitSaaSRequest, processSaaSRequest,
            toggleAvailability,
            getVacationBalance,
            issueInventory,
            addInvoice: (inv) => setInvoices(prev => [{ ...inv, id: `INV-${Math.floor(5000 + Math.random() * 999)}`, createdAt: new Date().toISOString() }, ...prev]),
            subscriptionRequests,
            dispatchSubscriptionRequest,
            updateSubscriptionRequest,
            deleteSubscriptionRequest,
            cart,
            addToCart,
            removeFromCart,
            clearCart,
            generateInvoiceFromOrder,
            supportTickets,
            addSupportTicket: (ticket) => setSupportTickets(prev => [{ ...ticket, id: `TKT-${Math.floor(100 + Math.random() * 899)}`, date: new Date().toISOString().split('T')[0], messages: ticket.messages || [] }, ...prev]),
            updateSupportTicket: (updated) => setSupportTickets(prev => prev.map(t => t.id === updated.id ? updated : t)),
            getLossReports: () => {
                const inventoryLoss = stockMovements.filter(m => m.type === 'Loss').map(m => ({
                    item: m.item, qty: m.qty, value: m.value || 0, reason: m.reason || 'Damaged', date: m.date
                }));
                const fleetLoss = fleet.filter(v => v.diagnosticStatus === 'Maintenance Required').map(v => ({
                    asset: v.id, status: v.diagnosticStatus, reason: 'Maintenance Required'
                }));
                return { inventoryLoss, fleetLoss };
            },
            workStatusOptions: ['Probation', 'Full Time', 'Part Time', 'Inactive']
        }}>
            {children}
        </GlobalDataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(GlobalDataContext);
    if (!context) throw new Error('useData must be used within GlobalDataProvider');
    return context;
};
