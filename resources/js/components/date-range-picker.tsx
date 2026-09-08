import React, { useState, useEffect, useRef } from 'react';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    X,
    RotateCcw,
    Check,
} from 'lucide-react';

export interface DateRange {
    startDate: string; // 'YYYY-MM-DD'
    endDate: string;   // 'YYYY-MM-DD'
}

interface DateRangePickerProps {
    startDate?: string;
    endDate?: string;
    onChange?: (range: DateRange) => void;
    onApply?: (range: DateRange) => void;
    placeholder?: string;
    className?: string;
    align?: 'left' | 'right';
}

const MONTH_NAMES = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function parseYMD(str?: string): Date | null {
    if (!str) return null;
    const parts = str.split('-');
    if (parts.length !== 3) return null;
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
    return new Date(y, m, d, 12, 0, 0);
}

function formatYMD(d: Date | null): string {
    if (!d) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function formatDisplay(ymd?: string): string {
    if (!ymd) return '';
    const parts = ymd.split('-');
    if (parts.length !== 3) return ymd;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

export function DateRangePicker({
    startDate = '',
    endDate = '',
    onChange,
    onApply,
    placeholder = 'Pilih rentang tanggal...',
    className = '',
    align = 'left',
}: DateRangePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Internal working state while panel is open
    const [tempStart, setTempStart] = useState<string>(startDate);
    const [tempEnd, setTempEnd] = useState<string>(endDate);
    const [hoverDate, setHoverDate] = useState<string | null>(null);

    // Current displayed month in the calendar
    const initialDate = parseYMD(startDate) || new Date();
    const [viewYear, setViewYear] = useState<number>(initialDate.getFullYear());
    const [viewMonth, setViewMonth] = useState<number>(initialDate.getMonth());

    // Sync when props change externally
    useEffect(() => {
        setTempStart(startDate);
        setTempEnd(endDate);
    }, [startDate, endDate]);

    // Close on click outside or escape key
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const prevMonth = () => {
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear((y) => y - 1);
        } else {
            setViewMonth((m) => m - 1);
        }
    };

    const nextMonth = () => {
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear((y) => y + 1);
        } else {
            setViewMonth((m) => m + 1);
        }
    };

    // Calendar grid calculations
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const handleDateClick = (clickedYMD: string) => {
        if (!tempStart || (tempStart && tempEnd)) {
            // Start fresh selection
            setTempStart(clickedYMD);
            setTempEnd('');
        } else if (tempStart && !tempEnd) {
            // End selection
            if (clickedYMD < tempStart) {
                setTempEnd(tempStart);
                setTempStart(clickedYMD);
            } else {
                setTempEnd(clickedYMD);
            }
        }
    };

    const handleApply = (s = tempStart, e = tempEnd) => {
        const finalStart = s;
        const finalEnd = e || s;
        setTempStart(finalStart);
        setTempEnd(finalEnd);
        onChange?.({ startDate: finalStart, endDate: finalEnd });
        onApply?.({ startDate: finalStart, endDate: finalEnd });
        setIsOpen(false);
    };

    const handleClear = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setTempStart('');
        setTempEnd('');
        onChange?.({ startDate: '', endDate: '' });
        onApply?.({ startDate: '', endDate: '' });
        setIsOpen(false);
    };

    // Quick Presets
    const applyPreset = (presetKey: string) => {
        const today = new Date();
        const todayYMD = formatYMD(today);

        let start = '';
        let end = '';

        if (presetKey === 'today') {
            start = todayYMD;
            end = todayYMD;
        } else if (presetKey === 'yesterday') {
            const y = new Date(today);
            y.setDate(today.getDate() - 1);
            start = formatYMD(y);
            end = start;
        } else if (presetKey === 'last7') {
            const s = new Date(today);
            s.setDate(today.getDate() - 6);
            start = formatYMD(s);
            end = todayYMD;
        } else if (presetKey === 'last30') {
            const s = new Date(today);
            s.setDate(today.getDate() - 29);
            start = formatYMD(s);
            end = todayYMD;
        } else if (presetKey === 'thisMonth') {
            const s = new Date(today.getFullYear(), today.getMonth(), 1);
            start = formatYMD(s);
            end = todayYMD;
        } else if (presetKey === 'lastMonth') {
            const s = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const e = new Date(today.getFullYear(), today.getMonth(), 0);
            start = formatYMD(s);
            end = formatYMD(e);
        } else if (presetKey === 'clear') {
            handleClear();
            return;
        }

        if (start) {
            const pStart = parseYMD(start);
            if (pStart) {
                setViewYear(pStart.getFullYear());
                setViewMonth(pStart.getMonth());
            }
            handleApply(start, end);
        }
    };

    // Check date state in calendar
    const isStartDate = (ymd: string) => ymd === tempStart;
    const isEndDate = (ymd: string) => ymd === tempEnd;
    const isInRange = (ymd: string) => {
        if (tempStart && tempEnd) {
            return ymd > tempStart && ymd < tempEnd;
        }
        if (tempStart && !tempEnd && hoverDate) {
            const min = tempStart < hoverDate ? tempStart : hoverDate;
            const max = tempStart < hoverDate ? hoverDate : tempStart;
            return ymd > min && ymd < max;
        }
        return false;
    };

    const isToday = (ymd: string) => ymd === formatYMD(new Date());

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            {/* Trigger Input-like Button */}
            <div
                role="button"
                tabIndex={0}
                onClick={() => setIsOpen((prev) => !prev)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsOpen((prev) => !prev);
                    }
                }}
                className={`flex items-center justify-between gap-2 h-9 px-3 text-xs bg-white border rounded-md shadow-xs cursor-pointer select-none transition-colors ${
                    isOpen
                        ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-sm'
                        : 'border-input hover:border-gray-400 hover:bg-gray-50/50'
                }`}
            >
                <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap min-w-0">
                    <CalendarIcon className="h-4 w-4 text-blue-600 shrink-0" />
                    {startDate && endDate ? (
                        <span className="font-medium text-gray-800 truncate">
                            {formatDisplay(startDate)} &ndash; {formatDisplay(endDate)}
                        </span>
                    ) : startDate ? (
                        <span className="font-medium text-gray-800 truncate">
                            Dari {formatDisplay(startDate)}
                        </span>
                    ) : (
                        <span className="text-muted-foreground font-normal truncate">{placeholder}</span>
                    )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                    {startDate ? (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-1 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Hapus filter tanggal"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    ) : (
                        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                    )}
                </div>
            </div>

            {/* Dropdown Calendar Panel */}
            {isOpen && (
                <div
                    className={`absolute z-50 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl p-3.5 w-[320px] sm:w-[540px] animate-in fade-in zoom-in-95 duration-150 ${
                        align === 'right' ? 'right-0' : 'left-0 sm:right-auto'
                    }`}
                >
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Sidebar Presets */}
                        <div className="sm:w-36 border-b sm:border-b-0 sm:border-r border-gray-100 pb-3 sm:pb-0 sm:pr-3 flex flex-col gap-1 shrink-0">
                            <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase px-2 mb-1">
                                Shortcut Cepat
                            </span>
                            <button
                                type="button"
                                onClick={() => applyPreset('today')}
                                className="text-left px-2.5 py-1.5 text-xs rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition font-medium cursor-pointer"
                            >
                                Hari Ini
                            </button>
                            <button
                                type="button"
                                onClick={() => applyPreset('yesterday')}
                                className="text-left px-2.5 py-1.5 text-xs rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition font-medium cursor-pointer"
                            >
                                Kemarin
                            </button>
                            <button
                                type="button"
                                onClick={() => applyPreset('last7')}
                                className="text-left px-2.5 py-1.5 text-xs rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition font-medium cursor-pointer"
                            >
                                7 Hari Terakhir
                            </button>
                            <button
                                type="button"
                                onClick={() => applyPreset('last30')}
                                className="text-left px-2.5 py-1.5 text-xs rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition font-medium cursor-pointer"
                            >
                                30 Hari Terakhir
                            </button>
                            <button
                                type="button"
                                onClick={() => applyPreset('thisMonth')}
                                className="text-left px-2.5 py-1.5 text-xs rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition font-medium cursor-pointer"
                            >
                                Bulan Ini
                            </button>
                            <button
                                type="button"
                                onClick={() => applyPreset('lastMonth')}
                                className="text-left px-2.5 py-1.5 text-xs rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition font-medium cursor-pointer"
                            >
                                Bulan Lalu
                            </button>
                            <div className="pt-2 border-t border-gray-100 mt-1">
                                <button
                                    type="button"
                                    onClick={() => applyPreset('clear')}
                                    className="text-left px-2.5 py-1.5 text-xs rounded-md text-red-600 hover:bg-red-50 transition font-medium flex items-center gap-1.5 w-full cursor-pointer"
                                >
                                    <RotateCcw className="h-3 w-3" />
                                    Reset Filter
                                </button>
                            </div>
                        </div>

                        {/* Calendar Grid Area */}
                        <div className="flex-1">
                            {/* Month Header Navigation */}
                            <div className="flex items-center justify-between mb-3 px-1">
                                <button
                                    type="button"
                                    onClick={prevMonth}
                                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition cursor-pointer"
                                    title="Bulan sebelumnya"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <span className="text-xs font-bold text-gray-800">
                                    {MONTH_NAMES[viewMonth]} {viewYear}
                                </span>
                                <button
                                    type="button"
                                    onClick={nextMonth}
                                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition cursor-pointer"
                                    title="Bulan berikutnya"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Days Header */}
                            <div className="grid grid-cols-7 gap-1 text-center mb-1">
                                {DAY_NAMES.map((d, idx) => (
                                    <span
                                        key={d}
                                        className={`text-[11px] font-semibold ${
                                            idx === 0 ? 'text-red-500' : 'text-gray-400'
                                        }`}
                                    >
                                        {d}
                                    </span>
                                ))}
                            </div>

                            {/* Days Grid */}
                            <div
                                className="grid grid-cols-7 gap-y-1 text-center"
                                onMouseLeave={() => setHoverDate(null)}
                            >
                                {/* Prev month days */}
                                {Array.from({ length: firstDayIndex }).map((_, i) => {
                                    const prevDay = daysInPrevMonth - firstDayIndex + 1 + i;
                                    return (
                                        <div
                                            key={`prev-${i}`}
                                            className="h-8 flex items-center justify-center text-xs text-gray-300 select-none cursor-default"
                                        >
                                            {prevDay}
                                        </div>
                                    );
                                })}

                                {/* Current month days */}
                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const day = i + 1;
                                    const dayStr = String(day).padStart(2, '0');
                                    const monthStr = String(viewMonth + 1).padStart(2, '0');
                                    const ymd = `${viewYear}-${monthStr}-${dayStr}`;

                                    const isStart = isStartDate(ymd);
                                    const isEnd = isEndDate(ymd);
                                    const inRange = isInRange(ymd);
                                    const today = isToday(ymd);

                                    return (
                                        <div
                                            key={ymd}
                                            onMouseEnter={() => {
                                                if (tempStart && !tempEnd) {
                                                    setHoverDate(ymd);
                                                }
                                            }}
                                            onClick={() => handleDateClick(ymd)}
                                            className={`h-8 flex items-center justify-center text-xs font-medium cursor-pointer select-none transition-colors relative ${
                                                inRange ? 'bg-blue-50 text-blue-900' : ''
                                            } ${isStart ? 'rounded-l-lg bg-blue-600 text-white font-bold' : ''} ${
                                                isEnd ? 'rounded-r-lg bg-blue-600 text-white font-bold' : ''
                                            } ${
                                                !isStart && !isEnd && !inRange
                                                    ? 'hover:bg-gray-100 text-gray-700 rounded-lg'
                                                    : ''
                                            }`}
                                        >
                                            <span
                                                className={`flex items-center justify-center w-7 h-7 rounded-full ${
                                                    today && !isStart && !isEnd
                                                        ? 'border border-blue-500 font-bold text-blue-600'
                                                        : ''
                                                }`}
                                            >
                                                {day}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-3 mt-3 border-t border-gray-100">
                        <div className="text-[11px] text-gray-500 font-medium text-center sm:text-left">
                            {tempStart && tempEnd ? (
                                <span>
                                    Pilihan: <strong className="text-gray-800">{formatDisplay(tempStart)}</strong> &ndash;{' '}
                                    <strong className="text-gray-800">{formatDisplay(tempEnd)}</strong>
                                </span>
                            ) : tempStart ? (
                                <span>
                                    Mulai: <strong className="text-gray-800">{formatDisplay(tempStart)}</strong> (Pilih tanggal selesai)
                                </span>
                            ) : (
                                <span>Pilih rentang tanggal pada kalender atau klik shortcut</span>
                            )}
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition font-medium cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={() => handleApply()}
                                disabled={!tempStart}
                                className="px-3.5 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-md transition font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
                            >
                                <Check className="h-3.5 w-3.5" />
                                Terapkan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DateRangePicker;
