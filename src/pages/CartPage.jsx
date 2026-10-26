import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Cart } from '../components/cart/Cart';
import { PageLayout } from '../components/layout/Layout';

export function CartPage() {
  return <PageLayout className="content-page"><Link className="back-link" to="/"><ArrowLeft size={15} /> Back to menu</Link><div className="page-heading page-heading--compact"><span className="eyebrow">YOUR ORDER, YOUR WAY</span><h1>Your bag</h1><p>Everything for your next campus break.</p></div><Cart /></PageLayout>;
}
