import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PriceHistoryChartProps {
    data: any[];
}

export const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({ data }) => {
    // Format data for chart
    const chartData = data.map(item => ({
        time: new Date(item.created_at).toLocaleTimeString(),
        price: item.new_price,
        source: item.trigger_source
    })).reverse(); // Show oldest to newest left to right

    return (
        <div className="h-64 w-full bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Price History Trend</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={['auto', 'auto']} />
                    <Tooltip />
                    <Line type="stepAfter" dataKey="price" stroke="#4F46E5" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
