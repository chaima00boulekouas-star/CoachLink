import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Instagram, Globe, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact" className="bg-slate-50 dark:bg-[#0A0A16] pt-16 pb-8 border-t border-slate-200 dark:border-dark-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo & Description */}
          <div className="space-y-6">
            <Logo className="!items-start" />
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
              Connecting athletes with professional trainers for peak performance. Join our community today and reach your full potential.
            </p>
            <div className="flex items-center space-x-4">
              {[Instagram, Linkedin, Globe].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="p-2 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-dark-border text-slate-500 dark:text-slate-400 hover:bg-primary-orange hover:text-white dark:hover:bg-primary-orange transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {[
                { label: 'Home',             path: '/' },
                { label: 'How It Works',     path: '/#process' },
                { label: 'Find Trainers',    path: '/coaches' },
                { label: 'Become a Trainer', path: '/join' },
              ].map(({ label, path }) => (
                <li key={label}>
                  <Link to={path} className="text-slate-600 dark:text-slate-400 text-sm hover:text-primary-blue dark:hover:text-primary-blue transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-slate-600 dark:text-slate-400 text-sm">
                <Mail size={16} className="text-primary-orange" />
                <span>support@coachlink.com</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-600 dark:text-slate-400 text-sm">
                <Phone size={16} className="text-primary-orange" />
                <span>1-800-TRAINLINK</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-600 dark:text-slate-400 text-sm">
                <MapPin size={16} className="text-primary-orange" />
                <span>San Francisco, CA</span>
              </li>
            </ul>
          </div>

          {/* Follow Us (Redundant with icons but matches footer column style) */}
          <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm">
            <h4 className="text-slate-900 dark:text-white font-bold mb-4 text-sm">Newsletter</h4>
            <p className="text-slate-500 dark:text-slate-400 text-xs mb-4">Get the latest training tips and updates.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-l-xl px-3 py-2 text-xs w-full focus:outline-none"
              />
              <button className="bg-primary-orange text-white px-4 py-2 rounded-r-xl text-xs font-bold transition-opacity hover:opacity-90">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-dark-border flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 CoachLink. All rights reserved.</p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-900 dark:hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white">Terms of service</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white">Admin</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
