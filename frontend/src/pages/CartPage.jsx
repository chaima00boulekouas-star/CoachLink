import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const MOCK_CART = [
  { id: 1, title: '12-Week Tennis Mastery Guide',     coach: 'Tashi Duncan',   price: 49, qty: 1, image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=200' },
  { id: 5, title: 'Strength & Conditioning Bundle',  coach: 'James Carter',   price: 99, qty: 1, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200' },
];

const CartPage = () => {
  const [items, setItems]         = useState(MOCK_CART);
  const [checked, setChecked]     = useState(false);
  const [processing, setProcess]  = useState(false);

  const changeQty = (id, delta) => {
    setItems((prev) =>
      prev.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
    );
  };
  const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const tax      = Math.round(subtotal * 0.08);
  const total    = subtotal + tax;

  const handleCheckout = () => {
    setProcess(true);
    setTimeout(() => {
      setProcess(false);
      setChecked(true);
    }, 1800);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/athlete/store">
            <button className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors">
              <ArrowLeft size={18} />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <ShoppingCart size={28} className="text-indigo-600" /> Your Cart
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{items.length} item{items.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {checked ? (
          /* Success State */
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={36} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Order Confirmed!</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">Your programs are now available in your account.</p>
            <p className="text-sm font-bold text-green-600 mb-8">Total charged: ${total}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/athlete/store">
                <button className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity">
                  Continue Shopping
                </button>
              </Link>
              <Link to="/athlete/dashboard">
                <button className="border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 font-bold px-6 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  Go to Dashboard
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">

            {/* Cart Items */}
            <div className="space-y-4">
              {items.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-16 text-center">
                  <ShoppingCart size={40} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                  <p className="text-slate-400 font-semibold mb-3">Your cart is empty</p>
                  <Link to="/athlete/store">
                    <button className="text-sm font-bold text-indigo-600 hover:underline">Browse programs →</button>
                  </Link>
                </div>
              ) : items.map((item) => (
                <div key={item.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 shadow-sm flex items-center gap-5">
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">{item.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">by {item.coach}</p>
                    <p className="text-lg font-black text-slate-900 dark:text-white mt-1">${item.price}</p>
                  </div>
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <button onClick={() => remove(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-xl p-1">
                      <button onClick={() => changeQty(item.id, -1)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-600 transition-colors">
                        <Minus size={13} />
                      </button>
                      <span className="text-sm font-bold w-5 text-center text-slate-900 dark:text-white">{item.qty}</span>
                      <button onClick={() => changeQty(item.id, 1)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-600 transition-colors">
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm">
                <h2 className="font-black text-slate-900 dark:text-white mb-5">Order Summary</h2>
                <div className="space-y-3 text-sm mb-5">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Subtotal</span>
                    <span className="font-semibold">${subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Tax (8%)</span>
                    <span className="font-semibold">${tax}</span>
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-700 pt-3 flex justify-between font-black text-lg text-slate-900 dark:text-white">
                    <span>Total</span>
                    <span className="text-indigo-600">${total}</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={items.length === 0 || processing}
                  className="w-full bg-orange-500 text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Processing...</>
                  ) : (
                    <><ShoppingBag size={16} /> Checkout — ${total}</>
                  )}
                </button>
                <p className="text-[10px] text-slate-400 text-center mt-3">Secure checkout · 30-day refund policy</p>
              </div>

              {/* Promo Code */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 shadow-sm">
                <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm mb-3">Promo Code</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code..."
                    className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CartPage;
