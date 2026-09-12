import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../api/client';

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/user/orders')
      .then(res => setOrders(res.data.orders))
      .catch(() => alert('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-container">
          <div className="page-header">
            <h1 className="page-title">My Orders</h1>
            <p className="page-subtitle">View your order history</p>
          </div>

          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <p>You haven't placed any orders yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order.id} className="card p-6">
                  <div className="flex justify-between border-b border-[var(--border-color)] pb-4 mb-4">
                    <div>
                      <p className="text-sm text-[var(--text-muted)]">Order Placed</p>
                      <p className="font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[var(--text-muted)]">Store</p>
                      <p className="font-bold">{order.store.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[var(--text-muted)]">Total</p>
                      <p className="font-bold text-[var(--primary-color)]">₹{order.totalAmount}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                        order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Items</h4>
                    <ul className="space-y-2">
                      {order.items.map(item => (
                        <li key={item.id} className="flex justify-between text-sm">
                          <span>{item.quantity}x {item.product.name}</span>
                          <span>₹{item.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserOrdersPage;
