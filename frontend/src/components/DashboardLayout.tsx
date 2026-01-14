import type { ReactNode } from 'react';
import { LayoutDashboard, Package, TrendingUp, Settings } from 'lucide-react';

interface SidebarItemProps {
    icon: ReactNode;
    text: string;
    active?: boolean;
}

const SidebarItem = ({ icon, text, active }: SidebarItemProps) => (
    <div className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${active ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-600'}`}>
        {icon}
        <span className="font-medium">{text}</span>
    </div>
);

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
                <div className="mb-8 flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">P</div>
                    <span className="text-xl font-bold text-gray-800">PriceIntel</span>
                </div>

                <nav className="flex-1 space-y-2">
                    <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" active />
                    <SidebarItem icon={<Package size={20} />} text="Products" />
                    <SidebarItem icon={<TrendingUp size={20} />} text="Analytics" />
                    <SidebarItem icon={<Settings size={20} />} text="Settings" />
                </nav>

                <div className="mt-auto pt-6 border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                        <div>
                            <p className="text-sm font-semibold text-gray-800">Admin User</p>
                            <p className="text-xs text-gray-500">View Profile</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-8">
                {children}
            </main>
        </div>
    );
};
