import { useEffect, useState } from 'react';
import { getProducts } from '../services/api';
import type { Product } from '../types';
import { ShoppingCart, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Shop = () => {
    const { addToCart } = useCart();
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const load = async () => {
            const data = await getProducts();
            setProducts(data);
        };
        load();

        // Auto-poll for live prices like a real e-com site responding to market
        const interval = setInterval(load, 2000);
        return () => clearInterval(interval);
    }, []);

    // Helper to get image based on SKU category (Placeholder logic)
    const getImage = (sku: string) => {
        if (sku.includes('LPT')) return "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=400&q=80";
        if (sku.includes('PHN')) return "https://images.unsplash.com/photo-1592750436423-0ee55ac40bf0?auto=format&fit=crop&w=400&q=80";
        if (sku.includes('HEAD')) return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80";
        if (sku.includes('MON')) return "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80";
        return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80";
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Featured Products</h1>
                <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin-slow" />
                    Live Pricing Active
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
                        <div className="h-48 bg-gray-100 relative">
                            <img
                                src={getImage(product.sku)}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            {product.current_price <= (product.base_cost * (1 + product.min_margin_percent) + 1) && (
                                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                    Best Price Guarantee
                                </span>
                            )}
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                            <div className="mb-2">
                                <span className="text-xs text-gray-500 uppercase tracking-wide">{product.sku}</span>
                                <h3 className="text-lg font-bold text-gray-900 leading-tight mt-1">{product.name}</h3>
                            </div>

                            <div className="mt-auto">
                                <div className="flex items-baseline mb-4">
                                    <span className="text-2xl font-bold text-gray-900">${product.current_price.toFixed(2)}</span>
                                    {/* Simulated "Market Price" strikethrough logic could go here */}
                                </div>
                                <button
                                    onClick={() => addToCart(product)}
                                    className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition-colors active:scale-95 transform"
                                >
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
