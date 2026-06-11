import React from 'react';
import { Building2, TrendingUp, Users } from 'lucide-react';

const Dashboard = () => {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back, Admin! 👋</h1>
                <p className="text-gray-500 mt-2 text-[15px]">Here is what's happening with your properties today.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full bg-[#051c14] text-[#cbfb00] flex items-center justify-center shrink-0">
                        <Building2 size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Total Projects</p>
                        <h3 className="text-3xl font-extrabold text-gray-900">0</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full bg-[#051c14] text-[#cbfb00] flex items-center justify-center shrink-0">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Active Projects</p>
                        <h3 className="text-3xl font-extrabold text-gray-900">0</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full bg-[#051c14] text-[#cbfb00] flex items-center justify-center shrink-0">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">New Leads</p>
                        <h3 className="text-3xl font-extrabold text-gray-900">0</h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;