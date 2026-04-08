import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  onCartOpen: () => void;
}

export function Navbar({ onCartOpen }: NavbarProps) {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

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
        className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between"
        aria-label="Navegación principal"
      >
        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center"
          aria-label="Apocalipsis Burger — Inicio"
        >
          <span
            className="font-bold text-base uppercase tracking-wider"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-primary)',
              letterSpacing: '0.08em',
            }}
          >
            APOCALIPSIS
          </span>
        </NavLink>

        {/* Cart button */}
        <button
          id="cart-toggle-btn"
          onClick={onCartOpen}
          aria-label={`Carrito${totalItems > 0 ? ` — ${totalItems} items` : ''}`}
          className="flex items-center gap-1.5 transition-opacity hover:opacity-80 cursor-pointer"
        >
          {totalItems > 0 ? (
            <span
              className="text-sm font-semibold uppercase tracking-wide"
              style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}
            >
              {totalItems} ITEM{totalItems > 1 ? 'S' : ''}
            </span>
          ) : (
            <ShoppingBag
              size={22}
              style={{ color: 'var(--color-on-surface-variant)' }}
              aria-hidden="true"
            />
          )}
        </button>
      </nav>
    </header>
  );
}

/* ──────────────────────────────────────────────
   Bottom navigation bar — fija al fondo
────────────────────────────────────────────── */
interface BottomNavProps {
  onCartOpen: () => void;
}

export function BottomNav({ onCartOpen }: BottomNavProps) {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex"
      aria-label="Navegación inferior"
      style={{
        background: 'rgba(14,13,12,0.96)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,160,0,0.15)',
        height: '64px',
      }}
    >
      {/* Home */}
      <NavLink
        to="/"
        end
        id="bottom-nav-home"
        className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-opacity"
        aria-label="Inicio"
      >
        {({ isActive }) => (
          <>
            <Home
              size={22}
              style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-on-surface-variant)' }}
              aria-hidden="true"
            />
            <span
              className="text-[10px] uppercase font-semibold tracking-wider"
              style={{
                color: isActive ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
                fontFamily: 'var(--font-display)',
              }}
            >
              Inicio
            </span>
          </>
        )}
      </NavLink>

      {/* Cart */}
      <button
        id="bottom-nav-cart"
        onClick={onCartOpen}
        className="flex-1 flex flex-col items-center justify-center gap-0.5 relative cursor-pointer transition-opacity hover:opacity-80"
        aria-label={`Carrito${totalItems > 0 ? ` — ${totalItems} items` : ''}`}
        style={{
          background: totalItems > 0 ? 'rgba(255,160,0,0.1)' : 'transparent',
        }}
      >
        <div className="relative">
          <ShoppingBag
            size={22}
            style={{ color: totalItems > 0 ? 'var(--color-primary)' : 'var(--color-on-surface-variant)' }}
            aria-hidden="true"
          />
          {totalItems > 0 && (
            <span
              className="absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{
                background: 'var(--color-primary)',
                color: 'var(--color-on-primary)',
              }}
              aria-hidden="true"
            >
              {totalItems}
            </span>
          )}
        </div>
        <span
          className="text-[10px] uppercase font-semibold tracking-wider"
          style={{
            color: totalItems > 0 ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
            fontFamily: 'var(--font-display)',
          }}
        >
          Carrito
        </span>
      </button>
    </nav>
  );
}
