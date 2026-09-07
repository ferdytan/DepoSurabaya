import * as React from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface OptionItem {
    value: string;
    label: string;
    subLabel?: string;
}

interface SearchableSelectProps {
    options: OptionItem[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    disabled?: boolean;
    showClear?: boolean;
    className?: string;
    emptyMessage?: string;
}

export function SearchableSelect({
    options,
    value,
    onChange,
    placeholder = 'Pilih opsi...',
    searchPlaceholder = 'Cari...',
    disabled = false,
    showClear = true,
    className,
    emptyMessage = 'Tidak ada pilihan ditemukan.',
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [search, setSearch] = React.useState('');
    const containerRef = React.useRef<HTMLDivElement>(null);
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    const selectedOption = React.useMemo(() => {
        return options.find((opt) => opt.value === value);
    }, [options, value]);

    const filteredOptions = React.useMemo(() => {
        if (!search.trim()) return options;
        const q = search.toLowerCase();
        return options.filter(
            (opt) =>
                opt.label.toLowerCase().includes(q) ||
                (opt.subLabel && opt.subLabel.toLowerCase().includes(q)),
        );
    }, [options, search]);

    // Close when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 50);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Close on Escape
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const handleSelect = (val: string) => {
        onChange(val);
        setIsOpen(false);
        setSearch('');
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
        setSearch('');
    };

    return (
        <div ref={containerRef} className={cn('relative w-full', className)}>
            {/* Trigger Box */}
            <div
                role="combobox"
                aria-expanded={isOpen}
                tabIndex={disabled ? -1 : 0}
                onClick={() => {
                    if (!disabled) {
                        setIsOpen(!isOpen);
                        if (!isOpen) setSearch('');
                    }
                }}
                onKeyDown={(e) => {
                    if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        setIsOpen(!isOpen);
                    }
                }}
                className={cn(
                    'flex h-10 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-xs transition-colors',
                    'hover:border-gray-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600',
                    disabled && 'cursor-not-allowed bg-gray-50 text-gray-400 opacity-60 hover:border-gray-300',
                    isOpen && 'border-blue-600 ring-1 ring-blue-600',
                    'cursor-pointer',
                )}
            >
                <div className="flex flex-1 items-center gap-2 overflow-hidden pr-2">
                    {selectedOption ? (
                        <div className="flex items-center gap-2 truncate">
                            <span className="font-medium text-gray-900 truncate">{selectedOption.label}</span>
                            {selectedOption.subLabel && (
                                <span className="text-xs text-gray-500 shrink-0">({selectedOption.subLabel})</span>
                            )}
                        </div>
                    ) : (
                        <span className="text-gray-400 truncate">{placeholder}</span>
                    )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                    {showClear && value && !disabled && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
                            title="Hapus pilihan"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                    <ChevronDown
                        className={cn(
                            'h-4 w-4 text-gray-400 transition-transform duration-200',
                            isOpen && 'rotate-180 text-blue-600',
                        )}
                    />
                </div>
            </div>

            {/* Dropdown Menu */}
            {isOpen && !disabled && (
                <div className="absolute z-50 mt-1.5 max-h-72 w-full min-w-[240px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                    {/* Search Field */}
                    <div className="border-b border-gray-100 p-2 bg-gray-50/70">
                        <div className="relative flex items-center">
                            <Search className="absolute left-2.5 h-4 w-4 text-gray-400" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={searchPlaceholder}
                                className="h-8 w-full rounded-md border border-gray-200 bg-white pl-8 pr-3 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch('')}
                                    className="absolute right-2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Options List */}
                    <div className="max-h-56 overflow-y-auto p-1.5 space-y-0.5">
                        {filteredOptions.length === 0 ? (
                            <div className="py-6 text-center text-xs text-gray-400">
                                {emptyMessage}
                            </div>
                        ) : (
                            filteredOptions.map((opt) => {
                                const isSelected = opt.value === value;
                                return (
                                    <div
                                        key={opt.value}
                                        onClick={() => handleSelect(opt.value)}
                                        className={cn(
                                            'flex items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors cursor-pointer',
                                            isSelected
                                                ? 'bg-blue-50 text-blue-800 font-semibold'
                                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                                        )}
                                    >
                                        <div className="flex flex-col truncate pr-2">
                                            <span className="truncate">{opt.label}</span>
                                            {opt.subLabel && (
                                                <span className="text-[11px] text-gray-400 font-normal">
                                                    {opt.subLabel}
                                                </span>
                                            )}
                                        </div>
                                        {isSelected && (
                                            <Check className="h-4 w-4 text-blue-600 shrink-0" />
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
