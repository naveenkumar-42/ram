import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, LayoutDashboard, Store } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CartDrawer } from './CartDrawer';

export const Navbar = () => {
    const { items } = useCart();
    const [isCartOpen, setIsCartOpen] = useState(false);

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <>
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center space-x-2">
                                <Store className="h-8 w-8 text-blue-600" />
                                <span className="text-xl font-bold text-gray-900 tracking-tight">TechHaven</span>
                            </Link>
                        </div>

                        <div className="flex items-center space-x-8">
                            <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                                Shop
                            </Link>
                            <Link to="/admin" className="flex items-center text-gray-600 hover:text-blue-600 font-medium transition-colors">
                                <LayoutDashboard className="h-4 w-4 mr-1" />
                                Admin Console
                            </Link>
                            <div
                                className="relative p-2 text-gray-600 hover:text-blue-600 cursor-pointer"
                                onClick={() => setIsCartOpen(true)}
                            >
                                <ShoppingCart className="h-6 w-6" />
                                {itemCount > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                                        {itemCount}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
};
