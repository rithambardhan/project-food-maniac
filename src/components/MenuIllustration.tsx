import React from 'react';
import { MenuItem } from '../data/foodmaniacData';

interface MenuIllustrationProps {
  type: MenuItem['illustrationType'];
  className?: string;
}

export const MenuIllustration: React.FC<MenuIllustrationProps> = ({ type, className = '' }) => {
  switch (type) {
    case 'peri_fries':
      return (
        <svg viewBox="0 0 240 180" className={className} role="img" aria-label="Flash Peri-Peri Loaded Fries illustration">
          <rect width="240" height="180" fill="#F4F4F6" />
          <ellipse cx="120" cy="148" rx="64" ry="12" fill="#E4E4E7" />
          {/* Fries Sticks */}
          <g stroke="#B45309" strokeWidth="1.5">
            <rect x="78" y="42" width="12" height="70" rx="4" transform="rotate(-12 84 77)" fill="#FBBF24" />
            <rect x="94" y="32" width="12" height="75" rx="4" transform="rotate(-4 100 69)" fill="#F59E0B" />
            <rect x="112" y="28" width="13" height="78" rx="4" fill="#FCD34D" />
            <rect x="130" y="34" width="12" height="74" rx="4" transform="rotate(6 136 71)" fill="#FBBF24" />
            <rect x="146" y="44" width="12" height="68" rx="4" transform="rotate(14 152 78)" fill="#F59E0B" />
          </g>
          {/* Peri-Peri Dust */}
          <circle cx="96" cy="52" r="2" fill="#EA580C" />
          <circle cx="118" cy="44" r="2.2" fill="#DC2626" />
          <circle cx="137" cy="55" r="1.8" fill="#EA580C" />
          <circle cx="105" cy="64" r="1.6" fill="#DC2626" />
          {/* Striped Street Carton */}
          <path d="M72 88 L168 88 L156 144 C155 148 151 150 147 150 L93 150 C89 150 85 148 84 144 Z" fill="#FF5A1F" stroke="#18181B" strokeWidth="2.5" />
          <path d="M75 94 Q120 104 165 94 L163 105 Q120 115 77 105 Z" fill="#FFFFFF" opacity="0.92" />
          <rect x="102" y="114" width="36" height="22" rx="4" fill="#18181B" />
          <text x="120" y="129" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="700" fontFamily="monospace">PERI</text>
        </svg>
      );

    case 'paneer_wrap':
      return (
        <svg viewBox="0 0 240 180" className={className} role="img" aria-label="Tikka Crunch Pocket Wrap illustration">
          <rect width="240" height="180" fill="#F4F4F6" />
          <ellipse cx="120" cy="146" rx="68" ry="12" fill="#E4E4E7" />
          {/* Tortilla Wrap */}
          <g transform="rotate(-14 120 96)">
            <path d="M68 58 C95 42 145 42 172 58 L160 132 C158 142 82 142 80 132 Z" fill="#FDE68A" stroke="#18181B" strokeWidth="2.5" />
            {/* Grill Marks */}
            <line x1="88" y1="68" x2="148" y2="82" stroke="#D97706" strokeWidth="3" strokeLinecap="round" opacity="0.65" />
            <line x1="86" y1="86" x2="146" y2="100" stroke="#D97706" strokeWidth="3" strokeLinecap="round" opacity="0.65" />
            {/* Filling peek */}
            <circle cx="96" cy="54" r="10" fill="#EA580C" stroke="#18181B" strokeWidth="2" />
            <circle cx="118" cy="49" r="11" fill="#10B981" stroke="#18181B" strokeWidth="2" />
            <circle cx="140" cy="55" r="9" fill="#F59E0B" stroke="#18181B" strokeWidth="2" />
            {/* Paper Sleeve */}
            <path d="M76 92 L164 92 L156 138 C154 146 86 146 84 138 Z" fill="#18181B" />
            <rect x="96" y="106" width="48" height="18" rx="3" fill="#FF5A1F" />
            <text x="120" y="118.5" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="700" fontFamily="monospace">TIKKA</text>
          </g>
        </svg>
      );

    case 'crispy_sliders':
      return (
        <svg viewBox="0 0 240 180" className={className} role="img" aria-label="Double Crunch Herb Sliders illustration">
          <rect width="240" height="180" fill="#F4F4F6" />
          <ellipse cx="120" cy="144" rx="78" ry="12" fill="#E4E4E7" />
          {/* Left Slider */}
          <g transform="translate(46, 52)">
            <path d="M12 36 C12 16 64 16 64 36 Z" fill="#F59E0B" stroke="#18181B" strokeWidth="2.5" />
            <circle cx="28" cy="24" r="1.5" fill="#FEF3C7" />
            <circle cx="38" cy="21" r="1.5" fill="#FEF3C7" />
            <circle cx="48" cy="25" r="1.5" fill="#FEF3C7" />
            <path d="M10 38 Q22 44 38 38 Q54 44 66 38" fill="none" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
            <polygon points="14,43 62,43 56,52 22,48" fill="#FCD34D" stroke="#18181B" strokeWidth="1.5" />
            <rect x="12" y="49" width="52" height="12" rx="5" fill="#92400E" stroke="#18181B" strokeWidth="2.5" />
            <path d="M14 62 L62 62 C62 72 14 72 14 62 Z" fill="#FBBF24" stroke="#18181B" strokeWidth="2.5" />
          </g>
          {/* Right Slider */}
          <g transform="translate(118, 60)">
            <path d="M12 36 C12 16 64 16 64 36 Z" fill="#F59E0B" stroke="#18181B" strokeWidth="2.5" />
            <circle cx="28" cy="24" r="1.5" fill="#FEF3C7" />
            <circle cx="40" cy="22" r="1.5" fill="#FEF3C7" />
            <path d="M10 38 Q22 44 38 38 Q54 44 66 38" fill="none" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
            <polygon points="14,43 62,43 54,53 20,49" fill="#FCD34D" stroke="#18181B" strokeWidth="1.5" />
            <rect x="12" y="49" width="52" height="12" rx="5" fill="#92400E" stroke="#18181B" strokeWidth="2.5" />
            <path d="M14 62 L62 62 C62 72 14 72 14 62 Z" fill="#FBBF24" stroke="#18181B" strokeWidth="2.5" />
          </g>
        </svg>
      );

    case 'cheese_nuggets':
      return (
        <svg viewBox="0 0 240 180" className={className} role="img" aria-label="Jalapeno Cheese Poppers illustration">
          <rect width="240" height="180" fill="#F4F4F6" />
          <ellipse cx="120" cy="146" rx="72" ry="12" fill="#E4E4E7" />
          {/* Serving Tray */}
          <rect x="54" y="102" width="132" height="34" rx="10" fill="#18181B" />
          {/* Golden Poppers */}
          <g stroke="#18181B" strokeWidth="2.2">
            <rect x="68" y="64" width="38" height="32" rx="12" fill="#F59E0B" transform="rotate(-8 87 80)" />
            <rect x="102" y="54" width="40" height="34" rx="12" fill="#FBBF24" />
            <rect x="136" y="66" width="38" height="32" rx="12" fill="#F59E0B" transform="rotate(10 155 82)" />
            <rect x="82" y="82" width="42" height="30" rx="11" fill="#FCD34D" />
            <rect x="120" y="84" width="40" height="30" rx="11" fill="#FBBF24" />
          </g>
          {/* Jalapeno Flecks */}
          <circle cx="114" cy="70" r="2.5" fill="#059669" />
          <circle cx="130" cy="75" r="2" fill="#059669" />
          <circle cx="100" cy="94" r="2.5" fill="#059669" />
          {/* Dip Cup */}
          <path d="M164 104 L196 104 L190 132 L170 132 Z" fill="#FF5A1F" stroke="#18181B" strokeWidth="2" />
          <ellipse cx="180" cy="104" rx="16" ry="5" fill="#FFFFFF" stroke="#18181B" strokeWidth="2" />
        </svg>
      );

    case 'blue_lagoon':
      return (
        <svg viewBox="0 0 240 180" className={className} role="img" aria-label="Electric Blue Lagoon Fizz illustration">
          <rect width="240" height="180" fill="#F4F4F6" />
          <ellipse cx="120" cy="150" rx="44" ry="10" fill="#E4E4E7" />
          {/* Straw */}
          <path d="M134 26 L124 84" stroke="#FF5A1F" strokeWidth="5" strokeLinecap="round" />
          <path d="M134 26 L152 22" stroke="#FF5A1F" strokeWidth="5" strokeLinecap="round" />
          {/* Tall Glass */}
          <path d="M88 46 L152 46 L142 146 C141 149 138 150 135 150 L105 150 C102 150 99 149 98 146 Z" fill="#E0F2FE" stroke="#18181B" strokeWidth="2.5" />
          {/* Blue Lagoon Gradient Fill */}
          <path d="M91 66 L149 66 L141 144 L99 144 Z" fill="#0284C7" opacity="0.88" />
          <path d="M93 84 L147 84 L141 144 L99 144 Z" fill="#0369A1" opacity="0.55" />
          {/* Ice Cubes */}
          <rect x="102" y="72" width="16" height="16" rx="3" fill="#BAE6FD" opacity="0.85" transform="rotate(14 110 80)" />
          <rect x="122" y="82" width="15" height="15" rx="3" fill="#E0F2FE" opacity="0.85" transform="rotate(-12 129 89)" />
          {/* Lime Wheel */}
          <circle cx="88" cy="48" r="14" fill="#10B981" stroke="#18181B" strokeWidth="2" />
          <circle cx="88" cy="48" r="10" fill="#A7F3D0" />
          {/* Bubbles */}
          <circle cx="112" cy="122" r="2.5" fill="#FFFFFF" opacity="0.85" />
          <circle cx="128" cy="112" r="2" fill="#FFFFFF" opacity="0.85" />
          <circle cx="118" cy="100" r="3" fill="#FFFFFF" opacity="0.7" />
        </svg>
      );

    case 'mango_chili':
      return (
        <svg viewBox="0 0 240 180" className={className} role="img" aria-label="Alphonso Mango Chili Cooler illustration">
          <rect width="240" height="180" fill="#F4F4F6" />
          <ellipse cx="120" cy="150" rx="44" ry="10" fill="#E4E4E7" />
          <path d="M132 24 L124 80" stroke="#18181B" strokeWidth="5" strokeLinecap="round" />
          <path d="M88 48 L152 48 L142 146 C141 149 138 150 135 150 L105 150 C102 150 99 149 98 146 Z" fill="#FEF3C7" stroke="#18181B" strokeWidth="2.5" />
          <path d="M91 66 L149 66 L141 144 L99 144 Z" fill="#F59E0B" />
          {/* Chili Salt Rim */}
          <line x1="87" y1="48" x2="153" y2="48" stroke="#DC2626" strokeWidth="4.5" strokeLinecap="round" />
          {/* Chili Garnish */}
          <path d="M144 40 Q162 28 164 52 Q156 58 144 40 Z" fill="#DC2626" stroke="#18181B" strokeWidth="1.8" />
          <rect x="104" y="76" width="16" height="16" rx="3" fill="#FDE68A" opacity="0.85" transform="rotate(-10 112 84)" />
          <rect x="122" y="92" width="14" height="14" rx="3" fill="#FDE68A" opacity="0.8" transform="rotate(15 129 99)" />
        </svg>
      );

    case 'mint_mojito':
      return (
        <svg viewBox="0 0 240 180" className={className} role="img" aria-label="Campus Mint Ginger Mojito illustration">
          <rect width="240" height="180" fill="#F4F4F6" />
          <ellipse cx="120" cy="150" rx="44" ry="10" fill="#E4E4E7" />
          <path d="M136 24 L126 84" stroke="#059669" strokeWidth="5" strokeLinecap="round" />
          <path d="M88 46 L152 46 L142 146 C141 149 138 150 135 150 L105 150 C102 150 99 149 98 146 Z" fill="#ECFDF5" stroke="#18181B" strokeWidth="2.5" />
          <path d="M91 68 L149 68 L141 144 L99 144 Z" fill="#34D399" opacity="0.7" />
          {/* Mint Leaves */}
          <ellipse cx="110" cy="90" rx="10" ry="6" transform="rotate(-30 110 90)" fill="#059669" stroke="#18181B" strokeWidth="1.5" />
          <ellipse cx="128" cy="108" rx="10" ry="6" transform="rotate(24 128 108)" fill="#047857" stroke="#18181B" strokeWidth="1.5" />
          <ellipse cx="106" cy="54" rx="11" ry="6" transform="rotate(-20 106 54)" fill="#10B981" stroke="#18181B" strokeWidth="1.5" />
          <circle cx="118" cy="126" r="2.5" fill="#FFFFFF" />
          <circle cx="132" cy="84" r="2" fill="#FFFFFF" />
        </svg>
      );

    case 'berry_fizz':
      return (
        <svg viewBox="0 0 240 180" className={className} role="img" aria-label="Wild Berry Hibiscus Spritz illustration">
          <rect width="240" height="180" fill="#F4F4F6" />
          <ellipse cx="120" cy="150" rx="44" ry="10" fill="#E4E4E7" />
          <path d="M134 26 L124 84" stroke="#18181B" strokeWidth="5" strokeLinecap="round" />
          <path d="M88 46 L152 46 L142 146 C141 149 138 150 135 150 L105 150 C102 150 99 149 98 146 Z" fill="#FFE4E6" stroke="#18181B" strokeWidth="2.5" />
          <path d="M91 66 L149 66 L141 144 L99 144 Z" fill="#E11D48" opacity="0.85" />
          <circle cx="110" cy="88" r="7" fill="#881337" />
          <circle cx="126" cy="102" r="6" fill="#9F1239" />
          <circle cx="114" cy="118" r="7" fill="#881337" />
          <circle cx="148" cy="48" r="12" fill="#FBBF24" stroke="#18181B" strokeWidth="2" />
        </svg>
      );

    case 'solo_combo':
      return (
        <svg viewBox="0 0 240 180" className={className} role="img" aria-label="Lecture Break Solo Box illustration">
          <rect width="240" height="180" fill="#F4F4F6" />
          <ellipse cx="120" cy="148" rx="84" ry="12" fill="#E4E4E7" />
          {/* Box Base */}
          <rect x="44" y="106" width="152" height="36" rx="8" fill="#18181B" />
          {/* Mini Fries */}
          <g transform="translate(48, 36) scale(0.6)">
            <rect x="20" y="20" width="14" height="70" rx="4" fill="#FBBF24" stroke="#18181B" strokeWidth="2" />
            <rect x="38" y="12" width="14" height="74" rx="4" fill="#F59E0B" stroke="#18181B" strokeWidth="2" />
            <rect x="56" y="22" width="14" height="70" rx="4" fill="#FCD34D" stroke="#18181B" strokeWidth="2" />
            <path d="M12 64 L78 64 L70 118 L20 118 Z" fill="#FF5A1F" stroke="#18181B" strokeWidth="3" />
          </g>
          {/* Mini Wrap */}
          <g transform="translate(102, 54)">
            <path d="M6 12 C20 2 44 2 56 12 L48 58 L14 58 Z" fill="#FDE68A" stroke="#18181B" strokeWidth="2.2" />
            <rect x="12" y="34" width="38" height="22" rx="4" fill="#FF5A1F" />
          </g>
          {/* Mini Mocktail */}
          <g transform="translate(154, 42)">
            <path d="M8 10 L42 10 L36 68 L14 68 Z" fill="#0284C7" stroke="#18181B" strokeWidth="2.2" />
            <path d="M30 0 L24 28" stroke="#FF5A1F" strokeWidth="3.5" strokeLinecap="round" />
          </g>
          <text x="120" y="129" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="700" fontFamily="monospace">SOLO EXPRESS BOX</text>
        </svg>
      );

    case 'squad_box':
    default:
      return (
        <svg viewBox="0 0 240 180" className={className} role="img" aria-label="4-Player Hangout Platter illustration">
          <rect width="240" height="180" fill="#F4F4F6" />
          <ellipse cx="120" cy="148" rx="92" ry="12" fill="#E4E4E7" />
          <rect x="34" y="102" width="172" height="40" rx="10" fill="#FF5A1F" stroke="#18181B" strokeWidth="2.5" />
          {/* Two Sliders */}
          <path d="M46 78 C46 60 88 60 88 78 Z" fill="#F59E0B" stroke="#18181B" strokeWidth="2" />
          <rect x="46" y="78" width="42" height="14" rx="4" fill="#92400E" stroke="#18181B" strokeWidth="2" />
          <path d="M96 78 C96 60 138 60 138 78 Z" fill="#F59E0B" stroke="#18181B" strokeWidth="2" />
          <rect x="96" y="78" width="42" height="14" rx="4" fill="#92400E" stroke="#18181B" strokeWidth="2" />
          {/* Two Drinks */}
          <path d="M148 48 L174 48 L170 96 L152 96 Z" fill="#0284C7" stroke="#18181B" strokeWidth="2" />
          <path d="M178 48 L204 48 L200 96 L182 96 Z" fill="#10B981" stroke="#18181B" strokeWidth="2" />
          <rect x="64" y="114" width="112" height="18" rx="4" fill="#18181B" />
          <text x="120" y="126.5" textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontWeight="700" fontFamily="monospace">4-PLAYER PLATTER</text>
        </svg>
      );
  }
};
