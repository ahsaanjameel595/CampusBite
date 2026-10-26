const MENU_URL = '/data/menu.json';

function isMenuItem(item) {
  return item && typeof item.id === 'string' && item.id.trim()
    && typeof item.name === 'string' && item.name.trim()
    && typeof item.description === 'string' && typeof item.category === 'string'
    && Number.isFinite(item.price) && typeof item.image === 'string'
    && Number.isFinite(item.rating) && Number.isFinite(item.preparationTime)
    && typeof item.available === 'boolean' && typeof item.isPopular === 'boolean'
    && Array.isArray(item.ingredients);
}

export async function fetchMenu() {
  let response;
  try {
    response = await fetch(MENU_URL);
  } catch {
    throw new Error('We could not reach the menu. Check your connection and try again.');
  }

  if (!response.ok) {
    throw new Error(`The menu could not be loaded (error ${response.status}). Please try again.`);
  }

  let items;
  try {
    items = await response.json();
  } catch {
    throw new Error('The menu data could not be read. Please try again later.');
  }

  if (!Array.isArray(items) || items.some((item) => !isMenuItem(item))) {
    throw new Error('The menu data is incomplete. Please try again later.');
  }
  return items;
}

export async function fetchMenuItemById(id) {
  if (typeof id !== 'string' || !id.trim()) return null;
  const items = await fetchMenu();
  return items.find((item) => item.id === id) ?? null;
}
