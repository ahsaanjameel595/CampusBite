import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ClipboardCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import { CheckoutForm } from '../components/checkout/CheckoutForm';
import { PageLayout } from '../components/layout/Layout';
import { Button, PriceSummary } from '../components/common/UI';

function createOrderNumber() {
  return `CB-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export function CheckoutPage() {
  const { cartItems, cartCount, cartTotal, clearCart } = useCart();
  const [order, setOrder] = useState(null);
  if (!cartItems.length && !order) return <Navigate to="/cart" replace />;

  function placeOrder(details) {
    const orderSnapshot = { ...details, number: createOrderNumber(), items: cartItems.map((item) => ({ ...item })), total: cartTotal, count: cartCount };
    setOrder(orderSnapshot);
    clearCart();
  }

  return <PageLayout className="content-page checkout-page"><Link className="back-link" to="/cart"><ArrowLeft size={15} /> Back to your bag</Link>
    {order ? <section className="confirmation" aria-labelledby="confirmation-heading"><div className="confirmation__check"><CheckCircle2 size={32} /></div><span className="eyebrow">ORDER RECEIVED</span><h1 id="confirmation-heading">You’re all set,<br /><em>{order.studentName.split(' ')[0]}.</em></h1><p className="confirmation__lead">The kitchen’s got your order. We’ll see you at pickup.</p><div className="order-number"><span>YOUR ORDER NUMBER</span><strong>{order.number}</strong><ClipboardCheck size={19} /></div><div className="confirmation__details"><div><span>Pickup point</span><strong>{order.pickupLocation}</strong></div><div><span>Student ID</span><strong>{order.studentId}</strong></div><div><span>Pay at pickup</span><strong>{formatPrice(order.total)}</strong></div></div><div className="order-receipt"><h2>What’s cooking</h2>{order.items.map((item) => <div className="receipt-row" key={item.id}><span>{item.quantity} × {item.name}</span><strong>{formatPrice(item.quantity * item.price)}</strong></div>)}<div className="receipt-row receipt-row--total"><span>Total · {order.count} items</span><strong>{formatPrice(order.total)}</strong></div></div><p className="confirmation__simulated">This is a simulated order. No payment was collected.</p><Button as={Link} to="/">Back to the menu</Button></section> : <div className="checkout-layout"><div><div className="page-heading page-heading--compact"><span className="eyebrow">ALMOST THERE</span><h1>Make it yours</h1><p>A few details and we’ll get your order started.</p></div><CheckoutForm onSubmit={placeOrder} /></div><aside className="checkout-summary"><div className="form-heading"><span className="step-number">02</span><div><h2>Your order</h2><p>{cartCount} {cartCount === 1 ? 'item' : 'items'} for pickup</p></div></div><div className="checkout-summary__items">{cartItems.map((item) => <div className="checkout-item" key={item.id}><img src={item.image} alt="" /><span><strong>{item.name}</strong><small>Qty {item.quantity}</small></span><b>{formatPrice(item.price * item.quantity)}</b></div>)}</div><PriceSummary items={cartCount} total={cartTotal} /></aside></div>}
  </PageLayout>;
}
