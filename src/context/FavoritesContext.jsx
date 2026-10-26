import { createContext, useCallback, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [storedFavorites, setStoredFavorites] = useLocalStorage('campusbite-favorites', []);
  const favorites = useMemo(() => Array.isArray(storedFavorites) ? storedFavorites.filter((id) => typeof id === 'string') : [], [storedFavorites]);

  const toggleFavorite = useCallback((itemId) => {
    if (!itemId) return;
    setStoredFavorites((current) => {
      const ids = Array.isArray(current) ? current.filter((id) => typeof id === 'string') : [];
      return ids.includes(itemId) ? ids.filter((id) => id !== itemId) : [...ids, itemId];
    });
  }, [setStoredFavorites]);

  const value = useMemo(() => ({
    favorites,
    isFavorite: (itemId) => favorites.includes(itemId),
    toggleFavorite,
  }), [favorites, toggleFavorite]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used inside FavoritesProvider');
  return context;
}
