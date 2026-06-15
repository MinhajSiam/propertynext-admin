import React, { useState, useEffect } from 'react';

const Leads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const response = await fetch('https://propertynextv2-backend.onrender.com/api/leads/all');
            const result = await response.json();

            if (result.success) {
                // নতুন লিডগুলো যেন সবার উপরে থাকে তাই reverse করা হলো (যদি ব্যাকএন্ড থেকে সর্ট করা না থাকে)
                setLeads(result.data.reverse());
            }
        } catch (error) {
            console.error("Error fetching leads:", error);
        } finally {
            setLoading(false);
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
                                <th className="py-4 px-6 font-semibold text-sm text-gray-600">Name</th>
                                <th className="py-4 px-6 font-semibold text-sm text-gray-600">Phone</th>
                                <th className="py-4 px-6 font-semibold text-sm text-gray-600">Project / Interest</th>
                                <th className="py-4 px-6 font-semibold text-sm text-gray-600">Message</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {leads.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-10 text-center text-gray-500 font-medium">
                                        No leads available at the moment.
                                    </td>
                                </tr>
                            ) : (
                                leads.map((lead) => (
                                    <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">
                                            {new Date(lead.createdAt).toLocaleDateString('en-GB', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </td>
                                        <td className="py-4 px-6 text-sm font-bold text-gray-800 whitespace-nowrap">
                                            {lead.name}
                                            {lead.email && <div className="text-xs font-normal text-gray-400 mt-0.5">{lead.email}</div>}
                                        </td>
                                        <td className="py-4 px-6 text-sm font-medium text-gray-700 whitespace-nowrap">
                                            <a href={`tel:${lead.phone}`} className="hover:text-lime-600 transition-colors">
                                                {lead.phone}
                                            </a>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-600">
                                            <span className="inline-block bg-lime-50 text-lime-700 px-3 py-1 rounded-md text-xs font-bold border border-lime-200">
                                                {lead.interest || 'General Inquiry'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-600 max-w-xs truncate cursor-help" title={lead.message}>
                                            {lead.message || <span className="text-gray-400 italic">No message provided</span>}
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