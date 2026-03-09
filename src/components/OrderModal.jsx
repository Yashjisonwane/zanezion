import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Clock, MapPin, Plus, Trash2, Tag, DollarSign, Package } from 'lucide-react';
import { CLIENTS } from '../utils/data';
import CustomDatePicker from './CustomDatePicker';
import { useData } from '../context/GlobalDataContext';

const OrderModal = ({ isOpen, onClose, modalType, selectedOrder, onSave, onDelete, initialData, role }) => {
    const { currentUser } = useData();
    const [formData, setFormData] = useState({
        client: '',
        items: [{ name: '', qty: 1, price: '' }],
        location: 'Port Hercule',
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        department: '',
        vendor: '',
        isPreferredVendor: false,
        type: 'Custom Order',
        deliveryType: 'Road',
        pickupLocation: '',
        pickupTime: '',
        serviceType: 'One Way',
        returnDate: '',
        returnTime: '',
        returnLocation: '',
        dailyDays: 1,
        luggage: '',
        stops: '',
        amenities: ''
    });

    useEffect(() => {
        if (modalType === 'add') {
            setFormData({
                items: initialData?.items || [{ name: initialData?.product || '', qty: 1, price: initialData?.price || '' }],
                location: initialData?.location || 'Port Hercule',
                status: 'Pending',
                date: initialData?.date || new Date().toISOString().split('T')[0],
                client: role === 'client' ? currentUser.name : (initialData?.client && initialData.client !== 'Select Client...' ? initialData.client : (CLIENTS[0]?.name || '')),
                department: initialData?.department || '',
                vendor: initialData?.vendor || '',
                isPreferredVendor: false,
                type: initialData?.type || 'Custom Order',
                deliveryType: initialData?.mode || 'Road'
            });
        } else if (selectedOrder) {
            setFormData({
                client: selectedOrder.client || '',
                items: selectedOrder.items || [{ name: selectedOrder.product || '', qty: parseInt(selectedOrder.qty) || 1, price: selectedOrder.price ?? '' }],
                location: selectedOrder.location || 'Port Hercule',
                status: selectedOrder.status || 'Pending',
                date: selectedOrder.date || (selectedOrder.deliveryTime ? selectedOrder.deliveryTime : new Date().toISOString().split('T')[0]),
                department: selectedOrder.department || '',
                vendor: selectedOrder.vendor || '',
                isPreferredVendor: !!selectedOrder.vendorId,
                type: selectedOrder.type || 'Custom Order',
                deliveryType: selectedOrder.deliveryType || selectedOrder.mode || 'Road',
                pickupLocation: selectedOrder.pickupLocation || '',
                pickupTime: selectedOrder.pickupTime || '',
                serviceType: selectedOrder.serviceType || 'One Way',
                returnDate: selectedOrder.returnDate || '',
                returnTime: selectedOrder.returnTime || '',
                returnLocation: selectedOrder.returnLocation || '',
                dailyDays: selectedOrder.dailyDays || 1,
                luggage: selectedOrder.luggage || '',
                stops: selectedOrder.stops || '',
                amenities: selectedOrder.amenities || ''
            });
        }
    }, [modalType, selectedOrder, isOpen, initialData, role, currentUser.name]);

    const handleAddItem = () => {
        setFormData({ ...formData, items: [...formData.items, { name: '', qty: 1, price: '' }] });
    };

    const handleRemoveItem = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems.length ? newItems : [{ name: '', qty: 1, price: '' }] });
    };

    const handleItemChange = (index, field, value) => {
        setFormData(prev => {
            const newItems = [...prev.items];
            newItems[index] = { ...newItems[index], [field]: value };
            return { ...prev, items: newItems };
        });
    };

    const calculateTotal = () => {
        return formData.items.reduce((acc, item) => acc + (parseFloat(item.price || 0) * (parseInt(item.qty) || 0)), 0).toFixed(2);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...formData, total: parseFloat(calculateTotal()) });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                modalType === 'view' ? 'Order Details' :
                    modalType === 'edit' ? 'Edit Order' :
                        modalType === 'delete' ? 'Cancel Order' : 'Create New Order'
            }
        >
            <form className="space-y-6" onSubmit={handleSubmit}>
                {modalType === 'delete' ? (
                    <div className="space-y-4">
                        <p className="text-secondary">Are you sure you want to cancel order <span className="text-primary font-bold">{selectedOrder?.id}</span>?</p>
                        <div className="flex gap-3 justify-end pt-4">
                            <button type="button" onClick={onClose} className="btn-secondary">Keep Order</button>
                            <button type="button" onClick={() => onDelete(selectedOrder.id)} className="px-6 py-2 bg-danger text-white rounded-lg font-bold">Cancel Order</button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(modalType === 'view' || modalType === 'edit') && (
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-muted uppercase">Order ID</label>
                                    <input type="text" value={selectedOrder?.id || ''} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none" disabled />
                                </div>
                            )}
                            {role !== 'client' && (
                                <div className={`space-y-1 ${modalType === 'add' ? 'col-span-1 md:col-span-2' : ''}`}>
                                    <label className="text-[10px] font-bold text-muted uppercase">Client</label>
                                    <select
                                        value={modalType === 'view' ? selectedOrder?.client : formData.client}
                                        onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none font-bold"
                                        disabled={modalType === 'view'}
                                        required
                                    >
                                        <option value="" disabled>Select Client...</option>
                                        {CLIENTS.map(client => (
                                            <option key={client.id} value={client.name}>{client.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="col-span-1 md:col-span-2 space-y-3">
                                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                                    <div className="flex flex-col">
                                        <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Institutional Requisition Items</label>
                                        <p className="text-[9px] text-secondary italic uppercase tracking-tighter mt-0.5">Define multi-line asset specifications below</p>
                                    </div>
                                    {modalType !== 'view' && (
                                        <button
                                            type="button"
                                            onClick={handleAddItem}
                                            className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-xl text-[10px] font-black text-accent hover:bg-accent hover:text-black transition-all shadow-lg shadow-accent/5 group"
                                        >
                                            <Plus size={14} className="group-hover:rotate-90 transition-transform duration-300" /> ADD ITEM PROTOCOL
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    {formData.items.map((item, index) => (
                                        <div key={index} className="p-4 bg-white/[0.02] border border-border/50 rounded-2xl space-y-4 sm:space-y-0 sm:flex sm:gap-3 sm:items-end">
                                            <div className="flex-1 space-y-1">
                                                <label className="text-[9px] font-bold text-muted uppercase ml-1">Item Name</label>
                                                <div className="relative">
                                                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={12} />
                                                    <input
                                                        type="text"
                                                        value={item.name}
                                                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                                                        placeholder="e.g. Vintage Champagne"
                                                        className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-xs focus:border-accent outline-none font-bold"
                                                        disabled={modalType === 'view'}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="flex-1 sm:w-20 space-y-1">
                                                    <label className="text-[9px] font-bold text-muted uppercase ml-1">Qty</label>
                                                    <input
                                                        type="number"
                                                        value={item.qty}
                                                        onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                                                        className="w-full bg-background border border-border rounded-lg px-2 py-2 text-xs focus:border-accent outline-none text-center font-bold"
                                                        disabled={modalType === 'view'}
                                                        min="1"
                                                        required
                                                    />
                                                </div>
                                                <div className="flex-[2] sm:w-28 space-y-1">
                                                    <label className="text-[9px] font-bold text-muted uppercase ml-1">Unit Price</label>
                                                    <div className="relative">
                                                        <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 text-muted" size={12} />
                                                        <input
                                                            type="number"
                                                            value={item.price}
                                                            onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                                                            placeholder="0.00"
                                                            className="w-full bg-background border border-border rounded-lg pl-6 pr-2 py-2 text-xs focus:border-accent outline-none font-bold"
                                                            disabled={modalType === 'view'}
                                                            step="0.01"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-end gap-3">
                                                <div className="flex-1 sm:w-28 space-y-1">
                                                    <label className="text-[9px] font-bold text-muted uppercase ml-1">Line Total</label>
                                                    <div className="w-full bg-white/[0.04] border border-border rounded-lg px-3 py-2 text-xs text-accent font-black">
                                                        ${(parseFloat(item.price || 0) * (parseInt(item.qty) || 0)).toFixed(2)}
                                                    </div>
                                                </div>
                                                {modalType !== 'view' && formData.items.length > 1 && (
                                                    <button type="button" onClick={() => handleRemoveItem(index)} className="p-2 mb-0.5 text-danger hover:bg-danger/10 rounded-lg transition-colors flex-shrink-0">
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {modalType !== 'view' && (
                                    <p className="text-[9px] text-muted italic">* Prices can be left empty if currently unknown (e.g. pending store visit).</p>
                                )}

                                <div className="flex justify-end pt-2 border-t border-white/5 mt-4">
                                    <div className="text-right p-4 bg-accent/[0.03] border border-accent/10 rounded-2xl min-w-[200px]">
                                        <p className="text-[10px] font-black text-muted uppercase tracking-widest">Grand Total (Estimated)</p>
                                        <p className="text-2xl font-black text-accent">${calculateTotal()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted uppercase">Destination</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
                                    <input
                                        type="text"
                                        value={modalType === 'view' ? (selectedOrder?.location || 'Port Hercule') : formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:border-accent outline-none"
                                        disabled={modalType === 'view'}
                                        placeholder="Enter destination"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted uppercase">Status</label>
                                <select
                                    value={modalType === 'view' ? selectedOrder?.status : formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none"
                                    disabled={modalType === 'view'}
                                >
                                    <option>Pending</option>
                                    <option>Shipped</option>
                                    <option>Delivered</option>
                                    <option>Processing</option>
                                </select>
                            </div>
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-bold text-muted uppercase">Vendor (Optional)</label>
                                    {modalType !== 'view' && (
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={formData.isPreferredVendor}
                                                onChange={(e) => setFormData({ ...formData, isPreferredVendor: e.target.checked, vendor: e.target.checked ? '' : formData.vendor })}
                                                className="w-3 h-3 rounded border-border bg-background text-accent focus:ring-accent"
                                            />
                                            <span className="text-[10px] font-bold text-muted group-hover:text-accent transition-colors uppercase">Preferred Only</span>
                                        </label>
                                    )}
                                </div>

                                {formData.isPreferredVendor && modalType !== 'view' ? (
                                    <select
                                        value={formData.vendor}
                                        onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                                        className="w-full bg-background border border-accent/30 rounded-lg px-4 py-2 text-sm focus:border-accent outline-none font-bold"
                                        required
                                    >
                                        <option value="">Select Verified Partner...</option>
                                        <option value="Monaco Liquors">Monaco Liquors (R: 98%)</option>
                                        <option value="Island Fresh">Island Fresh (R: 92%)</option>
                                        <option value="Marine Tech">Marine Tech (R: 85%)</option>
                                        <option value="Global Logistics">Global Logistics (Contracted)</option>
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        value={modalType === 'view' ? selectedOrder?.vendor : formData.vendor}
                                        onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                                        placeholder="Enter vendor manually (Optional)"
                                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none font-bold"
                                        disabled={modalType === 'view'}
                                    />
                                )}
                                {formData.isPreferredVendor && (
                                    <p className="text-[9px] text-accent font-bold uppercase tracking-tighter">* Selection is mandatory for Preferred-class orders.</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <CustomDatePicker
                                    label="Execution / Event Date"
                                    selectedDate={modalType === 'view' ? (selectedOrder?.date || '2024-05-28') : formData.date}
                                    onChange={(date) => setFormData({ ...formData, date })}
                                />
                                {modalType === 'view' && selectedOrder?.createdAt && (
                                    <p className="text-[9px] text-muted italic mt-1">Requested On: {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Logistics Transport Mode</label>
                                <div className="flex gap-2">
                                    {['Road', 'Sea', 'Air'].map((mode) => (
                                        <button
                                            key={mode}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, deliveryType: mode })}
                                            className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter border transition-all ${formData.deliveryType === mode
                                                ? 'bg-accent/20 border-accent text-accent shadow-lg shadow-accent/5'
                                                : 'bg-white/5 border-white/10 text-muted hover:border-white/30'
                                                }`}
                                            disabled={modalType === 'view'}
                                        >
                                            {mode}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted uppercase">Order Type</label>
                                <select
                                    value={modalType === 'view' ? (selectedOrder?.type || 'Custom Order') : formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none font-bold"
                                    disabled={modalType === 'view'}
                                >
                                    <option>Procurement</option>
                                    <option>Provisioning</option>
                                    <option>Delivery</option>
                                    <option>Inventory</option>
                                    <option>Custom Order</option>
                                    <option>Chauffeur Service</option>
                                </select>
                            </div>

                            {formData.type === 'Chauffeur Service' && (
                                <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 border border-accent/20 rounded-2xl bg-accent/5">
                                    <h4 className="col-span-1 md:col-span-2 text-xs font-black text-accent uppercase tracking-widest mb-2 border-b border-accent/10 pb-2">Chauffeur Mission Details</h4>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-muted uppercase">Service Type</label>
                                        <select
                                            value={formData.serviceType}
                                            onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                                            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none"
                                            disabled={modalType === 'view'}
                                        >
                                            <option>One Way</option>
                                            <option>Return</option>
                                            <option>Daily</option>
                                        </select>
                                    </div>

                                    {formData.serviceType === 'Daily' && (
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-muted uppercase">Number of Days</label>
                                            <input type="number" min="1" value={formData.dailyDays} onChange={e => setFormData({ ...formData, dailyDays: e.target.value })} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none" disabled={modalType === 'view'} />
                                        </div>
                                    )}

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-muted uppercase">Pick-up Location</label>
                                        <input type="text" value={formData.pickupLocation} onChange={e => setFormData({ ...formData, pickupLocation: e.target.value })} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none" disabled={modalType === 'view'} placeholder="e.g. LPIA Airport" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-muted uppercase">Pick-up Time</label>
                                        <input type="time" value={formData.pickupTime} onChange={e => setFormData({ ...formData, pickupTime: e.target.value })} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none" disabled={modalType === 'view'} />
                                    </div>

                                    {formData.serviceType === 'Return' && (
                                        <>
                                            <div className="space-y-1">
                                                <CustomDatePicker label="Return Date" selectedDate={formData.returnDate} onChange={date => setFormData({ ...formData, returnDate: date })} disabled={modalType === 'view'} />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-muted uppercase">Return Time</label>
                                                <input type="time" value={formData.returnTime} onChange={e => setFormData({ ...formData, returnTime: e.target.value })} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none" disabled={modalType === 'view'} />
                                            </div>
                                            <div className="col-span-1 md:col-span-2 space-y-1">
                                                <label className="text-[10px] font-bold text-muted uppercase">Return Location</label>
                                                <input type="text" value={formData.returnLocation} onChange={e => setFormData({ ...formData, returnLocation: e.target.value })} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none" disabled={modalType === 'view'} />
                                            </div>
                                        </>
                                    )}

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-muted uppercase">Luggage Specification</label>
                                        <input type="text" value={formData.luggage} onChange={e => setFormData({ ...formData, luggage: e.target.value })} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none" disabled={modalType === 'view'} placeholder="e.g. 2 large suitcases, 1 carry-on" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-muted uppercase">Required Stops</label>
                                        <input type="text" value={formData.stops} onChange={e => setFormData({ ...formData, stops: e.target.value })} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none" disabled={modalType === 'view'} placeholder="e.g. Stop at pharmacy" />
                                    </div>
                                    <div className="col-span-1 md:col-span-2 space-y-1">
                                        <label className="text-[10px] font-bold text-muted uppercase">Special Amenities</label>
                                        <input type="text" value={formData.amenities} onChange={e => setFormData({ ...formData, amenities: e.target.value })} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-accent outline-none" disabled={modalType === 'view'} placeholder="e.g. Baby Car Seat, Wheelchair, Stroller, Champagne" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {modalType === 'view' && selectedOrder?.createdAt && (
                            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-border space-y-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <Clock size={16} className="text-accent" />
                                    <span className="text-secondary">Created At:</span>
                                    <span className="font-bold">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 justify-end pt-6">
                            <button type="button" onClick={onClose} className="btn-secondary">{modalType === 'view' ? 'Close' : 'Cancel'}</button>
                            {modalType !== 'view' && <button type="submit" className="btn-primary">Save Order</button>}
                        </div>
                    </div>
                )}
            </form>
        </Modal>
    );
};

export default OrderModal;
