import React, { useState, useEffect, useMemo } from 'react';
import { getAnalytics } from '../../api';
import StatCard from './StatCard';
import './AnalyticsView.css'; 

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler } from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler);

const AnalyticsView = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await getAnalytics();
                setAnalyticsData(res.data);
            } catch (error) {
                console.error("Failed to fetch analytics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const lineChartData = useMemo(() => {
        if (!analyticsData) return { labels: [], datasets: [] };
        return {
            labels: analyticsData.salesByDay.map(d => new Date(d.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })),
            datasets: [{
                label: 'Revenue (₹)',
                data: analyticsData.salesByDay.map(d => d.total),
                borderColor: '#f0ad4e',
                backgroundColor: 'rgba(240, 173, 78, 0.2)',
                fill: true,
                tension: 0.4,
            }],
        };
    }, [analyticsData]);

    const pieChartData = useMemo(() => {
        if (!analyticsData) return { labels: [], datasets: [] };
        return {
            labels: analyticsData.revenueByRole.map(r => r.role.charAt(0).toUpperCase() + r.role.slice(1)),
            datasets: [{
                data: analyticsData.revenueByRole.map(r => r.total_revenue),
                backgroundColor: ['#f0ad4e', '#5bc0de'],
                borderColor: '#ffffff',
                borderWidth: 2,
            }],
        };
    }, [analyticsData]);

    const chartOptions = { maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { color: '#333' } } }, scales: { y: { ticks: { color: '#6c757d' } }, x: { ticks: { color: '#6c757d' } } } };
    const pieChartOptions = { maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { color: '#333' } } } };

    if (loading) return <h2>Loading Analytics...</h2>;
    if (!analyticsData) return <h2>Could not load analytics data.</h2>;

    return (
        <div className="analytics-view">
            <div className="stats-grid">
                <StatCard title="Total Revenue" value={`₹${parseFloat(analyticsData.totalRevenue).toFixed(2)}`} icon="💰" />
                <StatCard title="Total Orders" value={analyticsData.totalOrders} icon="📦" />
                <StatCard title="Total Customers" value={analyticsData.totalCustomers} icon="👥" />
                <StatCard title="Orders Today" value={analyticsData.ordersToday} icon="📅" />
            </div>

            <div className="charts-grid">
                <div className="chart-container">
                    <h3>Sales (Last 7 Days)</h3>
                    <div className="chart-wrapper">
                        <Line data={lineChartData} options={chartOptions} />
                    </div>
                </div>
                <div className="chart-container">
                    <h3>Revenue by Customer Type</h3>
                    <div className="chart-wrapper">
                        <Pie data={pieChartData} options={pieChartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsView;