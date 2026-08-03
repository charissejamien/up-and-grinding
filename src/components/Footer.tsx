import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { SiInstagram, SiFacebook, SiX } from "@icons-pack/react-simple-icons";

export default function Footer() {
  return (
    <footer className="bg-foreground text-white/70 text-sm mt-24 border-t border-white/10">
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          
          <div className="sm:col-span-2 md:col-span-4 lg:col-span-2 flex flex-col gap-3">
            <h2 className="text-xl font-bold tracking-tight text-white">UP & GRINDING</h2>
            <p className="text-xs sm:text-sm text-white/60 max-w-sm leading-relaxed">
              Supplying precision espresso gear and artisanal single-origin coffee beans for early mornings and big ideas.
            </p>
          </div>

          {/* Products Column */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase">Products</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Espresso Machines
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Artisanal Beans
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Customer Care
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us Column */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase">Contact Us</h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li className="flex items-center gap-2">
                <Phone size={15} className="shrink-0 text-white/50" />
                <span>+63 960-822-6296</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={15} className="shrink-0 text-white/50" />
                <span className="truncate">upgclub@upandgrinding.ph</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={15} className="shrink-0 text-white/50" />
                <span>Cebu City, Philippines</span>
              </li>
            </ul>

            <div className="mt-2 pt-2">
              <div className="flex items-center gap-3">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  aria-label="Instagram"
                  className="p-1.5 rounded-md hover:bg-white/10 hover:text-white transition-colors"
                >
                  <SiInstagram className="w-4 h-4" />
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  aria-label="Facebook"
                  className="p-1.5 rounded-md hover:bg-white/10 hover:text-white transition-colors"
                >
                  <SiFacebook className="w-4 h-4" />
                </a>
                <a 
                  href="https://x.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  aria-label="X"
                  className="p-1.5 rounded-md hover:bg-white/10 hover:text-white transition-colors"
                >
                  <SiX className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© 2026 Up & Grinding. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}