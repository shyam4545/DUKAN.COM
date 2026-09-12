import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../api/client';
import { useNavigate } from 'react-router-dom';

const UserCartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const navigate = useNavigate();

  const loadCart = () => {
    setLoading(true);
    api.get('/user/cart')
      .then(res => setCart(res.data.cart))
      .catch(() => alert('Failed to load cart'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQuantity = async (id, currentQty, delta) => {
    const newQty = currentQty + delta;
    try {
      await api.put(`/user/cart/${id}`, { quantity: newQty });
      loadCart();
    } catch (err) {
      alert('Failed to update quantity');
    }
  };

  const handleCheckout = async () => {
    setPlacingOrder(true);
    try {
      await api.post('/user/orders');
      alert('Order placed successfully!');
      navigate('/user/orders');
    } catch (err) {
      alert('Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-container">
          <div className="page-header">
            <h1 className="page-title">Shopping Cart</h1>
            <p className="page-subtitle">Review your items before checkout</p>
          </div>

          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : cart.length === 0 ? (
            <div className="empty-state">
              <div className="text-4xl mb-4">🛒</div>
              <p>Your cart is empty. Start adding products from stores!</p>
            </div>
          ) : (
            <div className="flex gap-8 flex-col md:flex-row">
              <div className="flex-1 space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="card p-4 flex items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold">{item.product.name}</h3>
                      <p className="text-sm text-[var(--text-muted)]">Store: {item.product.store.name}</p>
                      <p className="font-bold text-[var(--primary-color)] mt-1">₹{item.product.price}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-[var(--background-dark)] rounded-md p-1 border border-[var(--border-color)]">
                      <button className="px-2 font-bold hover:text-[var(--primary-color)]" onClick={() => updateQuantity(item.id, item.quantity, -1)}>-</button>
                      <span className="w-4 text-center">{item.quantity}</span>
                      <button className="px-2 font-bold hover:text-[var(--primary-color)]" onClick={() => updateQuantity(item.id, item.quantity, 1)}>+</button>
                    </div>
                    <div className="w-20 text-right font-bold">
                      ₹{(Number(item.product.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-full md:w-80 h-fit card p-6 sticky top-24">
                <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                <div className="flex justify-between mb-2">
                  <span className="text-[var(--text-muted)]">Items ({cart.length})</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-[var(--text-muted)]">Delivery</span>
                  <span className="text-green-500">Free</span>
                </div>
                <div className="border-t border-[var(--border-color)] pt-4 flex justify-between font-bold text-lg mb-6">
                  <span>Total</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
                <button 
                  className="btn btn-primary btn-full btn-lg" 
                  onClick={handleCheckout}
                  disabled={placingOrder}
                >
                  {placingOrder ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserCartPage;
