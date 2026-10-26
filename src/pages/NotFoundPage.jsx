import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import { Button } from '../components/common/UI';
import { PageLayout } from '../components/layout/Layout';

export function NotFoundPage() {
  return <PageLayout className="content-page"><section className="not-found"><span className="not-found__icon"><Compass size={30} /></span><span className="eyebrow">404 · WRONG TURN</span><h1>This page isn’t<br /><em>on the menu.</em></h1><p>Let’s get you back to the good stuff.</p><Button as={Link} to="/"><ArrowLeft size={16} /> Back to CampusBite</Button></section></PageLayout>;
}
