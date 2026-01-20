import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
    const { items, removeFromCart, total } = useCart();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
            <div className="fixed inset-y-0 right-0 max-w-full flex">
                <div className="w-screen max-w-md">
                    <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                        <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                            <div className="flex items-start justify-between">
                                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                    <ShoppingBag className="mr-2 h-5 w-5" /> Shopping Cart
                                </h2>
                                <div className="ml-3 h-7 flex items-center">
                                    <button onClick={onClose} className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-blue-500">
                                        <span className="sr-only">Close panel</span>
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8">
                                <div className="flow-root">
                                    <ul className="-my-6 divide-y divide-gray-200">
                                        {items.length === 0 ? (
                                            <div className="py-6 text-center text-gray-500">
                                                Your cart is empty.
                                            </div>
                                        ) : (
                                            items.map((item) => (
                                                <li key={item.id} className="py-6 flex">
                                                    <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                                                            {item.sku}
                                                        </div>
                                                    </div>

                                                    <div className="ml-4 flex-1 flex flex-col">
                                                        <div>
                                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                                <h3>{item.name}</h3>
                                                                <p className="ml-4">${(item.current_price * item.quantity).toFixed(2)}</p>
                                                            </div>
                                                            <p className="mt-1 text-sm text-gray-500">{item.sku}</p>
                                                        </div>
                                                        <div className="flex-1 flex items-end justify-between text-sm">
                                                            <p className="text-gray-500">Qty {item.quantity} @ ${item.current_price.toFixed(2)}</p>

                                                            <div className="flex">
                                                                <button type="button" onClick={() => removeFromCart(item.id)} className="font-medium text-blue-600 hover:text-blue-500 flex items-center">
                                                                    <Trash2 className="h-4 w-4 mr-1" /> Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                            <div className="flex justify-between text-base font-medium text-gray-900">
                                <p>Subtotal</p>
                                <p>${total.toFixed(2)}</p>
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                            <div className="mt-6">
                                <a href="#" className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700">
                                    Checkout
                                </a>
                            </div>
                            <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                                <p>
                                    or{' '}
                                    <button type="button" onClick={onClose} className="text-blue-600 font-medium hover:text-blue-500">
                                        Continue Shopping<span aria-hidden="true"> &rarr;</span>
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
