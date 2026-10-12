import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { DismissableLayerBranch } from '@radix-ui/react-dismissable-layer';
import {
    Calendar as CalendarIcon,
    Clock,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    X,
    Check,
    RotateCcw,
    Plus,
    Minus,
    Zap,
} from 'lucide-react';

export interface DateTimePickerProps {
    value?: string; // 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:mm' or 'YYYY-MM-DD HH:mm:ss'
    onChange: (val: string) => void;
    withTime?: boolean;
    placeholder?: string;
    className?: string;
    id?: string;
    disabled?: boolean;
    align?: 'left' | 'right' | 'center';
    inModal?: boolean;
    centered?: boolean;
}

const MONTH_NAMES = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const DAY_NAMES_FULL = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const HOURS_LIST = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES_LIST = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

function getNowLocalTime(): string {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

function parseValue(val?: string, withTime = true) {
    const defaultTime = getNowLocalTime();
    if (!val) return { date: '', time: defaultTime };

    const match = val.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/);
    if (match) {
        const date = `${match[1]}-${match[2]}-${match[3]}`;
        const time = withTime && match[4] && match[5] ? `${match[4]}:${match[5]}` : defaultTime;
        return { date, time };
    }

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
    inModal = false,
    centered = false,
}: DateTimePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isShortViewport, setIsShortViewport] = useState(false);
    const [isInsideDialog, setIsInsideDialog] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const portalWrapperRef = useRef<HTMLDivElement>(null);

    const initial = parseValue(value, withTime);
    const defaultToday = formatYMD(new Date());
    const defaultNow = getNowLocalTime();

    const [selectedDate, setSelectedDate] = useState<string>(initial.date || defaultToday);
    const [selectedTime, setSelectedTime] = useState<string>(initial.time || defaultNow);

    const timeParts = (selectedTime || defaultNow).split(':');
    const [hourVal, setHourVal] = useState<string>(timeParts[0] || '08');
    const [minuteVal, setMinuteVal] = useState<string>(timeParts[1] || '00');

    // Calendar month/year navigation state
    const initDateObj = parseYMD(initial.date) || new Date();
    const [viewYear, setViewYear] = useState<number>(initDateObj.getFullYear());
    const [viewMonth, setViewMonth] = useState<number>(initDateObj.getMonth());

    const [dropPosition, setDropPosition] = useState<'bottom' | 'top'>('bottom');
    const [horizontalAlign, setHorizontalAlign] = useState<'left' | 'right' | 'center'>(align);

    const prevIsOpenRef = useRef<boolean>(false);
    const prevValueRef = useRef<string>(value);

    useEffect(() => {
        const checkMobile = () => {
            if (typeof window === 'undefined') return;
            setIsMobile(window.innerWidth < 768);
            setIsShortViewport(window.innerHeight < 550);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (containerRef.current) {
            const inDialog = Boolean(
                containerRef.current.closest('[data-slot="dialog-content"], [role="dialog"], [data-radix-dialog-content], .dialog-content')
            );
            setIsInsideDialog(inDialog);
        }
    }, [isOpen]);

    const isActuallyInModal = Boolean(
        inModal ||
        centered ||
        isInsideDialog ||
        (typeof document !== 'undefined' && containerRef.current?.closest('[data-slot="dialog-content"], [role="dialog"], [data-radix-dialog-content], .dialog-content'))
    );
    const shouldCenter = Boolean(isActuallyInModal || isMobile || isShortViewport);

    // Sync value changes from props
    useEffect(() => {
        const parsed = parseValue(value, withTime);
        const curToday = formatYMD(new Date());
        const curNow = getNowLocalTime();

        const justOpened = !prevIsOpenRef.current && isOpen;
        const valueChangedWhileClosed = !isOpen && value !== prevValueRef.current;

        if (justOpened || valueChangedWhileClosed) {
            const dateToSet = parsed.date || curToday;
            const timeToSet = parsed.time || curNow;
            const parts = timeToSet.split(':');
            const h = (parts[0] || '08').padStart(2, '0');
            const m = (parts[1] || '00').padStart(2, '0');

            setSelectedDate(dateToSet);
            setSelectedTime(`${h}:${m}`);
            setHourVal(h);
            setMinuteVal(m);

            const d = parseYMD(dateToSet) || new Date();
            setViewYear(d.getFullYear());
            setViewMonth(d.getMonth());
        }

        prevIsOpenRef.current = isOpen;
        prevValueRef.current = value;
    }, [value, withTime, isOpen]);

    // Position detection when open as dropdown
    useEffect(() => {
        if (!isOpen || shouldCenter) return;

        const updatePosition = () => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const popupHeight = 460;
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;

            if (spaceBelow < popupHeight && spaceAbove > spaceBelow) {
                setDropPosition('top');
            } else {
                setDropPosition('bottom');
            }

            const spaceRight = window.innerWidth - rect.left;
            if (align === 'left' && spaceRight < 340 && rect.right > 340) {
                setHorizontalAlign('right');
            } else {
                setHorizontalAlign(align);
            }
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);
        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [isOpen, shouldCenter, align]);

    // Close on click outside when not centered
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (shouldCenter) return;
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
    }, [isOpen, shouldCenter]);

    // Update time helper (does NOT require changing date first)
    const updateTime = (h: string, m: string, emitChange = true) => {
        const validH = (h || '08').padStart(2, '0');
        const validM = (m || '00').padStart(2, '0');
        const fullTime = `${validH}:${validM}`;
        setHourVal(validH);
        setMinuteVal(validM);
        setSelectedTime(fullTime);

        const targetDate = selectedDate || formatYMD(new Date());
        setSelectedDate(targetDate);

        if (emitChange) {
            if (withTime) {
                onChange(`${targetDate}T${fullTime}`);
            } else {
                onChange(targetDate);
            }
        }
    };

    // Steppers for hour and minute
    const stepHour = (delta: number) => {
        const cur = parseInt(hourVal, 10) || 0;
        const next = (cur + delta + 24) % 24;
        const nextStr = String(next).padStart(2, '0');
        updateTime(nextStr, minuteVal);
    };

    const stepMinute = (delta: number) => {
        const cur = parseInt(minuteVal, 10) || 0;
        const next = (cur + delta + 60) % 60;
        const nextStr = String(next).padStart(2, '0');
        updateTime(hourVal, nextStr);
    };

    // Date navigation
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

    const handleDateSelect = (ymd: string) => {
        setSelectedDate(ymd);
        const fullTime = `${hourVal}:${minuteVal}`;
        if (withTime) {
            onChange(`${ymd}T${fullTime}`);
        } else {
            onChange(ymd);
        }
    };

    // Presets
    const setNow = () => {
        const now = new Date();
        const dateStr = formatYMD(now);
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const timeStr = `${hours}:${minutes}`;

        setSelectedDate(dateStr);
        setSelectedTime(timeStr);
        setHourVal(hours);
        setMinuteVal(minutes);
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
        const fullTime = `${hourVal}:${minuteVal}`;
        if (withTime) {
            onChange(`${dateStr}T${fullTime}`);
        } else {
            onChange(dateStr);
        }
    };

    const setYesterday = () => {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        const dateStr = formatYMD(d);
        setSelectedDate(dateStr);
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
        const fullTime = `${hourVal}:${minuteVal}`;
        if (withTime) {
            onChange(`${dateStr}T${fullTime}`);
        } else {
            onChange(dateStr);
        }
    };

    const setTomorrow = () => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        const dateStr = formatYMD(d);
        setSelectedDate(dateStr);
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
        const fullTime = `${hourVal}:${minuteVal}`;
        if (withTime) {
            onChange(`${dateStr}T${fullTime}`);
        } else {
            onChange(dateStr);
        }
    };

    const handleSetNowTime = () => {
        const nowTime = getNowLocalTime();
        const [h, m] = nowTime.split(':');
        updateTime(h || '08', m || '00');
    };

    const handleApply = () => {
        const finalDate = selectedDate || formatYMD(new Date());
        const finalTime = `${hourVal}:${minuteVal}`;
        if (withTime) {
            onChange(`${finalDate}T${finalTime}`);
        } else {
            onChange(finalDate);
        }
        setIsOpen(false);
    };

    const handleClear = (e?: React.SyntheticEvent | Event) => {
        e?.stopPropagation();
        setSelectedDate('');
        const nowTime = getNowLocalTime();
        setSelectedTime(nowTime);
        const [h, m] = nowTime.split(':');
        setHourVal(h || '08');
        setMinuteVal(m || '00');
        onChange('');
        setIsOpen(false);
    };

    // Calendar calculations
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    // Human readable preview of selected date
    const selectedDateSummary = useMemo(() => {
        if (!selectedDate) return 'Belum dipilih';
        const d = parseYMD(selectedDate);
        if (!d) return selectedDate;
        const dayName = DAY_NAMES_FULL[d.getDay()] || '';
        const dayNum = d.getDate();
        const monthName = MONTH_NAMES[d.getMonth()] || '';
        const yearNum = d.getFullYear();
        if (withTime) {
            return `${dayName}, ${dayNum} ${monthName} ${yearNum} • ${hourVal}:${minuteVal} WIB`;
        }
        return `${dayName}, ${dayNum} ${monthName} ${yearNum}`;
    }, [selectedDate, hourVal, minuteVal, withTime]);

    const defaultPlaceholder = withTime ? 'Pilih tanggal & jam...' : 'Pilih tanggal...';
    const displayVal = formatDisplay(value, withTime);

    // Year selection range
    const currentYear = new Date().getFullYear();
    const minYear = Math.min(2018, viewYear - 5);
    const maxYear = Math.max(currentYear + 10, viewYear + 5);
    const yearOptions: number[] = [];
    for (let y = minYear; y <= maxYear; y++) {
        yearOptions.push(y);
    }

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
                        ? 'border-gray-900 ring-2 ring-gray-900/10 shadow-sm cursor-pointer'
                        : 'border-input hover:border-gray-400 hover:bg-gray-50/50 cursor-pointer'
                }`}
            >
                <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap min-w-0">
                    <CalendarIcon className="h-4 w-4 text-gray-700 shrink-0" />
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
                            className="p-1 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Hapus"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    ) : (
                        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180 text-gray-900' : ''}`} />
                    )}
                </div>
            </div>

            {/* Dropdown / Modal Content */}
            {isOpen && (() => {
                const panelContent = (
                    <div
                        className="flex flex-col gap-3 select-none text-gray-800"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 1. Header Ringkasan & Shortcuts */}
                        <div className="flex flex-col gap-2 pb-2.5 border-b border-gray-100 shrink-0">
                            <div className="flex items-center justify-between gap-1">
                                <span className="text-[11px] font-bold text-gray-900 flex items-center gap-1.5">
                                    <CalendarIcon className="h-3.5 w-3.5 text-blue-600" />
                                    <span>Pilih Tanggal & Waktu</span>
                                </span>
                                <div className="flex items-center gap-1">
                                    {withTime && (
                                        <button
                                            type="button"
                                            onClick={setNow}
                                            className="px-2 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition cursor-pointer flex items-center gap-1"
                                            title="Set tanggal & jam sekarang"
                                        >
                                            <Zap className="h-3 w-3" />
                                            Sekarang
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={setToday}
                                        className="px-2 py-1 text-[11px] font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition cursor-pointer"
                                    >
                                        Hari Ini
                                    </button>
                                    <button
                                        type="button"
                                        onClick={setYesterday}
                                        className="px-1.5 py-1 text-[11px] font-medium text-gray-600 hover:bg-gray-100 rounded-md transition cursor-pointer"
                                    >
                                        Kemarin
                                    </button>
                                    <button
                                        type="button"
                                        onClick={setTomorrow}
                                        className="px-1.5 py-1 text-[11px] font-medium text-gray-600 hover:bg-gray-100 rounded-md transition cursor-pointer"
                                    >
                                        Besok
                                    </button>
                                </div>
                            </div>

                            {/* Live Selection Summary Banner */}
                            <div className="bg-slate-50 border border-slate-200/80 rounded-lg px-2.5 py-1.5 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5 text-slate-700 font-medium truncate">
                                    <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Terpilih:</span>
                                    <span className="font-semibold text-slate-900 truncate">{selectedDateSummary}</span>
                                </div>
                            </div>
                        </div>

                        {/* 2. Navigasi Bulan & Tahun */}
                        <div className="flex items-center justify-between px-0.5 shrink-0">
                            <button
                                type="button"
                                onClick={prevMonth}
                                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 active:bg-gray-200 transition cursor-pointer"
                                title="Bulan sebelumnya"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>

                            <div className="flex items-center gap-1.5">
                                {/* Month Dropdown Selector */}
                                <div className="relative">
                                    <select
                                        value={viewMonth}
                                        onChange={(e) => setViewMonth(Number(e.target.value))}
                                        className="h-8 text-xs font-bold text-gray-900 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg pl-2.5 pr-6 py-0 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition shadow-2xs"
                                        title="Pilih Bulan"
                                    >
                                        {MONTH_NAMES.map((name, idx) => (
                                            <option key={name} value={idx}>
                                                {name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="h-3 w-3 text-gray-500 absolute right-1.5 top-2.5 pointer-events-none" />
                                </div>

                                {/* Year Dropdown Selector */}
                                <div className="relative">
                                    <select
                                        value={viewYear}
                                        onChange={(e) => setViewYear(Number(e.target.value))}
                                        className="h-8 text-xs font-bold text-gray-900 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg pl-2.5 pr-6 py-0 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition shadow-2xs"
                                        title="Pilih Tahun"
                                    >
                                        {yearOptions.map((y) => (
                                            <option key={y} value={y}>
                                                {y}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="h-3 w-3 text-gray-500 absolute right-1.5 top-2.5 pointer-events-none" />
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={nextMonth}
                                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 active:bg-gray-200 transition cursor-pointer"
                                title="Bulan berikutnya"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>

                        {/* 3. Grid Kalender Hari */}
                        <div className="shrink-0">
                            {/* Days of week header */}
                            <div className="grid grid-cols-7 gap-1 text-center mb-1">
                                {DAY_NAMES.map((d, idx) => (
                                    <span
                                        key={d}
                                        className={`text-[11px] font-bold ${
                                            idx === 0 ? 'text-red-500' : 'text-gray-400'
                                        }`}
                                    >
                                        {d}
                                    </span>
                                ))}
                            </div>

                            {/* Month Days */}
                            <div className="grid grid-cols-7 gap-1 text-center">
                                {/* Previous month muted days */}
                                {Array.from({ length: firstDayIndex }).map((_, i) => {
                                    const prevDay = daysInPrevMonth - firstDayIndex + 1 + i;
                                    return (
                                        <div
                                            key={`prev-${i}`}
                                            className="h-7 sm:h-8 flex items-center justify-center text-xs text-gray-300 select-none cursor-default"
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
                                        <button
                                            key={ymd}
                                            type="button"
                                            onClick={() => handleDateSelect(ymd)}
                                            className={`h-7 sm:h-8 flex items-center justify-center text-xs font-semibold cursor-pointer select-none transition-colors rounded-lg ${
                                                isSelected
                                                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                                                    : 'hover:bg-blue-50 text-gray-700 hover:text-blue-700 active:bg-blue-100'
                                            }`}
                                        >
                                            <span
                                                className={`flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full ${
                                                    isToday && !isSelected
                                                        ? 'border border-blue-600 font-bold text-blue-600'
                                                        : ''
                                                }`}
                                            >
                                                {day}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 4. Section Waktu (Jam & Menit) yang Bebas & Fleksibel */}
                        {withTime && (
                            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2.5 shrink-0 bg-slate-50/70 p-2.5 rounded-xl border border-slate-200/70">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-800 font-bold">
                                        <Clock className="h-4 w-4 text-blue-600" />
                                        <span>Atur Jam & Menit:</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleSetNowTime}
                                        className="px-2 py-0.5 text-[11px] font-semibold text-blue-700 bg-blue-100/70 hover:bg-blue-200/80 rounded transition cursor-pointer flex items-center gap-1"
                                        title="Set ke jam saat ini"
                                    >
                                        <Clock className="h-3 w-3" />
                                        Jam Sekarang
                                    </button>
                                </div>

                                <div className="flex items-center justify-between gap-3">
                                    {/* Selector Jam (00 - 23) */}
                                    <div className="flex-1 flex flex-col gap-1">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase">Jam (00 - 23)</span>
                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => stepHour(-1)}
                                                className="w-7 h-8 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-100 active:bg-gray-200 text-gray-700 cursor-pointer transition shadow-2xs"
                                                title="Kurangi 1 jam"
                                            >
                                                <Minus className="h-3.5 w-3.5" />
                                            </button>
                                            <div className="relative flex-1">
                                                <select
                                                    value={hourVal}
                                                    onChange={(e) => updateTime(e.target.value, minuteVal)}
                                                    className="w-full h-8 text-center text-xs font-mono font-bold text-gray-900 bg-white border border-gray-300 rounded-lg appearance-none cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
                                                    title="Pilih Jam"
                                                >
                                                    {HOURS_LIST.map((h) => (
                                                        <option key={h} value={h}>
                                                            {h}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="h-3 w-3 text-gray-400 absolute right-1.5 top-2.5 pointer-events-none" />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => stepHour(1)}
                                                className="w-7 h-8 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-100 active:bg-gray-200 text-gray-700 cursor-pointer transition shadow-2xs"
                                                title="Tambah 1 jam"
                                            >
                                                <Plus className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    <span className="font-bold text-gray-400 text-lg mt-4 select-none">:</span>

                                    {/* Selector Menit (00 - 59) */}
                                    <div className="flex-1 flex flex-col gap-1">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase">Menit (00 - 59)</span>
                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => stepMinute(-1)}
                                                className="w-7 h-8 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-100 active:bg-gray-200 text-gray-700 cursor-pointer transition shadow-2xs"
                                                title="Kurangi 1 menit"
                                            >
                                                <Minus className="h-3.5 w-3.5" />
                                            </button>
                                            <div className="relative flex-1">
                                                <select
                                                    value={minuteVal}
                                                    onChange={(e) => updateTime(hourVal, e.target.value)}
                                                    className="w-full h-8 text-center text-xs font-mono font-bold text-gray-900 bg-white border border-gray-300 rounded-lg appearance-none cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
                                                    title="Pilih Menit"
                                                >
                                                    {MINUTES_LIST.map((m) => (
                                                        <option key={m} value={m}>
                                                            {m}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="h-3 w-3 text-gray-400 absolute right-1.5 top-2.5 pointer-events-none" />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => stepMinute(1)}
                                                className="w-7 h-8 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-100 active:bg-gray-200 text-gray-700 cursor-pointer transition shadow-2xs"
                                                title="Tambah 1 menit"
                                            >
                                                <Plus className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Preset Jam Populer */}
                                <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
                                    <span className="text-[10px] text-gray-400 font-semibold whitespace-nowrap">Preset:</span>
                                    {['08:00', '12:00', '16:00', '20:00', '00:00'].map((preset) => {
                                        const [ph, pm] = preset.split(':');
                                        const isActive = hourVal === ph && minuteVal === pm;
                                        return (
                                            <button
                                                key={preset}
                                                type="button"
                                                onClick={() => updateTime(ph, pm)}
                                                className={`px-2 py-0.5 text-[10px] font-mono font-semibold rounded transition cursor-pointer ${
                                                    isActive
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                                                }`}
                                            >
                                                {preset}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* 5. Footer Actions (Simpan, Batal, Hapus) */}
                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100 shrink-0">
                            <button
                                type="button"
                                onClick={handleClear}
                                className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 active:bg-red-100 px-2.5 py-1.5 rounded-lg transition font-medium flex items-center gap-1 cursor-pointer"
                            >
                                <RotateCcw className="h-3 w-3" />
                                Hapus
                            </button>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition font-medium cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleApply}
                                    className="px-4 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg transition font-bold flex items-center gap-1 shadow-sm cursor-pointer"
                                >
                                    <Check className="h-3.5 w-3.5" />
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </div>
                );

                // Modal Popup View (Ketika di dalam Dialog atau di layar kecil)
                if (shouldCenter && typeof document !== 'undefined') {
                    const portalTarget = document.body;

                    return createPortal(
                        <DismissableLayerBranch asChild>
                            <div
                                ref={portalWrapperRef}
                                className="fixed inset-0 z-[99999] pointer-events-auto flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
                                onClick={(e) => {
                                    if (e.target === e.currentTarget) {
                                        setIsOpen(false);
                                    }
                                }}
                            >
                                <div
                                    className="w-full max-w-[340px] sm:max-w-[360px] max-h-[94vh] overflow-y-auto bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 animate-in zoom-in-95 duration-150 flex flex-col pointer-events-auto"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* Modal Top Close Bar */}
                                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 shrink-0">
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon className="h-4 w-4 text-blue-600" />
                                            <span className="text-xs font-bold text-gray-900">
                                                {withTime ? 'Pilih Tanggal & Jam' : 'Pilih Tanggal'}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setIsOpen(false)}
                                            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200 cursor-pointer transition-colors"
                                            aria-label="Tutup"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {panelContent}
                                </div>
                            </div>
                        </DismissableLayerBranch>,
                        portalTarget
                    );
                }

                // Regular Dropdown Popup View
                return (
                    <div
                        className={`absolute z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-3.5 w-[320px] sm:w-[350px] max-h-[88vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150 ${
                            dropPosition === 'top' ? 'bottom-full mb-1.5 origin-bottom' : 'top-full mt-1.5 origin-top'
                        } ${
                            horizontalAlign === 'right' ? 'right-0' : horizontalAlign === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0'
                        }`}
                    >
                        {panelContent}
                    </div>
                );
            })()}
        </div>
    );
}

export default DateTimePicker;
