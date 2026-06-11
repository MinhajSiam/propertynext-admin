import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="flex bg-[#f8f9fa] min-h-screen font-sans text-gray-900">
            <Sidebar />
            {/* Main Content Area (64 spacing added to offset the 64-width fixed sidebar) */}
            <div className="flex-1 ml-64 p-8 md:p-10">
                {children}
            </div>
        </div>
    );
};

export default Layout;