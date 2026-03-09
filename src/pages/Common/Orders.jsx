import React, { useState } from 'react';
import Table from '../../components/Table';
import { useData } from '../../context/GlobalDataContext';
import { Search, Plus, PackageCheck, PackageX, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import OrderModal from '../../components/OrderModal';
import InvoiceGenerationModal from '../../components/InvoiceGenerationModal';

const Orders = () => {
  const {
    orders, addOrder, updateOrder, deleteOrder,
    deliveries, purchaseRequests, stockMovements,
    addProject, invoices, projects, generateInvoiceFromOrder
  } = useData();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('view');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null);

  const handleConvertToProject = (order) => {
    const projectData = {
      name: `Project: ${order.items?.[0]?.name || 'Mission'}`,
      client: order.client || 'Unknown Client',
      items: order.items || [],
      orderRef: order.id,
      start: order.date || new Date().toISOString().split('T')[0],
      location: order.location || 'Headquarters',
      status: 'Pending',
      deliveryType: order.deliveryType || 'Road'
    };
    addProject(projectData);
    alert(`System converted Order ${order.id} into a Project. Redirecting...`);
    navigate('/dashboard/projects');
  };

  const filteredOrders = orders.filter(order =>
    String(order.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.items && order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const handleAction = (type, order) => {
    setSelectedOrder(order);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleSave = (formData) => {
    if (modalType === 'add') {
      addOrder(formData);
    } else if (modalType === 'edit') {
      updateOrder({ ...selectedOrder, ...formData });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    deleteOrder(id);
    setIsModalOpen(false);
  };

  const columns = [
    { header: "Order ID", accessor: "id" },
    { header: "Client", accessor: "client" },
    {
      header: "Order Type",
      accessor: "type",
      render: (row) => (
        <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-accent">
          {row.type || "Custom Order"}
        </span>
      )
    },
    {
      header: "Items",
      accessor: "items",
      render: (item) => {
        if (!item.items || item.items.length === 0) return item.product || "No Items";
        if (item.items.length === 1) return item.items[0].name;
        return `${item.items[0].name} (+${item.items.length - 1} more)`;
      }
    },
    { header: "Vendor", accessor: "vendor", render: (item) => item.vendor || "N/A" },
    {
      header: "Total Value",
      accessor: "total",
      render: (item) => {
        const total = item.total || (item.items ? item.items.reduce((acc, i) => acc + (i.price * i.qty), 0) : 0);
        return `$${parseFloat(total).toLocaleString()}`;
      }
    },
    { header: "Status", accessor: "status" },
    {
      header: "Inv. Route",
      accessor: "id",
      render: (row) => {
        // Check if a PR was auto-created for this order (means inventory was missing)
        const prCreated = purchaseRequests?.some(pr => pr.orderRef === row.id);
        const stockIssued = stockMovements?.some(sm => sm.orderRef === row.id && sm.type === 'Issue');
        if (stockIssued) return (
          <span className="flex items-center gap-1 text-[10px] font-black text-success uppercase">
            <PackageCheck size={12} /> In Stock
          </span>
        );
        if (prCreated) return (
          <span className="flex items-center gap-1 text-[10px] font-black text-warning uppercase">
            <PackageX size={12} /> PR Sent
          </span>
        );
        return <span className="text-muted text-[10px]">—</span>;
      }
    },
    {
      header: "Delivery",
      accessor: "id",
      render: (row) => {
        const delivery = deliveries?.find(d => d.orderId === row.id);
        return (
          <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${delivery?.status === 'Completed' ? 'bg-success/20 text-success' :
            delivery?.status === 'In Transit' ? 'bg-info/20 text-info' :
              delivery?.status === 'Pending' || delivery?.status === 'Pending Pickup' ? 'bg-warning/20 text-warning' : 'bg-muted/20 text-muted'
            }`}>
            {delivery ? (delivery.status === 'Pending Pickup' ? 'Awaiting Pickup' : delivery.status) : 'N/A'}
          </span>
        );
      }
    },
    { header: "Date", accessor: "date", render: (item) => item.date || item.orderDate || "2024-05-28" },
    {
      header: "Action",
      accessor: "id",
      render: (row) => {
        const hasInvoice = invoices?.some(inv => inv.orderId === row.id);
        const hasProject = projects?.some(p => p.orderRef === row.id);

        return (
          <div className="flex gap-2">
            {!hasProject && (
              <button
                onClick={(e) => { e.stopPropagation(); handleConvertToProject(row); }}
                className="px-2 py-1 bg-accent/20 text-accent hover:bg-accent hover:text-white rounded text-[9px] font-bold uppercase transition-colors"
              >
                To Project
              </button>
            )}
            {!hasInvoice && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedOrderForInvoice(row);
                  setIsInvoiceModalOpen(true);
                }}
                className="px-2 py-1 bg-info/20 text-info hover:bg-info hover:text-white rounded text-[9px] font-bold uppercase transition-colors"
              >
                Invoice
              </button>
            )}
            {(hasProject || hasInvoice) && (
              <span className="text-[8px] text-muted font-black uppercase italic">Committed</span>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
          <p className="text-secondary mt-1">Track and manage multi-line supply chain requests and deliveries.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2" onClick={() => navigate('/dashboard/invoices')}>
            <FileText size={16} /> Ledger / Invoices
          </button>
          <button className="btn-primary flex items-center gap-2" onClick={() => handleAction('add', {})}>
            <Plus size={16} /> Create Order
          </button>
          {/* <button
            className="px-6 py-2.5 bg-info border border-info/50 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-info/80 shadow-lg shadow-info/20 flex items-center gap-2"
            onClick={() => {
              setSelectedOrderForInvoice(null);
              setIsInvoiceModalOpen(true);
            }}
          >
            <FileText size={16} /> Create Invoice
          </button> */}
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              type="text"
              placeholder="Search by ID, Client or Items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredOrders}
          actions={true}
          onView={(item) => handleAction('view', item)}
          onEdit={(item) => handleAction('edit', item)}
          onDelete={(item) => handleDelete(item.id)}
        />
      </div>

      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modalType={modalType}
        selectedOrder={selectedOrder}
        onSave={handleSave}
        onDelete={handleDelete}
      />
      <InvoiceGenerationModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        order={selectedOrderForInvoice}
        onGenerate={(orderWithDetails) => {
          generateInvoiceFromOrder(orderWithDetails);
          navigate('/dashboard/invoices');
        }}
      />
    </div>
  );
};

export default Orders;

