import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../utils/formatPrice';
import { Button, EmptyState, PriceSummary, QuantitySelector } from '../common/UI';

export function Cart() {
  const { cartItems, cartCount, cartTotal, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = useCart();
  const showToast = useToast();
  if (!cartItems.length) return <EmptyState icon={ShoppingBag} title="Your bag is taking a break" message="Find something delicious for your next campus break." action={<Button as={Link} to="/">Browse the menu</Button>} />;

  return <div className="cart-layout"><section className="cart-items" aria-label="Items in your bag">{cartItems.map((item) => <article className="cart-row" key={item.id}><Link to={`/menu/${item.id}`} className="cart-row__image"><img src={item.image} alt="" /></Link><div className="cart-row__details"><span className="eyebrow">{item.category}</span><Link to={`/menu/${item.id}`} className="cart-row__name">{item.name}</Link><span className="cart-row__unit">{formatPrice(item.price)} each</span><QuantitySelector quantity={item.quantity} onIncrease={() => increaseQuantity(item.id)} onDecrease={() => decreaseQuantity(item.id)} /></div><div className="cart-row__aside"><strong>{formatPrice(item.price * item.quantity)}</strong><button className="text-icon-button" onClick={() => { removeFromCart(item.id); showToast(`${item.name} removed`); }} aria-label={`Remove ${item.name}`}><Trash2 size={16} />Remove</button></div></article>)}</section><aside className="cart-sidebar"><PriceSummary items={cartCount} total={cartTotal} /><div className="cart-sidebar__actions"><Button as={Link} to="/checkout" className="button-link">Continue to checkout<ArrowRight size={17} /></Button><Link className="text-link" to="/">Continue browsing</Link><button className="text-link text-link--muted" onClick={() => { clearCart(); showToast('Your bag has been cleared'); }}>Clear bag</button></div></aside></div>;
}
