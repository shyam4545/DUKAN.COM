import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import DataTable from '../../components/DataTable';
import api from '../../api/client';

const OwnerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = () => {
    setLoading(true);
    api.get('/owner/orders')
      .then(res => setOrders(res.data.orders))
      .catch(() => setError('Failed to load orders'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/owner/orders/${id}/status`, { status: newStatus });
      loadOrders();
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  const columns = [
    { key: 'id', header: 'Order ID', render: (row) => `#${row.id}` },
    { key: 'customer', header: 'Customer', render: (row) => row.user.name },
    { key: 'total', header: 'Total Amount', render: (row) => `₹${row.totalAmount}` },
    { 
      key: 'status', 
      header: 'Status', 
      render: (row) => (
        <select 
          value={row.status} 
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          className={`form-control p-1 rounded ${row.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : row.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}
        >
          <option value="PENDING">PENDING</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      ) 
    },
    { key: 'date', header: 'Date', render: (row) => new Date(row.createdAt).toLocaleDateString() },
  ];

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-container">
          <div className="page-header">
            <h1 className="page-title">Manage Orders</h1>
            <p className="page-subtitle">View and update customer orders</p>
          </div>

          {error && <div className="alert alert-error">⚠️ {error}</div>}

          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : (
            <div className="card">
              <DataTable data={orders} columns={columns} globalFilterPlaceholder="Search orders..." />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OwnerOrdersPage;
