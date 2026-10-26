import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock3, Star } from 'lucide-react';
import { fetchMenuItemById } from '../services/menuService';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/formatPrice';
import { PageLayout } from '../components/layout/Layout';
import { Button, Breadcrumb, EmptyState, ErrorMessage, FavoriteButton, LoadingSkeleton, QuantitySelector } from '../components/common/UI';

export function ItemDetailsPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const showToast = useToast();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setItem(null);
    setError('');
    fetchMenuItemById(id)
      .then((menuItem) => { if (active) setItem(menuItem); })
      .catch((reason) => { if (active) setError(reason.message || 'The menu item could not be loaded.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, attempt]);

  function addItem() {
    for (let count = 0; count < quantity; count += 1) addToCart(item);
    showToast(`${quantity} × ${item.name} added to your bag`);
  }

  return <PageLayout className="content-page detail-page"><Breadcrumb><li aria-current="page">{item?.name || 'Dish details'}</li></Breadcrumb>
    {loading ? <LoadingSkeleton count={1} /> : error ? <ErrorMessage message={error} onRetry={() => setAttempt((current) => current + 1)} /> : !item ? <EmptyState title="That dish isn’t on our menu" message="It may have sold out or the link may be incorrect." action={<Button as={Link} to="/">Back to the menu</Button>} /> : <article className="detail-layout"><div className="detail-image-wrap"><img src={item.image} alt={item.name} className="detail-image" /><span className="detail-image__label">PREPARED FRESH</span><FavoriteButton itemId={item.id} className="detail-favorite" /></div><div className="detail-copy"><Link className="back-link" to="/"><ArrowLeft size={15} /> Back to menu</Link><span className="eyebrow">{item.category}</span><h1>{item.name}</h1><div className="detail-stats"><span><Star size={15} fill="currentColor" />{item.rating.toFixed(1)} <small>rating</small></span><span><Clock3 size={15} />{item.preparationTime} min <small>prep</small></span><span className={item.available ? 'availability' : 'availability availability--off'}><i />{item.available ? 'Available' : 'Sold out'}</span></div><p className="detail-description">{item.description}</p><div className="ingredients"><h2>What’s in it</h2><ul>{item.ingredients.map((ingredient) => <li key={ingredient}>{ingredient}</li>)}</ul></div><div className="detail-order"><strong>{formatPrice(item.price)}</strong><QuantitySelector quantity={quantity} onIncrease={() => setQuantity((current) => current + 1)} onDecrease={() => setQuantity((current) => Math.max(1, current - 1))} /><Button onClick={addItem} disabled={!item.available}>{item.available ? 'Add to bag' : 'Currently unavailable'}</Button></div></div></article>}
  </PageLayout>;
}
