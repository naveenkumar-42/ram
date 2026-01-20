import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { getProducts, getHistory, updateProduct } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign } from 'lucide-react';
import { ProductTable } from '../components/ProductTable';
import type { Product } from '../types';

export const Dashboard = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        fetchProducts();
        // Poll product list every 5 seconds to catch new additions or global changes
        const prodInterval = setInterval(fetchProducts, 5000);
        return () => clearInterval(prodInterval);
    }, []);

    useEffect(() => {
        if (selectedProduct) {
            fetchHistory(selectedProduct.id);
            // Poll history every 2 seconds for live chart updates
            const histInterval = setInterval(() => fetchHistory(selectedProduct.id), 2000);
            return () => clearInterval(histInterval);
        }
    }, [selectedProduct]);

    const fetchProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
            // Select first product by default if none selected
            if (data.length > 0 && !selectedProduct) setSelectedProduct(data[0]);
        } catch (error) {
            console.error("Failed to fetch products", error);
        }
    };

    const fetchHistory = async (id: string) => {
        try {
            const data = await getHistory(id);
            setHistory([...data].reverse());
        } catch (e) {
            console.error(e);
        }
    };

    const handleUpdateProduct = async (id: string, updates: Partial<Product>) => {
        try {
            await updateProduct(id, updates);
            await fetchProducts(); // Refresh
            alert("Product updated successfully!");
        } catch (e) {
            console.error("Update failed", e);
            alert("Failed to update product.");
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
                {/* ... other stats ... */}
            </div>

            <div className="space-y-8">

                {/* Product Table (Admin Config) */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Configuration</h3>
                    <ProductTable products={products} onUpdate={handleUpdateProduct} />
                </div>

                {/* Charts Area */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="mb-6 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800">Price History: {selectedProduct?.name || 'Select a Product'}</h3>
                        <div className="flex space-x-2">
                            {products.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => setSelectedProduct(p)}
                                    className={`px-3 py-1 text-sm rounded-full ${selectedProduct?.id === p.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                                >
                                    {p.sku}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="h-80">
                        {selectedProduct ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={history}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="created_at" tickFormatter={(t) => new Date(t).toLocaleTimeString()} stroke="#94a3b8" fontSize={12} />
                                    <YAxis stroke="#94a3b8" fontSize={12} domain={['auto', 'auto']} />
                                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                    <Line type="stepAfter" dataKey="new_price" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="System Price" />
                                    <Line type="stepAfter" dataKey="old_price" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={1} dot={false} name="Old Price" />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400">Select a product to view history</div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
