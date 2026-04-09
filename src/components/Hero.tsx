import { ChevronDown } from 'lucide-react';
import heroBg from '../assets/logo.png';

interface HeroProps {
  onViewMenu: () => void;
  onOpenCart?: () => void;
}

export function Hero({ onViewMenu }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative flex flex-col items-center justify-center text-center px-4 overflow-hidden"
      style={{
        minHeight: 'calc(100vh - 56px)',
        backgroundColor: '#000',
      }}
      aria-label="Hero principal"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          opacity: 0.6,
        }}
      />

      {/* Ambient glow / Dark gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-sm mx-auto" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
        {/* Logo / eyebrow */}
        <p
          className="text-xs uppercase tracking-[0.2em] font-bold mb-6"
          style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}
        >
          APOCALIPSIS
        </p>

        {/* Headline */}
        <h1
          className="font-bold uppercase leading-none mb-4"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.8rem, 10vw, 5rem)',
            color: 'var(--color-on-surface)',
            letterSpacing: '-0.03em',
          }}
        >
          DATE UN{' '}
          <span style={{ color: 'var(--color-primary)' }}>GUSTITO</span>
        </h1>

        {/* Subtítulo */}
        <p
          className="text-sm mb-8 leading-relaxed"
          style={{ color: 'var(--color-on-surface-variant)', maxWidth: '280px', margin: '0 auto 2rem' }}
        >
          Hamburguesas premium para los que no le escapan al sabor infernal.
        </p>

        {/* CTA */}
        <button
          id="hero-view-menu-btn"
          onClick={onViewMenu}
          className="px-8 py-3.5 font-bold uppercase tracking-wider text-sm transition-all duration-150 hover:brightness-110 active:scale-[0.98] cursor-pointer"
          style={{
            fontFamily: 'var(--font-display)',
            background: 'var(--color-primary)',
            color: 'var(--color-on-primary)',
            borderRadius: '4px',
            letterSpacing: '0.08em',
          }}
        >
          VER MENÚ
        </button>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40"
        aria-hidden="true"
      >
        <ChevronDown size={20} className="animate-bounce" style={{ color: 'var(--color-primary)' }} />
      </div>
    </section>
  );
}
