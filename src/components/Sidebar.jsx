import React from 'react';
import { Link, useLocation } from 'react-router-dom';
// ব্লগের জন্য FileText আইকনটি এখানে যুক্ত করা হয়েছে
import { LayoutDashboard, Building2, Users, Settings, FileText } from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();

    // এই লিস্টের ভেতরে 'Manage Blogs' যুক্ত করা হয়েছে
    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { name: 'Manage Projects', icon: Building2, path: '/projects' },
        { name: 'Manage Blogs', icon: FileText, path: '/blogs' },
        { name: 'Leads & Contacts', icon: Users, path: '/leads' },
        { name: 'Settings', icon: Settings, path: '/settings' },
    ];

    return (
        <div className="w-64 bg-darkGreen text-white h-screen fixed left-0 top-0 flex flex-col shadow-2xl z-50">
            {/* Logo Area */}
            <div className="p-8 pb-6 border-b border-white/10">
                <h2 className="text-2xl font-extrabold text-brandLime tracking-tight">PropertyNext</h2>
                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-widest mt-1">Admin Portal</p>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 mt-6 px-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path || location.pathname.startsWith(item.path) && item.path !== '/';

                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${isActive
                                ? 'bg-brandLime text-darkGreen font-bold shadow-lg shadow-brandLime/20'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white font-medium'
                                }`}
                        >
                            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[15px]">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Area */}
            <div className="p-6 border-t border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brandLime text-darkGreen flex items-center justify-center font-bold text-lg">
                        A
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white">Admin User</h4>
                        <p className="text-xs text-gray-400">admin@propertynext.bd</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;