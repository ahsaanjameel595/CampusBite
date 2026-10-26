import { createElement, useEffect } from 'react';
import { Heart, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';

export function Button({ children, variant = 'primary', className = '', as: Component = 'button', ...props }) {
  return createElement(Component, { className: `button button--${variant} ${className}`.trim(), ...props }, children);
}

export function ErrorMessage({ message, onRetry }) {
  return <div className="status-panel status-panel--error" role="alert"><span className="status-panel__mark">!</span><div><h2>That didn’t load</h2><p>{message}</p>{onRetry && <Button variant="outline" onClick={onRetry}>Try again</Button>}</div></div>;
}

export function EmptyState({ icon: Icon, title, message, action }) {
  return <div className="empty-state">{Icon && <span className="empty-state__icon"><Icon size={25} /></span>}<h2>{title}</h2><p>{message}</p>{action}</div>;
}

export function LoadingSkeleton({ count = 6 }) {
  return <div className="menu-grid" aria-label="Loading menu" aria-busy="true">{Array.from({ length: count }, (_, index) => <div className="skeleton-card" key={index}><div className="skeleton-card__image shimmer" /><div className="skeleton-card__line shimmer" /><div className="skeleton-card__line skeleton-card__line--short shimmer" /></div>)}</div>;
}

export function SearchBar({ value, onChange }) {
  return <label className="search-field"><Search size={19} aria-hidden="true" /><span className="sr-only">Search food</span><input aria-label="Search food" value={value} onChange={(event) => onChange(event.target.value)} placeholder="Try “biryani” or “coffee”" type="search" /></label>;
}

export function CategoryFilter({ categories, value, onChange }) {
  return <div className="category-filter" role="group" aria-label="Filter by category">{categories.map((category) => <button type="button" key={category} className={`category-chip${value === category ? ' is-active' : ''}`} aria-pressed={value === category} onClick={() => onChange(category)}>{category}</button>)}</div>;
}

export function FavoriteButton({ itemId, className = '' }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(itemId);
  return <button type="button" className={`favorite-button${active ? ' is-active' : ''} ${className}`} onClick={(event) => { event.preventDefault(); event.stopPropagation(); toggleFavorite(itemId); }} aria-label={active ? 'Remove from favourites' : 'Add to favourites'} aria-pressed={active}><Heart size={18} fill={active ? 'currentColor' : 'none'} /></button>;
}

export function CartBadge({ count }) {
  return <span className="cart-badge" aria-label={`${count} ${count === 1 ? 'item' : 'items'} in cart`}>{count > 99 ? '99+' : count}</span>;
}

export function QuantitySelector({ quantity, onIncrease, onDecrease, label = 'Quantity' }) {
  return <div className="quantity-control" aria-label={label}><button type="button" aria-label="Decrease quantity" onClick={onDecrease}>−</button><span aria-live="polite">{quantity}</span><button type="button" aria-label="Increase quantity" onClick={onIncrease}>+</button></div>;
}

export function PriceSummary({ items, total }) {
  return <section className="price-summary" aria-label="Order total"><div><span>Items</span><span>{items} {items === 1 ? 'item' : 'items'}</span></div><div className="price-summary__total"><span>Total</span><strong>PKR {Number(total).toLocaleString('en-PK')}</strong></div><p>No hidden charges. Pay at pickup.</p></section>;
}

export function Breadcrumb({ children }) {
  return <nav className="breadcrumb" aria-label="Breadcrumb"><ol><li><Link to="/">Menu</Link></li>{children}</ol></nav>;
}

export function Modal({ open, title, children, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    function onKeyDown(event) { if (event.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);
  if (!open) return null;
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="icon-button modal__close" onClick={onClose} aria-label="Close dialog"><X size={19} /></button><h2 id="modal-title">{title}</h2>{children}</section></div>;
}
