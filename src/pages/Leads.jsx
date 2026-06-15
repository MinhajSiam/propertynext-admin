import React, { useState, useEffect } from 'react';
import { Trash2, X } from 'lucide-react';

const Leads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    // মডালের জন্য স্টেট
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState('');

    const fetchLeads = async (isBackground = false) => {
        if (!isBackground) setLoading(true);
        try {
            const response = await fetch('https://propertynextv2-backend.onrender.com/api/leads/all');
            const result = await response.json();

            if (result.success) {
                setLeads(result.data.reverse());
            }
        } catch (error) {
            console.error("Error fetching leads:", error);
        } finally {
            if (!isBackground) setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads(false);
        const intervalId = setInterval(() => {
            fetchLeads(true);
        }, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const handleStatusChange = async (id, currentStatus) => {
        try {
            const response = await fetch(`https://propertynextv2-backend.onrender.com/api/leads/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: currentStatus })
            });
            const result = await response.json();

            if (result.success) {
                setLeads(leads.map(lead => lead._id === id ? { ...lead, status: currentStatus } : lead));
            } else {
                alert('Status update failed!');
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this lead?")) {
            return;
        }

        try {
            const response = await fetch(`https://propertynextv2-backend.onrender.com/api/leads/${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();

            if (result.success) {
                setLeads(leads.filter(lead => lead._id !== id));
            } else {
                alert('Failed to delete lead!');
            }
        } catch (error) {
            console.error("Error deleting lead:", error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Contacted': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Resolved': return 'bg-green-100 text-green-700 border-green-200';
            case 'Junk': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    // মেসেজ পড়ার মডাল ওপেন করার ফাংশন
    const openMessageModal = (message) => {
        setSelectedMessage(message);
        setIsModalOpen(true);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[80vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-lime-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Customer Leads</h2>
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Live
                    </span>
                    <span className="bg-lime-100 text-lime-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                        Total: {leads.length}
                    </span>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="py-3 px-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="py-3 px-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Name & Contact</th>
                                <th className="py-3 px-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Project / Interest</th>
                                <th className="py-3 px-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Message</th>
                                <th className="py-3 px-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="py-3 px-4 font-semibold text-xs text-gray-500 uppercase tracking-wider text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {leads.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-10 text-center text-gray-500 font-medium">
                                        No leads available at the moment.
                                    </td>
                                </tr>
                            ) : (
                                leads.map((lead) => (
                                    <tr key={lead._id} className="hover:bg-gray-50 transition-colors">

                                        <td className="py-3 px-4 text-xs text-gray-500 whitespace-nowrap align-top">
                                            {new Date(lead.createdAt).toLocaleDateString('en-GB', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </td>

                                        <td className="py-3 px-4 whitespace-nowrap align-top">
                                            <div className="text-sm font-bold text-gray-800">{lead.name}</div>
                                            <a href={`tel:${lead.phone}`} className="text-xs font-medium text-gray-600 hover:text-lime-600 block mt-0.5">
                                                📞 {lead.phone}
                                            </a>
                                            {lead.email && <div className="text-[11px] text-gray-400 mt-0.5">📧 {lead.email}</div>}
                                        </td>

                                        <td className="py-3 px-4 align-top">
                                            <span className="inline-block bg-lime-50 text-lime-700 px-2.5 py-1 rounded-md text-[11px] font-bold border border-lime-200 whitespace-nowrap">
                                                {lead.interest || 'General Inquiry'}
                                            </span>
                                        </td>

                                        {/* Compact Message Column with Line Clamp */}
                                        <td className="py-3 px-4 align-top">
                                            {lead.message ? (
                                                <div className="min-w-[200px] max-w-[300px]">
                                                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                                                        {lead.message}
                                                    </p>
                                                    {lead.message.length > 80 && (
                                                        <button
                                                            onClick={() => openMessageModal(lead.message)}
                                                            className="text-[11px] font-bold text-lime-600 hover:text-lime-700 mt-1 hover:underline"
                                                        >
                                                            Read More
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">No message</span>
                                            )}
                                        </td>

                                        <td className="py-3 px-4 align-top whitespace-nowrap">
                                            <select
                                                value={lead.status || 'New'}
                                                onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                                                className={`text-xs font-bold px-2 py-1 rounded-md border outline-none cursor-pointer transition-colors ${getStatusColor(lead.status || 'New')}`}
                                            >
                                                <option value="New" className="bg-white text-gray-800">🔴 New</option>
                                                <option value="Contacted" className="bg-white text-gray-800">🔵 Contacted</option>
                                                <option value="Resolved" className="bg-white text-gray-800">🟢 Resolved</option>
                                                <option value="Junk" className="bg-white text-gray-800">⚫ Junk</option>
                                            </select>
                                        </td>

                                        <td className="py-3 px-4 align-top text-center">
                                            <button
                                                onClick={() => handleDelete(lead._id)}
                                                className="p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-md transition-all"
                                                title="Delete Lead"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Full Message Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-gray-800 text-lg">Full Message</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-red-500 transition-colors bg-white rounded-full p-1 shadow-sm border border-gray-100"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {selectedMessage}
                            </p>
                        </div>
                        <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-900 text-white hover:bg-gray-800 px-6 py-2 rounded-lg text-sm font-bold transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Leads;