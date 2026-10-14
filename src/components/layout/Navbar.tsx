'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '../brand/Logo';
import { Menu, X, PlusCircle, ShieldCheck, User as UserIcon, LogOut } from 'lucide-react';

interface UserInfo {
  id: string;
  name: string;
  phone: string;
  role: string;
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/v1/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/v1/auth/logout', { method: 'POST' });
    setUser(null);
    window.location.href = '/';
  };

  const isStaff = user && ['ADMIN', 'INSPECTOR', 'SALES_EXECUTIVE'].includes(user.role);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <Logo />

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7">
            <Link
              href="/buses"
              className={`text-sm font-semibold transition-colors hover:text-[#0B3C8C] ${
                pathname.startsWith('/buses') ? 'text-[#0B3C8C]' : 'text-slate-700'
              }`}
            >
              Browse Buses
            </Link>
            <Link
              href="/how-it-works"
              className={`text-sm font-semibold transition-colors hover:text-[#0B3C8C] ${
                pathname === '/how-it-works' ? 'text-[#0B3C8C]' : 'text-slate-700'
              }`}
            >
              How It Works
            </Link>
            <Link
              href="/inspection-services"
              className={`text-sm font-semibold transition-colors hover:text-[#0B3C8C] ${
                pathname === '/inspection-services' ? 'text-[#0B3C8C]' : 'text-slate-700'
              }`}
            >
              14-Point Inspection
            </Link>
            <Link
              href="/about"
              className={`text-sm font-semibold transition-colors hover:text-[#0B3C8C] ${
                pathname === '/about' ? 'text-[#0B3C8C]' : 'text-slate-700'
              }`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`text-sm font-semibold transition-colors hover:text-[#0B3C8C] ${
                pathname === '/contact' ? 'text-[#0B3C8C]' : 'text-slate-700'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/seller/vehicles/new"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-sm transition-all min-h-[44px]"
            >
              <PlusCircle className="w-4 h-4" />
              Sell Your Bus
            </Link>

            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                {isStaff ? (
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs border border-indigo-200"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin
                  </Link>
                ) : (
                  <Link
                    href="/seller"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0B3C8C] font-semibold text-xs border border-blue-200"
                  >
                    <UserIcon className="w-4 h-4" />
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-slate-500 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 hover:border-[#0B3C8C] hover:text-[#0B3C8C] text-slate-700 font-semibold text-sm transition-colors min-h-[44px]"
              >
                Login / Register
              </Link>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/seller/vehicles/new"
              className="px-3 py-1.5 bg-amber-500 text-slate-950 text-xs font-bold rounded-md"
            >
              Sell Bus
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/buses"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-slate-800 hover:text-[#0B3C8C]"
          >
            Browse Buses
          </Link>
          <Link
            href="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-slate-800 hover:text-[#0B3C8C]"
          >
            How It Works
          </Link>
          <Link
            href="/inspection-services"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-slate-800 hover:text-[#0B3C8C]"
          >
            14-Point Inspection
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-slate-800 hover:text-[#0B3C8C]"
          >
            About
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-slate-800 hover:text-[#0B3C8C]"
          >
            Contact
          </Link>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/seller/vehicles/new"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg bg-amber-500 font-bold text-slate-950 text-sm"
            >
              Sell Your Bus
            </Link>
            {user ? (
              <div className="flex gap-2">
                <Link
                  href={isStaff ? '/admin' : '/seller'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 rounded-lg bg-blue-50 text-[#0B3C8C] font-semibold text-sm border border-blue-200"
                >
                  {isStaff ? 'Admin Console' : 'Seller Dashboard'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg border border-slate-300 font-semibold text-slate-800 text-sm"
              >
                Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
