import { useState } from 'react';
import { Plus, ChevronDown, ShoppingCart } from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onAddedToCart?: () => void;
}

const SIZE_OPTIONS = [
  { label: 'Simple', key: 'simple' },
  { label: 'Doble', key: 'double' },
  { label: 'Triple', key: 'triple' },
] as const;

export function ProductCard({ product, onAddedToCart }: ProductCardProps) {
  const { addItem, items } = useCart();
  const [selectedSize, setSelectedSize] = useState(0);
  const sizeOption = SIZE_OPTIONS[selectedSize];

  const cartItemQuantity = items.reduce((acc, i) => {
    if (i.product.id === product.id || i.product.id.startsWith(`${product.id}-`)) {
      return acc + i.quantity;
    }
    return acc;
  }, 0);
  const inCart = cartItemQuantity > 0;
  const finalPrice = product.prices 
    ? product.prices[sizeOption.key] 
    : (product.price ?? 0);

  function handleAdd() {
    addItem({
      ...product,
      id: product.prices ? `${product.id}-${sizeOption.key}` : product.id,
      price: finalPrice, // Override price with final price in cart
      name: product.prices && selectedSize > 0 ? `${product.name} — ${sizeOption.label}` : product.name,
    });
    onAddedToCart?.();
  }

  return (
    <article
      className="overflow-hidden"
      style={{
        background: 'var(--color-surface-container)',
        borderBottom: '1px solid rgba(255,160,0,0.08)',
      }}
    >
      {/* ── Imagen ── */}
      <div className="relative w-full" style={{ height: '200px' }}>
        <img
          src={product.image}
          alt={`Imagen de ${product.name}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Gradient overlay para legibilidad */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(32,30,26,0.85) 0%, rgba(32,30,26,0.1) 50%, transparent 100%)',
          }}
          aria-hidden="true"
        />

        {/* Badge en carrito */}
        {inCart && (
          <span
            className="absolute top-3 left-3 w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold"
            style={{
              background: 'var(--color-primary)',
              color: 'var(--color-on-primary)',
              fontFamily: 'var(--font-display)',
            }}
            aria-label={`${cartItemQuantity} en el carrito`}
          >
            {cartItemQuantity}
          </span>
        )}
      </div>

      {/* ── Contenido ── */}
      <div className="px-4 pt-3 pb-4">
        {/* Nombre */}
        <h2
          className="font-bold uppercase leading-tight mb-1"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.1rem',
            color: 'var(--color-on-surface)',
            letterSpacing: '-0.01em',
          }}
        >
          {product.name}
        </h2>

        {/* Descripción */}
        <p
          className="text-xs leading-relaxed mb-3"
          style={{ color: 'var(--color-on-surface-variant)' }}
        >
          {product.description}
        </p>

        {/* Precio */}
        <p
          className="font-bold text-lg mb-3"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-tertiary)',
          }}
          aria-label={`Precio: ${finalPrice.toLocaleString('es-AR')} pesos`}
        >
          ${finalPrice.toLocaleString('es-AR')}
        </p>

        {/* Selector de tamaño */}
        {product.prices && (
          <div className="mb-3">
            <label
              htmlFor={`size-select-${product.id}`}
              className="block text-xs uppercase tracking-wider mb-1.5"
              style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'var(--font-display)' }}
            >
              Elegí el tipo de carne
            </label>
            <div className="relative">
              <select
                id={`size-select-${product.id}`}
                value={selectedSize}
                onChange={(e) => setSelectedSize(Number(e.target.value))}
                className="w-full px-3 py-2.5 text-sm appearance-none cursor-pointer outline-none"
                style={{
                  background: 'var(--color-surface-container-high)',
                  color: 'var(--color-on-surface)',
                  border: '1px solid rgba(255,160,0,0.25)',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {SIZE_OPTIONS.map((opt, i) => (
                  <option key={i} value={i}>
                    {opt.label} — ${product.prices![opt.key].toLocaleString('es-AR')}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: 'var(--color-primary)' }}
                aria-hidden="true"
              />
            </div>
          </div>
        )}

        {/* Botón agregar */}
        <button
          id={`add-to-cart-${product.id}`}
          onClick={handleAdd}
          disabled={!product.available}
          aria-label={`Agregar ${product.name} al pedido`}
          className="w-full flex items-center justify-center gap-2 py-3 font-bold uppercase tracking-wider text-sm transition-all duration-150 hover:brightness-110 active:scale-[0.99] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            fontFamily: 'var(--font-display)',
            background: 'var(--color-primary)',
            color: 'var(--color-on-primary)',
            borderRadius: '4px',
            letterSpacing: '0.06em',
          }}
        >
          <Plus size={14} aria-hidden="true" />
          AGREGAR AL PEDIDO
          <ShoppingCart size={14} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
