import { useMemo, useState } from 'react';
import { ArrowDownRight, SearchX, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMenu } from '../hooks/useMenu';
import { useFavorites } from '../context/FavoritesContext';
import { PageLayout } from '../components/layout/Layout';
import { MenuList } from '../components/menu/Menu';
import { Button, CategoryFilter, EmptyState, ErrorMessage, LoadingSkeleton, SearchBar } from '../components/common/UI';

const CATEGORIES = ['All', 'Burgers', 'Pizza', 'Sandwiches', 'Pakistani Food', 'Fast Food', 'Drinks', 'Desserts'];

export function MenuPage() {
  const { items, loading, error, retry } = useMenu();
  const { favorites } = useFavorites();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [popularOnly, setPopularOnly] = useState(false);
  const visibleItems = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesSearch = !term || `${item.name} ${item.category} ${item.description}`.toLowerCase().includes(term);
      return matchesSearch && (category === 'All' || item.category === category) && (!popularOnly || item.isPopular);
    });
  }, [items, query, category, popularOnly]);

  return <PageLayout className="menu-page">
    <section className="welcome-band"><div className="welcome-band__copy"><span className="eyebrow"><Sparkles size={14} /> THE CAMPUS CANTEEN, REIMAGINED</span><h1>Your next good break<br /><em>starts here.</em></h1><p>Fresh favourites, made on campus. Pick your comfort food and we’ll have it ready.</p><a className="welcome-band__jump" href="#menu">Explore today’s menu <ArrowDownRight size={16} /></a></div><div className="welcome-band__art" aria-hidden="true"><img src="/images/ClassicCheeseBurger_9.jpg" alt="" /><span className="welcome-band__stamp">MADE<br />FRESH</span></div><div className="welcome-band__side"><span>01</span><span>Good food<br />between classes</span></div></section>
    <section className="menu-section" id="menu" aria-labelledby="menu-heading">
      <div className="section-heading"><div><span className="eyebrow">THE GOOD STUFF</span><h2 id="menu-heading">What sounds good?</h2></div><span className="menu-count">{loading ? 'Loading…' : `${items.length} things to love`}</span></div>
      <div className="menu-tools"><SearchBar value={query} onChange={setQuery} /><label className="popular-toggle"><input type="checkbox" checked={popularOnly} onChange={(event) => setPopularOnly(event.target.checked)} /><span>Campus favourites</span></label></div>
      <CategoryFilter categories={CATEGORIES} value={category} onChange={setCategory} />
      {loading ? <LoadingSkeleton /> : error ? <ErrorMessage message={error} onRetry={retry} /> : visibleItems.length ? <><p className="results-count" aria-live="polite">Showing {visibleItems.length} {visibleItems.length === 1 ? 'dish' : 'dishes'}</p><MenuList items={visibleItems} /></> : <EmptyState icon={SearchX} title="Nothing on this plate" message="Try another search or clear a filter to see more of the menu." action={<Button variant="outline" onClick={() => { setQuery(''); setCategory('All'); setPopularOnly(false); }}>Clear filters</Button>} />}
    </section>
    <aside className="favorites-ribbon"><span className="favorites-ribbon__icon">♡</span><p>Keep the good ones close. <strong>{favorites.length} saved favourite{favorites.length === 1 ? '' : 's'}</strong></p><Button as={Link} to="/favorites" variant="text">View favourites <ArrowDownRight size={16} /></Button></aside>
  </PageLayout>;
}
