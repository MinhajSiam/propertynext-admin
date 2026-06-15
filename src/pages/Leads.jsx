import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react'; // ডিলিট আইকনের জন্য

const Leads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeads();
    }, []);

    // লিডগুলো লোড করা
    const fetchLeads = async () => {
        try {
            const response = await fetch('https://propertynextv2-backend.onrender.com/api/leads/all');
            const result = await response.json();

            if (result.success) {
                setLeads(result.data.reverse());
            }
        } catch (error) {
            console.error("Error fetching leads:", error);
        } finally {
            setLoading(false);
        }
    };

    // স্ট্যাটাস পরিবর্তন করার ফাংশন
    const handleStatusChange = async (id, currentStatus) => {
        try {
            const response = await fetch(`https://propertynextv2-backend.onrender.com/api/leads/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: currentStatus })
            });
            const result = await response.json();

            if (result.success) {
                // সফল হলে লোকাল স্টেট আপডেট করা
                setLeads(leads.map(lead => lead._id === id ? { ...lead, status: currentStatus } : lead));
            } else {
                alert('Status update failed!');
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    // লিড ডিলিট করার ফাংশন
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this lead? This action cannot be undone.")) {
            return;
        }

        try {
            const response = await fetch(`https://propertynextv2-backend.onrender.com/api/leads/${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();

            if (result.success) {
                // সফল হলে লোকাল স্টেট থেকে লিডটি সরিয়ে দেওয়া
                setLeads(leads.filter(lead => lead._id !== id));
            } else {
                alert('Failed to delete lead!');
            }
        } catch (error) {
            console.error("Error deleting lead:", error);
        }
    };

    // স্ট্যাটাস অনুযায়ী ব্যাজের কালার নির্ধারণ
    const getStatusColor = (status) => {
        switch (status) {
            case 'Contacted': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Resolved': return 'bg-green-100 text-green-700 border-green-200';
            case 'Spam': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200'; // 'New'
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[80vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Customer Leads</h2>
                <span className="bg-lime-100 text-lime-800 text-sm font-bold px-4 py-2 rounded-full shadow-sm">
                    Total Leads: {leads.length}
                </span>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="py-4 px-6 font-semibold text-sm text-gray-600">Date</th>
                                <th className="py-4 px-6 font-semibold text-sm text-gray-600">Name & Contact</th>
                                <th className="py-4 px-6 font-semibold text-sm text-gray-600">Project / Interest</th>
                                <th className="py-4 px-6 font-semibold text-sm text-gray-600">Message</th>
                                <th className="py-4 px-6 font-semibold text-sm text-gray-600">Status</th>
                                <th className="py-4 px-6 font-semibold text-sm text-gray-600 text-center">Action</th>
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

                                        {/* Date Column */}
                                        <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap align-top">
                                            {new Date(lead.createdAt).toLocaleDateString('en-GB', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </td>

                                        {/* Contact Details Column */}
                                        <td className="py-4 px-6 whitespace-nowrap align-top">
                                            <div className="text-sm font-bold text-gray-800">{lead.name}</div>
                                            <a href={`tel:${lead.phone}`} className="text-sm font-medium text-gray-600 hover:text-lime-600 block mt-1">
                                                {lead.phone}
                                            </a>
                                            {lead.email && <div className="text-xs text-gray-400 mt-0.5"> {lead.email}</div>}
                                        </td>

                                        {/* Project Interest Column */}
                                        <td className="py-4 px-6 align-top">
                                            <span className="inline-block bg-lime-50 text-lime-700 px-3 py-1 rounded-md text-xs font-bold border border-lime-200 whitespace-nowrap">
                                                {lead.interest || 'General Inquiry'}
                                            </span>
                                        </td>

                                        {/* Message Column (Fixed for wrapping) */}
                                        <td className="py-4 px-6 text-sm text-gray-600 min-w-[250px] max-w-[350px] whitespace-normal break-words align-top leading-relaxed">
                                            {lead.message || <span className="text-gray-400 italic">No message provided</span>}
                                        </td>

                                        {/* Status Dropdown Column */}
                                        <td className="py-4 px-6 align-top whitespace-nowrap">
                                            <select
                                                value={lead.status || 'New'}
                                                onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                                                className={`text-xs font-bold px-3 py-1.5 rounded-lg border outline-none cursor-pointer transition-colors ${getStatusColor(lead.status || 'New')}`}
                                            >
                                                <option value="New" className="bg-white text-gray-800">🔴 New</option>
                                                <option value="Contacted" className="bg-white text-gray-800">🔵 Contacted</option>
                                                <option value="Resolved" className="bg-white text-gray-800">🟢 Resolved</option>
                                                <option value="Spam" className="bg-white text-gray-800">⚫ Spam</option>
                                            </select>
                                        </td>

                                        {/* Action Column (Delete) */}
                                        <td className="py-4 px-6 align-top text-center">
                                            <button
                                                onClick={() => handleDelete(lead._id)}
                                                className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"
                                                title="Delete Lead"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Leads;