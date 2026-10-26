import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchMenu, fetchMenuItemById } from '../src/services/menuService';

const validItem = { id: 'tea', name: 'Tea', description: 'Fresh tea', category: 'Drinks', price: 100, image: '/images/drink.svg', rating: 4.5, preparationTime: 3, available: true, isPopular: false, ingredients: ['Tea'] };

afterEach(() => vi.unstubAllGlobals());

describe('menu service', () => {
  it('loads a valid menu response', async () => {
    const items = [validItem];
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => items }));
    await expect(fetchMenu()).resolves.toEqual(items);
  });

  it('rejects invalid menu data', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [{ id: 'tea', name: 'Tea' }] }));
    await expect(fetchMenu()).rejects.toThrow('menu data is incomplete');
  });

  it('handles invalid JSON responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => { throw new SyntaxError('invalid JSON'); } }));
    await expect(fetchMenu()).rejects.toThrow('menu data could not be read');
  });

  it('returns null for an invalid item ID', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    await expect(fetchMenuItemById('')).resolves.toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns null when an item is missing', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [validItem] }));
    await expect(fetchMenuItemById('coffee')).resolves.toBeNull();
  });
});
