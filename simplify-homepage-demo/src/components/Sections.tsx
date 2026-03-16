import { Zap, CheckCircle2, ChevronRight, Store, ArrowRight, Printer, MapPin, Search, Smartphone, ShieldCheck } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Printer className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">Printy.ke</span>
            </div>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              <a href="#" className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Find Shops</a>
              <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Products</a>
              <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Locations</a>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900">Sign in</a>
            <a href="#" className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">For Print Shops</a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function SocialProof() {
  return (
    <div className="bg-white py-6 border-y border-gray-100 mt-12 sm:mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-16 text-gray-500 text-sm font-medium">
          <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-indigo-600" /> Compare print options</div>
          <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-indigo-600" /> Fast quote estimates</div>
          <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-indigo-600" /> Kenyan shilling pricing</div>
          <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-indigo-600" /> Find nearby shops</div>
        </div>
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">How Printy Works</h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Get your printing sorted in three simple steps.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mx-auto mb-6">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">1. Choose location & product</h3>
              <p className="mt-3 text-base text-gray-500">Select what you need printed and where you need it delivered or picked up.</p>
            </div>
            <div className="text-center relative">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mx-auto mb-6">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">2. Compare options & prices</h3>
              <p className="mt-3 text-base text-gray-500">See instant price estimates and compare nearby print shops instantly.</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mx-auto mb-6">
                <Smartphone className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">3. Request quote & print</h3>
              <p className="mt-3 text-base text-gray-500">Send your exact requirements to the shop via WhatsApp or direct request.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PopularProducts() {
  const products = ['Business Cards', 'Flyers', 'Brochures', 'Stickers', 'Banners', 'Receipt Books'];
  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Popular Products</h2>
            <p className="mt-2 text-lg text-gray-500">Find pricing for Kenya's most printed items.</p>
          </div>
          <a href="#" className="hidden sm:flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
            View all products <ChevronRight className="w-5 h-5 ml-1" />
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {products.map((item, i) => (
            <div key={i} className="group relative bg-gray-50 rounded-xl p-6 text-center hover:bg-indigo-50 transition-colors cursor-pointer border border-gray-100 hover:border-indigo-100">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4 text-indigo-600 group-hover:scale-110 transition-transform">
                <Printer className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">{item}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PopularLocations() {
  const locations = ['Nairobi CBD', 'Westlands', 'Kilimani', 'Industrial Area', 'Thika Road', 'Mombasa', 'Kisumu', 'Nakuru'];
  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2 text-center">Print Shops Near You</h2>
        <p className="text-lg text-gray-500 text-center mb-10">Find reliable local printers in top business hubs.</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {locations.map((loc, i) => (
            <a key={i} href="#" className="bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-100 text-center font-medium text-gray-700 hover:text-indigo-600 hover:border-indigo-200 transition-colors flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" /> {loc}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export function WhyPrinty() {
  const features = [
    { name: 'Instant quote estimates', icon: Zap, desc: 'Stop waiting for email replies. See clear, calculated prices immediately.' },
    { name: 'Nearby print shops', icon: Store, desc: 'Discover trusted printers right in your neighborhood or business district.' },
    { name: 'Clear price breakdown', icon: ShieldCheck, desc: 'Know exactly what you are paying for, from paper type to finishing.' },
    { name: 'WhatsApp-ready quotes', icon: Smartphone, desc: 'Share your exact configured specs directly to the shop owner via WhatsApp.' },
  ];
  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">Why use Printy?</h2>
            <p className="text-lg text-gray-500 mb-8">We take the guesswork out of printing. No more vague quotes or endless phone calls to find out if a shop can print your job.</p>
            
            <div className="space-y-8">
              {features.map((feature, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600">
                      <feature.icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{feature.name}</h3>
                    <p className="mt-1 text-gray-500">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 to-white rounded-3xl transform rotate-3"></div>
            <div className="relative bg-white border border-gray-100 shadow-xl rounded-3xl p-8 aspect-square flex flex-col justify-center items-center text-center">
              <div className="bg-green-100 p-4 rounded-full mb-6">
                <Smartphone className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Send directly to WhatsApp</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left w-full max-w-sm font-mono text-sm text-gray-600">
                <p>Hi, I found you on Printy.</p>
                <p className="mt-2">I'd like to print:</p>
                <p className="font-bold text-gray-900 mt-1">- 100x Business Cards</p>
                <p className="font-bold text-gray-900">- Matte Lamination</p>
                <p className="mt-2">Estimated Total: <span className="text-green-600 font-bold">KES 1,560</span></p>
                <p className="mt-2">Can you confirm this quote?</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ShopOwnerCTA() {
  return (
    <div className="bg-indigo-900">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <div className="lg:w-0 lg:flex-1">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Own a print shop?
          </h2>
          <p className="mt-4 max-w-3xl text-lg text-indigo-200">
            Join Printy to receive instant quote requests and new customers from your area. Manage your pricing, showcase your catalog, and grow your business.
          </p>
        </div>
        <div className="mt-8 lg:mt-0 lg:ml-8 lg:flex-shrink-0">
          <a
            href="#"
            className="flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-indigo-900 bg-white hover:bg-indigo-50 md:text-lg transition-colors shadow-sm"
          >
            Claim your shop <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-indigo-600 p-1.5 rounded-md">
              <Printer className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900 tracking-tight">Printy.ke</span>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            The easiest way to find print shops and get accurate printing prices in Kenya.
          </p>
          <div className="flex gap-4 text-gray-400">
            {/* Social Icons Placeholder */}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Products</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><a href="#" className="hover:text-indigo-600">Business Cards</a></li>
            <li><a href="#" className="hover:text-indigo-600">Flyers & Posters</a></li>
            <li><a href="#" className="hover:text-indigo-600">Banners & Signage</a></li>
            <li><a href="#" className="hover:text-indigo-600">Receipt Books</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Locations</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><a href="#" className="hover:text-indigo-600">Nairobi CBD</a></li>
            <li><a href="#" className="hover:text-indigo-600">Westlands</a></li>
            <li><a href="#" className="hover:text-indigo-600">Industrial Area</a></li>
            <li><a href="#" className="hover:text-indigo-600">Kilimani</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Printy</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><a href="#" className="hover:text-indigo-600">For Print Shops</a></li>
            <li><a href="#" className="hover:text-indigo-600">Sign In</a></li>
            <li><a href="#" className="hover:text-indigo-600">Contact Us</a></li>
            <li><a href="#" className="hover:text-indigo-600">Terms & Privacy</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-100 text-sm text-gray-400 text-center">
        &copy; {new Date().getFullYear()} Printy.ke. All rights reserved.
      </div>
    </footer>
  );
}
