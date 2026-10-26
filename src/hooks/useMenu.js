import { useCallback, useEffect, useState } from 'react';
import { fetchMenu } from '../services/menuService';

export function useMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    fetchMenu()
      .then((menu) => { if (active) setItems(menu); })
      .catch((reason) => { if (active) setError(reason.message || 'Something went wrong while loading the menu.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [attempt]);

  const retry = useCallback(() => setAttempt((current) => current + 1), []);
  return { items, loading, error, retry };
}
