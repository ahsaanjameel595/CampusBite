import { NavLink, Link } from 'react-router-dom';
import { Heart, ShoppingBag, Utensils } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { CartBadge } from '../common/UI';

function Navbar() {
  const { cartCount } = useCart();
  return <nav className="navbar" aria-label="Main navigation"><NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}><Utensils size={16} />Menu</NavLink><NavLink to="/favorites" className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}><Heart size={16} />Favourites</NavLink><NavLink to="/cart" className={({ isActive }) => `nav-link nav-link--cart${isActive ? ' is-active' : ''}`}><ShoppingBag size={17} />Cart<CartBadge count={cartCount} /></NavLink></nav>;
}

export function Header() {
  return <header className="site-header"><div className="header-inner"><Link className="brand" to="/" aria-label="CampusBite home"><span className="brand__mark"><Utensils size={19} /></span><span className="brand__word">campus<span>bite</span><small>GOOD FOOD, BETWEEN CLASSES</small></span></Link><Navbar /><span className="pickup-note"><span className="pickup-note__dot" />Open for pickup</span></div></header>;
}

export function Footer() {
  return <footer className="site-footer"><div className="footer-inner"><span>CampusBite <span className="footer-dot">·</span> Made for campus days</span><span>Freshly prepared, ready when you are.</span></div></footer>;
}

export function PageLayout({ children, className = '' }) {
  return <><Header /><main className={`page-main ${className}`.trim()}>{children}</main><Footer /></>;
}
