import React, { useState, useEffect, useRef } from 'react';
import {
    Calendar as CalendarIcon,
    Clock,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    X,
    Check,
    RotateCcw,
} from 'lucide-react';

interface DateTimePickerProps {
    value?: string; // 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:mm' or 'YYYY-MM-DD HH:mm:ss'
    onChange: (val: string) => void;
    withTime?: boolean;
    placeholder?: string;
    className?: string;
    id?: string;
    disabled?: boolean;
    align?: 'left' | 'right';
}

const MONTH_NAMES = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function getNowLocalTime(): string {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

function parseValue(val?: string, withTime = true) {
    const defaultTime = getNowLocalTime();
    if (!val) return { date: '', time: defaultTime };
    const cleaned = val.replace(' ', 'T');
    const parts = cleaned.split('T');
    const date = parts[0] || '';
    let time = defaultTime;
    if (withTime && parts[1]) {
        time = parts[1].substring(0, 5);
        if (!time.includes(':')) time = defaultTime;
    }
    return { date, time };
}

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

function formatYMD(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function formatDisplay(val?: string, withTime = true): string {
    if (!val) return '';
    const { date, time } = parseValue(val, withTime);
    if (!date) return '';
    const parts = date.split('-');
    if (parts.length !== 3) return val;
    const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
    if (withTime && time) {
        return `${formattedDate}, ${time}`;
    }
    return formattedDate;
}

export function DateTimePicker({
    value = '',
    onChange,
    withTime = true,
    placeholder,
    className = '',
    id,
    disabled = false,
    align = 'left',
}: DateTimePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const initial = parseValue(value, withTime);
    const [selectedDate, setSelectedDate] = useState<string>(initial.date);
    const [selectedTime, setSelectedTime] = useState<string>(initial.time);

    // Current displayed month in calendar
    const initDateObj = parseYMD(initial.date) || new Date();
    const [viewYear, setViewYear] = useState<number>(initDateObj.getFullYear());
    const [viewMonth, setViewMonth] = useState<number>(initDateObj.getMonth());

    useEffect(() => {
        const parsed = parseValue(value, withTime);
        setSelectedDate(parsed.date);
        setSelectedTime(parsed.time);
        if (parsed.date) {
            const d = parseYMD(parsed.date);
            if (d) {
                setViewYear(d.getFullYear());
                setViewMonth(d.getMonth());
            }
        }
    }, [value, withTime]);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') {
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

    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const handleApply = (d = selectedDate, t = selectedTime) => {
        if (!d) {
            onChange('');
            setIsOpen(false);
            return;
        }
        if (withTime) {
            onChange(`${d}T${t || '08:00'}`);
        } else {
            onChange(d);
        }
        setIsOpen(false);
    };

    const handleClear = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSelectedDate('');
        onChange('');
        setIsOpen(false);
    };

    const setNow = () => {
        const now = new Date();
        const dateStr = formatYMD(now);
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const timeStr = `${hours}:${minutes}`;

        setSelectedDate(dateStr);
        setSelectedTime(timeStr);
        setViewYear(now.getFullYear());
        setViewMonth(now.getMonth());

        if (withTime) {
            onChange(`${dateStr}T${timeStr}`);
        } else {
            onChange(dateStr);
        }
        setIsOpen(false);
    };

    const setToday = () => {
        const now = new Date();
        const dateStr = formatYMD(now);
        setSelectedDate(dateStr);
        setViewYear(now.getFullYear());
        setViewMonth(now.getMonth());
    };

    const setTomorrow = () => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        const dateStr = formatYMD(d);
        setSelectedDate(dateStr);
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
    };

    const defaultPlaceholder = withTime ? 'Pilih tanggal & jam...' : 'Pilih tanggal...';
    const displayVal = formatDisplay(value, withTime);

    return (
        <div className={`relative inline-block ${className}`} ref={containerRef}>
            {/* Trigger Button */}
            <div
                id={id}
                role="button"
                tabIndex={disabled ? -1 : 0}
                onClick={() => !disabled && setIsOpen((prev) => !prev)}
                onKeyDown={(e) => {
                    if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        setIsOpen((prev) => !prev);
                    }
                }}
                className={`flex items-center justify-between gap-2 h-9 px-3 text-xs bg-white border rounded-md shadow-xs select-none transition-colors ${
                    disabled
                        ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200'
                        : isOpen
                        ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-sm cursor-pointer'
                        : 'border-input hover:border-gray-400 hover:bg-gray-50/50 cursor-pointer'
                }`}
            >
                <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap min-w-0">
                    <CalendarIcon className="h-4 w-4 text-blue-600 shrink-0" />
                    {displayVal ? (
                        <span className="font-semibold text-gray-800 truncate">{displayVal}</span>
                    ) : (
                        <span className="text-muted-foreground font-normal truncate">
                            {placeholder || defaultPlaceholder}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                    {value && !disabled ? (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-1 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Hapus"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    ) : (
                        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                    )}
                </div>
            </div>

            {/* Dropdown Calendar / Time Panel */}
            {isOpen && (
                <div
                    className={`absolute z-50 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl p-3.5 w-[310px] sm:w-[340px] animate-in fade-in zoom-in-95 duration-150 ${
                        align === 'right' ? 'right-0' : 'left-0'
                    }`}
                >
                    {/* Quick Preset Buttons Header */}
                    <div className="flex items-center justify-between gap-1.5 pb-2.5 mb-2.5 border-b border-gray-100">
                        <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                            Shortcut
                        </span>
                        <div className="flex items-center gap-1">
                            {withTime && (
                                <button
                                    type="button"
                                    onClick={setNow}
                                    className="px-2 py-1 text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition cursor-pointer"
                                >
                                    Sekarang
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={setToday}
                                className="px-2 py-1 text-[11px] font-medium text-gray-600 hover:bg-gray-100 rounded transition cursor-pointer"
                            >
                                Hari Ini
                            </button>
                            <button
                                type="button"
                                onClick={setTomorrow}
                                className="px-2 py-1 text-[11px] font-medium text-gray-600 hover:bg-gray-100 rounded transition cursor-pointer"
                            >
                                Besok
                            </button>
                        </div>
                    </div>

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
                    <div className="grid grid-cols-7 gap-y-1 text-center">
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
                            const isSelected = ymd === selectedDate;
                            const isToday = ymd === formatYMD(new Date());

                            return (
                                <div
                                    key={ymd}
                                    onClick={() => setSelectedDate(ymd)}
                                    className={`h-8 flex items-center justify-center text-xs font-medium cursor-pointer select-none transition-colors rounded-lg ${
                                        isSelected
                                            ? 'bg-blue-600 text-white font-bold shadow-xs'
                                            : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                                >
                                    <span
                                        className={`flex items-center justify-center w-7 h-7 rounded-full ${
                                            isToday && !isSelected
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

                    {/* Time Picker Section (If withTime is true) */}
                    {withTime && (
                        <div className="pt-3 mt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                                <Clock className="h-3.5 w-3.5 text-blue-600" />
                                <span>Jam (WIB):</span>
                            </div>

                            <div className="flex items-center gap-1.5">
                                <input
                                    type="time"
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                    className="h-8 px-2 text-xs font-mono font-semibold bg-gray-50 border border-gray-200 rounded-md text-gray-800 focus:bg-white focus:border-blue-500 focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setSelectedTime(getNowLocalTime())}
                                    className="px-2 py-1 text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition cursor-pointer"
                                    title="Gunakan jam saat ini"
                                >
                                    Jam Sekarang
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={handleClear}
                            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-md transition font-medium flex items-center gap-1 cursor-pointer"
                        >
                            <RotateCcw className="h-3 w-3" />
                            Hapus
                        </button>

                        <div className="flex items-center gap-2">
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
                                disabled={!selectedDate}
                                className="px-3.5 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-md transition font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
                            >
                                <Check className="h-3.5 w-3.5" />
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DateTimePicker;
