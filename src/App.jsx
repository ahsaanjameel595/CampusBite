import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ToastProvider } from './context/ToastContext';
import { MenuPage } from './pages/MenuPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ItemDetailsPage } from './pages/ItemDetailsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return <BrowserRouter><CartProvider><FavoritesProvider><ToastProvider><Routes>
    <Route path="/" element={<MenuPage />} />
    <Route path="/favorites" element={<FavoritesPage />} />
    <Route path="/menu/:id" element={<ItemDetailsPage />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/checkout" element={<CheckoutPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes></ToastProvider></FavoritesProvider></CartProvider></BrowserRouter>;
}
