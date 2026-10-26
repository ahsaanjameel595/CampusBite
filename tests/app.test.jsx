import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../src/App';
import menu from '../public/data/menu.json';

function mockMenuFetch() {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => menu }));
}

function renderAt(path = '/') {
  window.history.replaceState({}, '', path);
  return render(<App />);
}

function prepareCheckout() {
  window.localStorage.setItem('campusbite-cart', JSON.stringify([{ ...menu[0], quantity: 1 }]));
}

function completeCheckoutForm() {
  fireEvent.change(screen.getByLabelText('Student name'), { target: { value: 'Ayesha Khan' } });
  fireEvent.change(screen.getByLabelText('Student ID'), { target: { value: '24-CS-104' } });
  fireEvent.change(screen.getByLabelText('Campus pickup point'), { target: { value: 'Main Canteen' } });
  fireEvent.change(screen.getByLabelText('Contact number'), { target: { value: '03001234567' } });
  fireEvent.click(screen.getByRole('button', { name: /place your order/i }));
}

beforeEach(() => mockMenuFetch());

describe('CampusBite application', () => {
  it('loads the menu asynchronously', async () => {
    let resolveFetch;
    vi.stubGlobal('fetch', vi.fn(() => new Promise((resolve) => { resolveFetch = resolve; })));
    renderAt('/');
    expect(screen.getByLabelText('Loading menu')).toBeInTheDocument();
    resolveFetch({ ok: true, json: async () => menu });
    expect(await screen.findByText('Campus Smash Zinger')).toBeInTheDocument();
  });

  it('shows a friendly load error and retries', async () => {
    const fetchMock = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce({ ok: true, json: async () => menu });
    vi.stubGlobal('fetch', fetchMock);
    renderAt('/');
    expect(await screen.findByRole('alert')).toHaveTextContent('We could not reach the menu');
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByText('Campus Smash Zinger')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('searches menu names, categories, and descriptions', async () => {
    renderAt('/');
    await screen.findByText('Campus Smash Zinger');
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search food' }), { target: { value: 'seasonal mango' } });
    expect(screen.getByText('Mango Lassi')).toBeInTheDocument();
    expect(screen.queryByText('Campus Smash Zinger')).not.toBeInTheDocument();
  });

  it('filters menu results by category', async () => {
    renderAt('/');
    await screen.findByText('Campus Smash Zinger');
    fireEvent.click(screen.getByRole('button', { name: 'Pizza' }));
    expect(screen.getByText('Pepperoni Pizza')).toBeInTheDocument();
    expect(screen.queryByText('Campus Smash Zinger')).not.toBeInTheDocument();
  });

  it('keeps the category selected when search is cleared', async () => {
    renderAt('/');
    await screen.findByText('Campus Smash Zinger');
    fireEvent.click(screen.getByRole('button', { name: 'Pizza' }));
    const search = screen.getByRole('searchbox', { name: 'Search food' });
    fireEvent.change(search, { target: { value: 'no matching dish' } });
    fireEvent.change(search, { target: { value: '' } });
    expect(screen.getByText('Pepperoni Pizza')).toBeInTheDocument();
    expect(screen.queryByText('Campus Smash Zinger')).not.toBeInTheDocument();
  });

  it('toggles and displays persisted favourites', async () => {
    renderAt('/');
    await screen.findByText('Campus Smash Zinger');
    fireEvent.click(screen.getAllByRole('button', { name: 'Add to favourites' })[0]);
    fireEvent.click(screen.getByRole('link', { name: /Favourites/ }));
    expect(await screen.findByText('Campus Smash Zinger')).toBeInTheDocument();
    expect(window.localStorage.getItem('campusbite-favorites')).toContain('smash-zinger');
    fireEvent.click(screen.getByRole('button', { name: 'Remove from favourites' }));
    expect(await screen.findByText('A little love goes a long way')).toBeInTheDocument();
  });

  it('adds food to the shared cart and updates badge and total', async () => {
    renderAt('/');
    await screen.findByText('Campus Smash Zinger');
    const card = screen.getByText('Campus Smash Zinger').closest('article');
    fireEvent.click(within(card).getByRole('button', { name: /add to bag/i }));
    const cartLink = screen.getByRole('link', { name: /Cart/ });
    expect(cartLink).toHaveTextContent('1');
    fireEvent.click(cartLink);
    expect(await screen.findAllByText('PKR 650')).not.toHaveLength(0);
    expect(screen.getAllByText('PKR 650', { selector: 'strong' })).not.toHaveLength(0);
  });

  it('increases and decreases cart quantity and total', async () => {
    prepareCheckout();
    renderAt('/cart');
    expect(await screen.findByText('Campus Smash Zinger')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Increase quantity' }));
    expect(screen.getByText('2 items')).toBeInTheDocument();
    expect(screen.getAllByText('PKR 1,300')).not.toHaveLength(0);
    fireEvent.click(screen.getByRole('button', { name: 'Decrease quantity' }));
    expect(screen.getAllByText('PKR 650')).not.toHaveLength(0);
  });

  it('removes cart items and shows the empty state', async () => {
    prepareCheckout();
    renderAt('/cart');
    await screen.findByText('Campus Smash Zinger');
    fireEvent.click(screen.getByRole('button', { name: 'Remove Campus Smash Zinger' }));
    expect(await screen.findByText('Your bag is taking a break')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Browse the menu' })).toBeInTheDocument();
  });

  it('persists the cart and restores it on a new render', async () => {
    const { unmount } = renderAt('/');
    await screen.findByText('Campus Smash Zinger');
    const card = screen.getByText('Campus Smash Zinger').closest('article');
    fireEvent.click(within(card).getByRole('button', { name: /add to bag/i }));
    await waitFor(() => expect(window.localStorage.getItem('campusbite-cart')).toContain('smash-zinger'));
    unmount();
    window.history.replaceState({}, '', '/cart');
    render(<App />);
    expect(await screen.findAllByText('Campus Smash Zinger')).not.toHaveLength(0);
  });

  it('handles corrupt saved cart data without crashing', async () => {
    window.localStorage.setItem('campusbite-cart', '{invalid json');
    renderAt('/cart');
    expect(await screen.findByText('Your bag is taking a break')).toBeInTheDocument();
  });

  it('shows a useful not-found state for an invalid menu item ID', async () => {
    renderAt('/menu/not-a-real-dish');
    expect(await screen.findByText('That dish isn’t on our menu')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to the menu' })).toBeInTheDocument();
  });

  it('renders an unknown route page', () => {
    renderAt('/somewhere-else');
    expect(screen.getByText('This page isn’t')).toBeInTheDocument();
  });

  it('validates required checkout fields', async () => {
    prepareCheckout();
    renderAt('/checkout');
    await screen.findByText('Make it yours');
    fireEvent.click(screen.getByRole('button', { name: /place your order/i }));
    expect(screen.getByText('Enter your name (at least 2 characters).')).toBeInTheDocument();
    expect(screen.getByText('Enter a valid student ID (4–20 letters or numbers).')).toBeInTheDocument();
    expect(screen.getByText('Choose a pickup point.')).toBeInTheDocument();
    expect(screen.getByText('Enter a valid contact number.')).toBeInTheDocument();
  });

  it('places a simulated order, shows confirmation, and clears the cart', async () => {
    prepareCheckout();
    renderAt('/checkout');
    await screen.findByText('Make it yours');
    completeCheckoutForm();
    expect(await screen.findByRole('heading', { name: /You’re all set/ })).toBeInTheDocument();
    expect(screen.getByText(/CB-/)).toBeInTheDocument();
    expect(screen.getByText(/Campus Smash Zinger/)).toBeInTheDocument();
    await waitFor(() => expect(window.localStorage.getItem('campusbite-cart')).toBe('[]'));
  });
});
