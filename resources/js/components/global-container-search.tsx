import React, { useState, useEffect, useRef, useCallback } from 'react';
import { router } from '@inertiajs/react';
import { Search, X, Loader2, Package, Building2, Calendar, ArrowRight, ExternalLink, AlertCircle, Boxes } from 'lucide-react';

interface ContainerSearchResult {
    id: number;
    container_number: string;
    size: string;
    customer_name: string;
    shipper_name: string;
    order_id: string;
    order_pk: number;
    commodity: string;
    status: 'In Yard' | 'Gate Out' | 'Belum Masuk';
    status_color: 'emerald' | 'purple' | 'amber';
    entry_date: string;
    exit_date: string | null;
    url: string;
    order_url: string;
}

export function GlobalContainerSearch() {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<ContainerSearchResult[]>([]);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [shake, setShake] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Global keyboard shortcut: Ctrl+K or Cmd+K to focus search anywhere
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
                if (query.trim().length >= 2) {
                    setIsOpen(true);
                }
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [query]);

    // Click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setActiveIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounced search fetch
    const fetchContainers = useCallback((searchQuery: string) => {
        const q = searchQuery.trim();
        if (q.length < 2) {
            setResults([]);
            setIsLoading(false);
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        setIsOpen(true);

        fetch(`/orders/quick-search?q=${encodeURIComponent(q)}`, {
            headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error('Search failed');
                return res.json();
            })
            .then((data) => {
                setResults(data.containers || []);
                setIsLoading(false);
                setActiveIndex(-1);
            })
            .catch(() => {
                setResults([]);
                setIsLoading(false);
            });
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        if (val.trim().length >= 2) {
            setIsLoading(true);
            setIsOpen(true);
            debounceTimeoutRef.current = setTimeout(() => {
                fetchContainers(val);
            }, 250);
        } else {
            setResults([]);
            setIsLoading(false);
            setIsOpen(false);
        }
    };

    const handleClear = () => {
        setQuery('');
        setResults([]);
        setIsOpen(false);
        setActiveIndex(-1);
        inputRef.current?.focus();
    };

    const handleSelect = (item: ContainerSearchResult) => {
        setIsOpen(false);
        setActiveIndex(-1);
        router.visit(item.url);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen) {
            if (e.key === 'ArrowDown' && query.trim().length >= 2) {
                setIsOpen(true);
                return;
            }
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (results.length > 0) {
                setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (results.length > 0) {
                setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();

            // Jika ada hasil pencarian:
            if (results.length > 0) {
                const targetItem = activeIndex >= 0 && results[activeIndex] ? results[activeIndex] : results[0];
                if (targetItem) {
                    handleSelect(targetItem);
                }
            } else {
                // Sesuai permintaan user: JIKA TIDAK ADA HASIL, TIDAK BISA DI-ENTER (agar tidak 404)
                setShake(true);
                setTimeout(() => setShake(false), 500);
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
            setActiveIndex(-1);
            inputRef.current?.blur();
        }
    };

    const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

    return (
        <div ref={containerRef} className="relative z-30">
            {/* Search Input Bar */}
            <div
                className={`relative flex items-center transition-all duration-200 ${
                    shake ? 'animate-shake' : ''
                }`}
            >
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => {
                        if (query.trim().length >= 2) setIsOpen(true);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Cari kontainer..."
                    className="h-8.5 w-44 sm:w-60 md:w-72 lg:w-80 rounded-lg border border-gray-200 bg-gray-50/80 pl-8 pr-16 text-xs text-gray-900 placeholder:text-gray-400 shadow-2xs transition-all focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                />

                {/* Right controls: clear or keyboard shortcut badge */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {isLoading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />
                    ) : query ? (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-0.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-200/60 transition"
                            title="Hapus pencarian"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    ) : (
                        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded">
                            {isMac ? '⌘K' : 'Ctrl+K'}
                        </kbd>
                    )}
                </div>
            </div>

            {/* Dropdown Autocomplete Panel */}
            {isOpen && query.trim().length >= 2 && (
                <div className="absolute right-0 top-full mt-2 w-[340px] sm:w-[420px] md:w-[460px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                    {/* Header */}
                    <div className="flex items-center justify-between px-3.5 py-2 bg-gray-50/80 border-b border-gray-100 text-[11px] text-gray-500 font-medium">
                        <span className="flex items-center gap-1.5">
                            <Package className="h-3.5 w-3.5 text-blue-600" />
                            Hasil Pencarian Kontainer
                        </span>
                        {results.length > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px]">
                                {results.length} ditemukan
                            </span>
                        )}
                    </div>

                    {/* Results List or Empty State */}
                    <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-100">
                        {isLoading && results.length === 0 ? (
                            <div className="flex items-center justify-center py-8 text-xs text-gray-400 gap-2">
                                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                <span>Mencari kontainer "{query}"...</span>
                            </div>
                        ) : results.length > 0 ? (
                            results.map((item, idx) => {
                                const isActive = activeIndex === idx;

                                return (
                                    <div
                                        key={item.id}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => handleSelect(item)}
                                        onMouseEnter={() => setActiveIndex(idx)}
                                        className={`w-full text-left p-3 transition-colors cursor-pointer flex items-start justify-between gap-3 ${
                                            isActive
                                                ? 'bg-blue-50/80 text-blue-950'
                                                : 'hover:bg-gray-50/80 text-gray-800'
                                        }`}
                                    >
                                        <div className="space-y-1 min-w-0 flex-1">
                                            {/* Container Number & Badges */}
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-mono text-xs font-bold text-gray-900 tracking-wide">
                                                    {item.container_number}
                                                </span>
                                                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-gray-100 text-gray-700 rounded border border-gray-200">
                                                    {item.size}
                                                </span>

                                                {/* Status Pill */}
                                                {item.status === 'In Yard' && (
                                                    <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                        In Yard
                                                    </span>
                                                )}
                                                {item.status === 'Gate Out' && (
                                                    <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                                                        Gate Out
                                                    </span>
                                                )}
                                                {item.status === 'Belum Masuk' && (
                                                    <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                                        Belum Masuk
                                                    </span>
                                                )}
                                            </div>

                                            {/* Customer & Order ID */}
                                            <div className="flex items-center gap-2 text-[11px] text-gray-500 truncate">
                                                <span className="flex items-center gap-1 truncate font-medium text-gray-700">
                                                    <Building2 className="h-3 w-3 shrink-0 text-gray-400" />
                                                    {item.customer_name}
                                                </span>
                                                <span className="text-gray-300">•</span>
                                                <span className="font-mono text-[10px] text-gray-400">
                                                    #{item.order_id}
                                                </span>
                                            </div>

                                            {/* Entry & Exit Date */}
                                            <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-2.5 w-2.5" />
                                                    Masuk: {item.entry_date}
                                                </span>
                                                {item.exit_date && (
                                                    <>
                                                        <span>|</span>
                                                        <span>Keluar: {item.exit_date}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Icon */}
                                        <div className="shrink-0 self-center">
                                            <span
                                                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                                                    isActive
                                                        ? 'bg-blue-600 text-white shadow-xs'
                                                        : 'text-gray-400 bg-gray-100'
                                                }`}
                                            >
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            /* Empty State - Sesuai kekhawatiran user (tidak 404, dan tidak bisa enter) */
                            <div className="py-8 px-4 text-center space-y-2">
                                <div className="inline-flex p-2.5 bg-gray-100 rounded-full text-gray-400">
                                    <Boxes className="h-6 w-6" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xs font-bold text-gray-800">
                                        Tidak ada kontainer ditemukan
                                    </p>
                                    <p className="text-[11px] text-gray-500 max-w-xs mx-auto">
                                        Nomor kontainer <span className="font-mono font-semibold text-gray-700">"{query}"</span> tidak terdaftar dalam sistem.
                                    </p>
                                </div>
                                <div className="pt-2">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-medium">
                                        <AlertCircle className="h-3 w-3" />
                                        Tombol Enter dinonaktifkan (mencegah error 404)
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Info / Fallback to Order List */}
                    <div className="p-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px]">
                        <span className="text-gray-400 text-[10px]">
                            Gunakan <kbd className="px-1 py-0.2 rounded bg-white border border-gray-200 font-mono">↑</kbd> <kbd className="px-1 py-0.2 rounded bg-white border border-gray-200 font-mono">↓</kbd> lalu <kbd className="px-1 py-0.2 rounded bg-white border border-gray-200 font-mono">↵</kbd>
                        </span>
                        <a
                            href={`/orders?search=${encodeURIComponent(query)}`}
                            className="font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 text-[11px]"
                            onClick={() => setIsOpen(false)}
                        >
                            Daftar Order Penuh
                            <ExternalLink className="h-3 w-3" />
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GlobalContainerSearch;
