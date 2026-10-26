import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock3, Plus, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../utils/formatPrice';
import { Button, FavoriteButton } from '../common/UI';

export function ItemCard({ item }) {
  const { addToCart } = useCart();
  const showToast = useToast();
  function handleAdd() {
    if (addToCart(item)) showToast(`${item.name} added to your bag`);
  }
  return <article className="food-card">
    <Link className="food-card__image-link" to={`/menu/${item.id}`} aria-label={`View ${item.name}`}>
      <img className="food-card__image" src={item.image} alt={item.name} loading="lazy" />
      {item.isPopular && <span className="food-card__tag">Campus favourite</span>}
    </Link>
    <FavoriteButton itemId={item.id} className="food-card__favorite" />
    <div className="food-card__body">
      <div className="food-card__meta"><span>{item.category}</span><span><Star size={13} fill="currentColor" />{item.rating.toFixed(1)}</span></div>
      <Link className="food-card__title" to={`/menu/${item.id}`}>{item.name}<ArrowUpRight size={15} /></Link>
      <p className="food-card__description">{item.description}</p>
      <div className="food-card__bottom"><strong>{formatPrice(item.price)}</strong><span className="food-card__time"><Clock3 size={14} />{item.preparationTime} min</span></div>
      <Button className="food-card__add" onClick={handleAdd} disabled={!item.available}><Plus size={16} />{item.available ? 'Add to bag' : 'Unavailable'}</Button>
    </div>
  </article>;
}

export function MenuList({ items }) {
  return <div className="menu-grid">{items.map((item) => <ItemCard item={item} key={item.id} />)}</div>;
}
