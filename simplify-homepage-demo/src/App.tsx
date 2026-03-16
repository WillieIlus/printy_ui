import Hero from './components/Hero';
import { 
  Navbar, 
  SocialProof, 
  HowItWorks, 
  PopularProducts, 
  PopularLocations, 
  WhyPrinty, 
  ShopOwnerCTA, 
  Footer 
} from './components/Sections';

export function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <HowItWorks />
        <PopularProducts />
        <PopularLocations />
        <WhyPrinty />
        <ShopOwnerCTA />
      </main>
      <Footer />
    </div>
  );
}
