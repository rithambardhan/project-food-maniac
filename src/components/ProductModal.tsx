import React, { useState } from 'react';
import { X, Clock, Plus, Minus } from 'lucide-react';
import { MenuItem } from '../data/foodmaniacData';
import { MenuIllustration } from './MenuIllustration';

interface ProductModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToBag: (item: MenuItem, customization: string, qty: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ item, onClose, onAddToBag }) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [qty, setQty] = useState<number>(1);

  if (!item) return null;

  const activeOption = selectedOption && item.customizationOptions.includes(selectedOption)
    ? selectedOption
    : item.customizationOptions[0];

  const handleAdd = () => {
    onAddToBag(item, activeOption, qty);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/55 p-4 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-56 w-full bg-[#F4F4F6]">
          <MenuIllustration type={item.illustrationType} className="h-full w-full object-contain" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close item details"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 transition-colors hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-zinc-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
            <span>{item.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 tabular-nums">
              <Clock className="h-3.5 w-3.5 text-[#FF5A1F]" />
              {item.prepMinutes} min express prep
            </span>
            {item.isSpicy && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-orange-700">Spicy</span>
              </>
            )}
          </div>

          <div className="mt-2 flex items-baseline justify-between gap-4">
            <h3 id="product-modal-title" className="font-display text-2xl font-bold text-zinc-950">
              {item.name}
            </h3>
            <span className="font-mono text-xl font-semibold text-zinc-950 tabular-nums">
              ₹{item.price}
            </span>
          </div>

          <p className="mt-2 text-sm leading-relaxed text-zinc-600">{item.shortDesc}</p>
          <p className="mt-2 rounded-lg bg-zinc-50 px-3 py-2 text-xs text-zinc-600 border border-zinc-200/80">
            Kitchen Speed Note: {item.prepNote}
          </p>

          <div className="mt-5">
            <span className="block text-xs font-semibold uppercase tracking-wide text-zinc-500">
              {item.customizationLabel}
            </span>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {item.customizationOptions.map((opt) => {
                const isSelected = activeOption === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSelectedOption(opt)}
                    className={`min-h-[42px] rounded-lg border px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap truncate ${
                      isSelected
                        ? 'border-zinc-950 bg-zinc-950 text-white'
                        : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4 border-t border-zinc-200 pt-5">
            <div className="flex items-center rounded-lg border border-zinc-200 bg-zinc-50">
              <button
                type="button"
                onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                aria-label="Decrease quantity"
                className="flex h-10 w-10 items-center justify-center text-zinc-700 hover:text-zinc-950"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-mono text-sm font-semibold tabular-nums">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((prev) => Math.min(10, prev + 1))}
                aria-label="Increase quantity"
                className="flex h-10 w-10 items-center justify-center text-zinc-700 hover:text-zinc-950"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="flex-1 min-h-[44px] rounded-lg bg-[#FF5A1F] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#e54b12] whitespace-nowrap"
            >
              Add to Bag · ₹{item.price * qty}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
