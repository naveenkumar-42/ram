import React, { useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';
import type { Product } from '../types';

interface ProductTableProps {
    products: Product[];
    onUpdate: (id: string, updates: Partial<Product>) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({ products, onUpdate }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Product>>({});

    const startEdit = (product: Product) => {
        setEditingId(product.id);
        setEditForm({
            base_cost: product.base_cost,
            min_margin_percent: product.min_margin_percent,
            is_active: product.is_active
        });
    };

    const saveEdit = () => {
        if (editingId) {
            onUpdate(editingId, editForm);
            setEditingId(null);
        }
    };

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost ($)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Margin (%)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Floor Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => {
                        const isEditing = editingId === product.id;
                        const floorPrice = product.base_cost * (1 + product.min_margin_percent);

                        return (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                            <div className="text-sm text-gray-500">{product.sku}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            className="border rounded px-2 py-1 w-20"
                                            value={editForm.base_cost}
                                            onChange={(e) => setEditForm({ ...editForm, base_cost: parseFloat(e.target.value) })}
                                        />
                                    ) : (
                                        `$${product.base_cost.toFixed(2)}`
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="border rounded px-2 py-1 w-20"
                                            value={editForm.min_margin_percent}
                                            onChange={(e) => setEditForm({ ...editForm, min_margin_percent: parseFloat(e.target.value) })}
                                        />
                                    ) : (
                                        `${(product.min_margin_percent * 100).toFixed(0)}%`
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-600 font-bold">
                                    ${floorPrice.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">
                                    ${product.current_price.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {product.is_active ? 'Active' : 'Paused'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {isEditing ? (
                                        <div className="flex justify-end space-x-2">
                                            <button onClick={saveEdit} className="text-green-600 hover:text-green-900"><Save size={18} /></button>
                                            <button onClick={() => setEditingId(null)} className="text-red-600 hover:text-red-900"><X size={18} /></button>
                                        </div>
                                    ) : (
                                        <button onClick={() => startEdit(product)} className="text-indigo-600 hover:text-indigo-900">
                                            <Edit2 size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
