import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { getProducts, getHistory } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowDown, ArrowUp, DollarSign } from 'lucide-react';

export const Dashboard = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (selectedProduct) {
            fetchHistory(selectedProduct.id);
        }
    }, [selectedProduct]);

    const fetchProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
            if (data.length > 0) setSelectedProduct(data[0]);
        } catch (error) {
            console.error("Failed to fetch products", error);
        }
    };

    const fetchHistory = async (id: string) => {
        try {
            const data = await getHistory(id);
            // Reverse for chart (oldest to newest)
            setHistory([...data].reverse());
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Price Overview</h1>
                <p className="text-gray-500">Real-time pricing alerts and competitor monitoring.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Products</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">{products.length}</h3>
                        </div>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <DollarSign size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Price Updates (24h)</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">12</h3>
                        </div>
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                            <ArrowUp size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Margin Alerts</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">0</h3>
                        </div>
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                            <ArrowDown size={20} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Product List */}
                <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-800">Monitored Products</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {products.map(p => (
                            <div
                                key={p.id}
                                onClick={() => setSelectedProduct(p)}
                                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${selectedProduct?.id === p.id ? 'bg-blue-50' : ''}`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium text-gray-900">{p.name}</span>
                                    <span className="text-sm font-bold text-primary">${p.current_price}</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>SKU: {p.sku}</span>
                                    <span>Min: ${(p.base_cost * (1 + p.min_margin_percent)).toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Charts */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-800">Price History: {selectedProduct?.name}</h3>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={history}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="created_at" tickFormatter={(t) => new Date(t).toLocaleTimeString()} stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#94a3b8" fontSize={12} domain={['auto', 'auto']} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line type="monotone" dataKey="new_price" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb' }} activeDot={{ r: 6 }} />
                                <Line type="step" dataKey="old_price" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
