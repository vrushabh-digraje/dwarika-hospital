import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, X, Check } from 'lucide-react';
import { ICD11_DISEASES, type ICD11Disease } from '../data/icd11Data';

interface ICD11SearchSelectProps {
  value: string;
  onChange: (value: string) => void;
  onEnterAdd?: () => void;
  placeholder?: string;
  className?: string;
}

export function ICD11SearchSelect({
  value,
  onChange,
  onEnterAdd,
  placeholder = 'Select Disease...',
  className = '',
}: ICD11SearchSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close when clicked outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Reset highlightedIndex when search term changes
  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchTerm]);

  const hasTyped = searchTerm.trim().length > 0;

  // Filter diseases by code or name ONLY when user has started typing!
  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return []; // Only show suggestions when user starts typing

    const matches: ICD11Disease[] = [];
    for (const d of ICD11_DISEASES) {
      if (
        d.code.toLowerCase().includes(q) ||
        d.name.toLowerCase().includes(q)
      ) {
        matches.push(d);
        if (matches.length >= 80) break; // Limit to 80 for silky smooth rendering
      }
    }
    return matches;
  }, [searchTerm]);

  const totalMatchesCount = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return 0;
    return ICD11_DISEASES.filter(
      (d) => d.code.toLowerCase().includes(q) || d.name.toLowerCase().includes(q)
    ).length;
  }, [searchTerm]);

  const handleSelect = (disease: ICD11Disease) => {
    onChange(disease.display);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleCustomSelect = () => {
    if (searchTerm.trim()) {
      onChange(searchTerm.trim());
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filtered.length > 0) {
        setHighlightedIndex((prev) => (prev + 1) % filtered.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filtered.length > 0) {
        setHighlightedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered.length > 0 && highlightedIndex >= 0 && highlightedIndex < filtered.length) {
        handleSelect(filtered[highlightedIndex]);
        if (onEnterAdd) onEnterAdd();
      } else if (searchTerm.trim()) {
        handleCustomSelect();
        if (onEnterAdd) onEnterAdd();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Trigger / Input */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium cursor-pointer hover:border-blue-900 transition-colors shadow-2xs select-none"
      >
        <span className={value ? 'text-slate-900 font-semibold truncate' : 'text-slate-400 truncate'}>
          {value || placeholder}
        </span>
        <div className="flex items-center gap-1 shrink-0 ml-1.5 text-slate-400">
          {value && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              className="p-0.5 hover:text-slate-600 rounded cursor-pointer"
              title="Clear selection"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-blue-900' : ''
            }`}
          />
        </div>
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute left-0 z-50 mt-1 max-h-80 w-full min-w-[280px] max-w-[calc(100vw-32px)] sm:w-[420px] rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col">
          {/* Search Header */}
          <div className="p-2 border-b border-slate-100 bg-slate-50 sticky top-0 z-10 space-y-1.5">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search disease name or ICD-11 code (e.g. Typhoid, 1A01)..."
                className="w-full rounded-lg border border-slate-200 bg-white pl-8 pr-7 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                  title="Clear"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {hasTyped && (
              <div className="flex items-center justify-between text-[10px] text-slate-500 px-1 font-medium">
                <span>
                  Found <strong>{totalMatchesCount}</strong> matching disease{totalMatchesCount === 1 ? '' : 's'}
                </span>
                {!filtered.some((d) => d.display.toLowerCase() === searchTerm.trim().toLowerCase()) && (
                  <button
                    type="button"
                    onClick={handleCustomSelect}
                    className="text-blue-700 hover:underline font-bold cursor-pointer"
                  >
                    Use custom &quot;{searchTerm.trim().slice(0, 15)}...&quot;
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Diseases Suggestions List */}
          <div className="overflow-y-auto flex-1 divide-y divide-slate-100 max-h-60">
            {!hasTyped ? (
              <div className="p-5 text-center text-slate-400 space-y-2">
                <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-900 flex items-center justify-center mx-auto border border-blue-100">
                  <Search className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-slate-700">Start typing to see suggestions</p>
                <p className="text-[11px] text-slate-400 leading-normal max-w-[280px] mx-auto">
                  Type a disease name or ICD-11 code (e.g.{' '}
                  <span
                    className="font-bold text-blue-700 cursor-pointer hover:underline"
                    onClick={() => setSearchTerm('Typhoid')}
                  >
                    Typhoid
                  </span>
                  ,{' '}
                  <span
                    className="font-bold text-blue-700 cursor-pointer hover:underline"
                    onClick={() => setSearchTerm('Malaria')}
                  >
                    Malaria
                  </span>
                  ,{' '}
                  <span
                    className="font-bold text-blue-700 cursor-pointer hover:underline"
                    onClick={() => setSearchTerm('Diabetes')}
                  >
                    Diabetes
                  </span>
                  ,{' '}
                  <span
                    className="font-bold text-blue-700 cursor-pointer hover:underline"
                    onClick={() => setSearchTerm('1A01')}
                  >
                    1A01
                  </span>
                  )...
                </p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-6 text-center text-slate-500 space-y-1.5">
                <p className="text-xs font-semibold">No disease matching &quot;{searchTerm}&quot;</p>
                <p className="text-[10px] text-slate-400">You can still use this as a custom diagnosis:</p>
                <button
                  type="button"
                  onClick={handleCustomSelect}
                  className="mt-1 px-3 py-1 bg-blue-50 text-blue-900 hover:bg-blue-100 rounded-lg text-xs font-bold transition border border-blue-200 cursor-pointer"
                >
                  Use &quot;{searchTerm.trim()}&quot;
                </button>
              </div>
            ) : (
              filtered.map((d, index) => {
                const isSelected = value === d.display;
                const isHighlighted = highlightedIndex === index;
                return (
                  <button
                    key={d.code + d.name}
                    type="button"
                    onClick={() => handleSelect(d)}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between gap-2.5 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/80 text-blue-900 font-semibold'
                        : isHighlighted
                        ? 'bg-slate-100 text-slate-900'
                        : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-blue-900 font-mono font-bold text-[10px] shrink-0 border border-slate-200">
                        {d.code}
                      </span>
                      <span className="text-xs truncate font-medium">{d.name}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-900 shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
