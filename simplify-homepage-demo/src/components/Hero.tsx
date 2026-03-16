import { ArrowRight } from 'lucide-react';
import Calculator from './Calculator';

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-white pt-16 pb-24 sm:pt-24 lg:pt-32">
      {/* Background patterns */}
      <div className="hidden lg:absolute lg:inset-y-0 lg:block lg:h-full lg:w-full lg:[clip-path:polygon(74%_0,100%_0,100%_100%,22%_100%)]">
        <div className="absolute inset-0 bg-indigo-50/50" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 text-center lg:text-left z-10">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
              <span className="block">Get printing prices fast</span>
              <span className="block text-indigo-600">from nearby shops</span>
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-lg text-gray-500 sm:max-w-2xl lg:mx-0 lg:max-w-none">
              Compare shops, configure your print job, and get a clear price breakdown in seconds. The easiest way to find accurate printing prices in Kenya.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-6 py-3.5 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              >
                Find a print shop
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3.5 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              >
                Try live pricing <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </div>
            
            <div className="mt-8 flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-500">
              <div className="flex -space-x-2">
                {/* Mock user avatars */}
                {[1,2,3,4].map(i => (
                  <img key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src={`https://ui-avatars.com/api/?name=User+${i}&background=random`} alt="" />
                ))}
              </div>
              <p>Trusted by <span className="font-semibold text-gray-900">500+</span> Kenyan businesses</p>
            </div>
          </div>
          <div className="mt-16 sm:mt-24 lg:col-span-6 lg:mt-0 z-10">
            <div className="relative mx-auto w-full max-w-lg">
               {/* Decorative elements behind calculator */}
               <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30"></div>
               <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30"></div>
               <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30"></div>
               
               <Calculator />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
