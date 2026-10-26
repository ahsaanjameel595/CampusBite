import { useMemo, useState } from 'react';
import { Heart, SearchX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMenu } from '../hooks/useMenu';
import { useFavorites } from '../context/FavoritesContext';
import { PageLayout } from '../components/layout/Layout';
import { MenuList } from '../components/menu/Menu';
import { Button, EmptyState, ErrorMessage, LoadingSkeleton, SearchBar } from '../components/common/UI';

export function FavoritesPage() {
  const { items, loading, error, retry } = useMenu();
  const { favorites } = useFavorites();
  const [query, setQuery] = useState('');
  const savedItems = useMemo(() => items.filter((item) => favorites.includes(item.id) && (!query.trim() || `${item.name} ${item.category} ${item.description}`.toLowerCase().includes(query.trim().toLowerCase()))), [items, favorites, query]);

  return <PageLayout className="content-page"><div className="page-heading"><span className="eyebrow">YOUR SHORTLIST</span><h1>Favourites<span className="heading-count">{favorites.length.toString().padStart(2, '0')}</span></h1><p>The dishes you come back to, all in one place.</p></div>
    {favorites.length > 0 && <div className="favorites-search"><SearchBar value={query} onChange={setQuery} /></div>}
    {loading ? <LoadingSkeleton /> : error ? <ErrorMessage message={error} onRetry={retry} /> : savedItems.length ? <MenuList items={savedItems} /> : favorites.length ? <EmptyState icon={SearchX} title="No matches in your favourites" message="Try a different search term." action={<Button variant="outline" onClick={() => setQuery('')}>Clear search</Button>} /> : <EmptyState icon={Heart} title="A little love goes a long way" message="Tap the heart on any dish and it’ll be waiting here for you." action={<Button as={Link} to="/">Find your favourites</Button>} />}
  </PageLayout>;
}
