import { useState } from 'react';
import { Plus, Minus, Trash2, MessageCircle, ShoppingBag, MapPin, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { sendWhatsAppOrder } from '../lib/whatsapp';
import envioData from '../data/envio.json';

type DeliveryMethod = 'delivery' | 'takeaway';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Cart({ isOpen, onClose }: CartProps) {
  const { items, removeItem, updateQuantity, getTotal } = useCart();
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('takeaway');
  const [address, setAddress] = useState('');

  const subtotal = getTotal();
  const envio = deliveryMethod === 'delivery' && items.length > 0 ? envioData.costoEnvio : 0;
  const total = subtotal + envio;

  function handleSendOrder() {
    if (items.length === 0) return;
    if (deliveryMethod === 'delivery' && !address.trim()) return;

    const deliveryInfo =
      deliveryMethod === 'takeaway'
        ? { method: 'takeaway' as const, address: 'Lavaisse 4050' }
        : { method: 'delivery' as const, address: address.trim() };

    sendWhatsAppOrder(items, deliveryInfo);
  }

  const canOrder =
    items.length > 0 &&
    (deliveryMethod === 'takeaway' || address.trim().length > 0);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar — se desliza desde la derecha */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        className="fixed inset-y-0 right-0 z-50 w-full max-w-sm flex flex-col transition-transform duration-300 ease-out"
        style={{
          background: 'var(--color-surface)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-4"
          style={{
            borderBottom: '1px solid rgba(255,160,0,0.15)',
          }}
        >
          <div>
            <h2
              className="text-xl font-bold uppercase"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-on-surface)',
                letterSpacing: '-0.01em',
              }}
            >
              TU STASH FINAL
            </h2>
            {items.length > 0 && (
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-on-surface-variant)' }}>
                {items.reduce((a, i) => a + i.quantity, 0)} producto{items.reduce((a, i) => a + i.quantity, 0) !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <button
            id="cart-close-btn"
            onClick={onClose}
            aria-label="Cerrar carrito"
            className="text-xs uppercase font-semibold tracking-wider cursor-pointer transition-opacity hover:opacity-70"
            style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}
          >
            × CERRAR
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
              <ShoppingBag size={56} style={{ color: 'var(--color-outline)' }} aria-hidden="true" />
              <p className="font-bold uppercase text-lg" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-on-surface-variant)' }}>
                Carrito vacío
              </p>
              <p className="text-sm" style={{ color: 'var(--color-outline)' }}>
                Agregá algo del menú para empezar tu condena.
              </p>
            </div>
          ) : (
            <ul aria-label="Items en el carrito">
              {items.map(({ product, quantity }) => (
                <li
                  key={product.id}
                  style={{ borderBottom: '1px solid rgba(255,160,0,0.08)' }}
                >
                  {/* Imagen grande */}
                  <div className="relative w-full" style={{ height: '160px', overflow: 'hidden' }}>
                    <img
                      src={product.image}
                      alt={`Imagen de ${product.name}`}
                      className="w-full h-full object-cover"
                    />
                    {/* Gradient overlay bottom */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-16"
                      style={{
                        background: 'linear-gradient(to top, var(--color-surface-container) 0%, transparent 100%)',
                      }}
                      aria-hidden="true"
                    />
                  </div>

                  {/* Info */}
                  <div
                    className="px-4 py-3"
                    style={{ background: 'var(--color-surface-container)' }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p
                        className="font-bold uppercase text-sm leading-tight"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-on-surface)' }}
                      >
                        {product.name}
                      </p>
                      <span
                        className="font-bold text-sm flex-shrink-0"
                        style={{ color: 'var(--color-tertiary)', fontFamily: 'var(--font-display)' }}
                      >
                        ${(product.price * quantity).toLocaleString('es-AR')}
                      </span>
                    </div>

                    <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--color-on-surface-variant)' }}>
                      {product.description}
                    </p>

                    {/* Controles */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-0" role="group" aria-label={`Cantidad de ${product.name}`}>
                        <button
                          id={`cart-decrease-${product.id}`}
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          aria-label={`Disminuir cantidad de ${product.name}`}
                          className="w-8 h-8 flex items-center justify-center cursor-pointer transition-colors"
                          style={{
                            border: '1px solid var(--color-primary)',
                            color: 'var(--color-primary)',
                            borderRadius: '4px 0 0 4px',
                            background: 'transparent',
                          }}
                        >
                          <Minus size={12} aria-hidden="true" />
                        </button>
                        <span
                          className="w-10 h-8 flex items-center justify-center text-sm font-bold"
                          style={{
                            borderTop: '1px solid var(--color-primary)',
                            borderBottom: '1px solid var(--color-primary)',
                            color: 'var(--color-on-surface)',
                            fontFamily: 'var(--font-display)',
                          }}
                          aria-live="polite"
                          aria-label={`Cantidad: ${quantity}`}
                        >
                          {quantity}
                        </span>
                        <button
                          id={`cart-increase-${product.id}`}
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          aria-label={`Aumentar cantidad de ${product.name}`}
                          className="w-8 h-8 flex items-center justify-center cursor-pointer transition-colors"
                          style={{
                            border: '1px solid var(--color-primary)',
                            color: 'var(--color-primary)',
                            borderRadius: '0 4px 4px 0',
                            background: 'transparent',
                          }}
                        >
                          <Plus size={12} aria-hidden="true" />
                        </button>
                      </div>

                      <button
                        id={`cart-remove-${product.id}`}
                        onClick={() => removeItem(product.id)}
                        aria-label={`Eliminar ${product.name} del carrito`}
                        className="flex items-center gap-1 text-xs uppercase tracking-wide cursor-pointer transition-opacity hover:opacity-70"
                        style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'var(--font-display)' }}
                      >
                        <Trash2 size={12} aria-hidden="true" />
                        ELIMINAR
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer: entrega + resumen + botón */}
        {items.length > 0 && (
          <div
            className="px-4 py-4"
            style={{ borderTop: '1px solid rgba(255,160,0,0.15)' }}
          >
            {/* ── Método de entrega ── */}
            <div className="mb-4">
              <label
                htmlFor="delivery-method-select"
                className="block text-xs uppercase tracking-wider mb-1.5 font-semibold"
                style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'var(--font-display)' }}
              >
                Método de entrega
              </label>
              <div className="relative">
                <select
                  id="delivery-method-select"
                  value={deliveryMethod}
                  onChange={(e) => setDeliveryMethod(e.target.value as DeliveryMethod)}
                  className="w-full px-3 py-2.5 text-sm appearance-none cursor-pointer outline-none"
                  style={{
                    background: 'var(--color-surface-container-high)',
                    color: 'var(--color-on-surface)',
                    border: '1px solid rgba(255,160,0,0.25)',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  <option value="takeaway">🏪 Retiro en local (Take Away)</option>
                  <option value="delivery">🛵 Envío a domicilio</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: 'var(--color-primary)' }}
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* ── Contenido condicional según método ── */}
            {deliveryMethod === 'takeaway' ? (
              <div
                className="flex items-center gap-2.5 px-3 py-3 mb-4"
                style={{
                  background: 'var(--color-surface-container-high)',
                  borderRadius: '4px',
                  border: '1px solid rgba(255,160,0,0.12)',
                }}
              >
                <MapPin
                  size={18}
                  style={{ color: 'var(--color-primary)', flexShrink: 0 }}
                  aria-hidden="true"
                />
                <div>
                  <p
                    className="text-xs uppercase tracking-wider font-semibold mb-0.5"
                    style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'var(--font-display)' }}
                  >
                    Retirá tu pedido en
                  </p>
                  <p
                    className="text-sm font-bold"
                    style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-display)' }}
                  >
                    Lavaisse 4050
                  </p>
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <label
                  htmlFor="delivery-address-input"
                  className="block text-xs uppercase tracking-wider mb-1.5 font-semibold"
                  style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'var(--font-display)' }}
                >
                  Dirección de envío
                </label>
                <input
                  id="delivery-address-input"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ej: San Martín 1234, piso 2"
                  className="w-full px-3 py-2.5 text-sm outline-none transition-colors"
                  style={{
                    background: 'var(--color-surface-container-high)',
                    color: 'var(--color-on-surface)',
                    border: `1px solid ${deliveryMethod === 'delivery' && !address.trim() ? 'rgba(255,80,80,0.5)' : 'rgba(255,160,0,0.25)'}`,
                    borderRadius: '4px',
                    fontFamily: 'var(--font-body)',
                  }}
                />
                {deliveryMethod === 'delivery' && !address.trim() && (
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,80,80,0.8)' }}>
                    Ingresá tu dirección para continuar
                  </p>
                )}
              </div>
            )}

            {/* Desglose */}
            <div className="flex flex-col gap-1.5 mb-4">
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--color-on-surface-variant)' }}>SUBTOTAL</span>
                <span style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-display)' }}>
                  ${subtotal.toLocaleString('es-AR')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--color-on-surface-variant)' }}>ENVÍO</span>
                <span style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-display)' }}>
                  {deliveryMethod === 'takeaway' ? (
                    <span style={{ color: 'var(--color-primary)' }}>GRATIS</span>
                  ) : (
                    `$${envio.toLocaleString('es-AR')}`
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span
                  className="font-bold uppercase text-sm tracking-wide"
                  style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-display)' }}
                >
                  TOTAL
                </span>
                <span
                  className="text-2xl font-bold"
                  style={{ color: 'var(--color-tertiary)', fontFamily: 'var(--font-display)' }}
                  aria-live="polite"
                >
                  ${total.toLocaleString('es-AR')}
                </span>
              </div>
            </div>

            {/* CTA — HACER PEDIDO */}
            <button
              id="send-whatsapp-order-btn"
              onClick={handleSendOrder}
              disabled={!canOrder}
              className="w-full flex items-center justify-center gap-2 py-4 font-bold uppercase tracking-wider text-base transition-all duration-200 hover:brightness-110 active:scale-[0.99] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                fontFamily: 'var(--font-display)',
                background: 'var(--color-primary)',
                color: 'var(--color-on-primary)',
                borderRadius: '4px',
                letterSpacing: '0.06em',
              }}
            >
              <MessageCircle size={18} aria-hidden="true" />
              HACER PEDIDO
            </button>
          </div>
        )}

        {/* Carrito vacío — botón volver */}
        {items.length === 0 && (
          <div className="px-4 pb-6">
            <button
              onClick={onClose}
              className="w-full py-4 font-bold uppercase tracking-wider text-sm cursor-pointer transition-opacity hover:opacity-80"
              style={{
                fontFamily: 'var(--font-display)',
                background: 'var(--color-primary)',
                color: 'var(--color-on-primary)',
                borderRadius: '4px',
              }}
            >
              VER MENÚ
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
