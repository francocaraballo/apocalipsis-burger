import { NavLink, useLocation } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import logoSrc from '../assets/logo.png';

interface NavbarProps {
  onCartOpen: () => void;
}

export function Navbar({ onCartOpen }: NavbarProps) {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(14,13,12,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,160,0,0.12)',
      }}
      role="banner"
    >
      <nav
        className={`max-w-lg mx-auto px-4 h-14 flex items-center ${
          isAdminRoute ? 'justify-center' : 'justify-between'
        }`}
        aria-label="Navegación principal"
      >
        {/* Logo — lleva al inicio */}
        <NavLink
          to="/"
          className="flex items-center gap-2"
          aria-label="Apocalipsis Burger — Inicio"
        >
          <img
            src={logoSrc}
            alt="Apocalipsis Burger"
            className="navbar-logo"
          />
        </NavLink>

        {/* Cart button */}
        {!isAdminRoute && (
          <button
            id="cart-toggle-btn"
            onClick={onCartOpen}
            aria-label={`Carrito${totalItems > 0 ? ` — ${totalItems} items` : ''}`}
            className="relative flex items-center justify-center transition-opacity hover:opacity-80 cursor-pointer"
            style={{ padding: '6px' }}
          >
            <ShoppingBag
              size={24}
              style={{
                color: totalItems > 0
                  ? 'var(--color-primary)'
                  : 'var(--color-on-surface-variant)',
              }}
              aria-hidden="true"
            />
            {totalItems > 0 && (
              <span
                className="absolute flex items-center justify-center text-[10px] font-bold"
                style={{
                  top: '0',
                  right: '-2px',
                  minWidth: '18px',
                  height: '18px',
                  borderRadius: '9999px',
                  background: 'var(--color-primary)',
                  color: 'var(--color-on-primary)',
                  lineHeight: 1,
                }}
              >
                {totalItems}
              </span>
            )}
          </button>
        )}
      </nav>
    </header>
  );
}
