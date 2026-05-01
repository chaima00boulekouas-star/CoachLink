import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Menu, X } from 'lucide-react';
import Logo from './Logo';
import Button from './Button';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle hash scrolling after navigation
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      // Small delay to let the page render first
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Our Process', path: '/#process' },
    { name: 'About', path: '/#about' },
    { name: 'Contact', path: '/#contact' },
  ];

  const handleNavClick = (e, link) => {
    if (link.path.startsWith('/#')) {
      e.preventDefault();
      const id = link.path.replace('/#', '');

      if (location.pathname === '/') {
        // Already on home page, just scroll
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        // Navigate to home first, then scroll (handled by useEffect above)
        navigate('/' , { replace: false });
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300);
      }
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'py-3 bg-white/90 dark:bg-dark-bg/90 backdrop-blur-lg shadow-md border-b border-slate-200/50 dark:border-dark-border/50'
        : 'py-4 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-slate-100/50 dark:border-dark-border/30'
    }`}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo className="h-10" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.path}
              onClick={(e) => handleNavClick(e, link)}
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost" className="!w-auto px-5 text-sm">Login</Button>
          </Link>
          <Link to="/join">
            <Button variant="orange" className="!w-auto px-6 text-sm">Join Now</Button>
          </Link>
          
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 transition-all hover:scale-110 active:scale-95 border border-slate-200 dark:border-white/5 shadow-inner"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center space-x-3">
          <button onClick={toggleTheme} className="p-2 rounded-lg bg-slate-100 dark:bg-white/10">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-slate-600 dark:text-slate-300"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-dark-bg border-b border-slate-200 dark:border-dark-border p-4 space-y-4 shadow-xl">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.path}
              onClick={(e) => { handleNavClick(e, link); setIsMenuOpen(false); }}
              className="block py-2 text-base font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              {link.name}
            </a>
          ))}
          <div className="flex flex-col space-y-3 pt-2">
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/join" onClick={() => setIsMenuOpen(false)}>
              <Button variant="orange">Join Now</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
