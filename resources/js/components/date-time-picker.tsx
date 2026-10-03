import React, { useState, useEffect, useRef } from 'react';
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
} from 'lucide-react';

interface DateTimePickerProps {
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
    const [isInsideDialog, setIsInsideDialog] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const initial = parseValue(value, withTime);
    const [selectedDate, setSelectedDate] = useState<string>(initial.date);
    const [selectedTime, setSelectedTime] = useState<string>(initial.time);

    const initialTimeParts = (initial.time || '08:00').split(':');
    const [hourVal, setHourVal] = useState<string>(initialTimeParts[0] || '08');
    const [minuteVal, setMinuteVal] = useState<string>(initialTimeParts[1] || '00');
    const hourValRef = useRef<string>(initialTimeParts[0] || '08');
    const minuteValRef = useRef<string>(initialTimeParts[1] || '00');
    const prevIsOpenRef = useRef<boolean>(false);
    const prevValueRef = useRef<string>(value);
    const hourInputRef = useRef<HTMLInputElement>(null);
    const minuteInputRef = useRef<HTMLInputElement>(null);
    const portalWrapperRef = useRef<HTMLDivElement>(null);

    // Current displayed month in calendar
    const initDateObj = parseYMD(initial.date) || new Date();
    const [viewYear, setViewYear] = useState<number>(initDateObj.getFullYear());
    const [viewMonth, setViewMonth] = useState<number>(initDateObj.getMonth());

    useEffect(() => {
        const checkMobile = () => {
            if (typeof window === 'undefined') return;
            setIsMobile(window.innerWidth < 768);
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
    const shouldCenter = Boolean(isActuallyInModal || isMobile);

    useEffect(() => {
        const parsed = parseValue(value, withTime);
        const parts = (parsed.time || '08:00').split(':');
        const h = parts[0] || '08';
        const m = parts[1] || '00';

        const justOpened = !prevIsOpenRef.current && isOpen;
        const valueChangedWhileClosed = !isOpen && value !== prevValueRef.current;

        if (justOpened || valueChangedWhileClosed) {
            setSelectedDate(parsed.date);
            setSelectedTime(parsed.time);
            setHourVal(h);
            setMinuteVal(m);
            hourValRef.current = h;
            minuteValRef.current = m;
            if (parsed.date) {
                const d = parseYMD(parsed.date);
                if (d) {
                    setViewYear(d.getFullYear());
                    setViewMonth(d.getMonth());
                }
            }
        } else if (isOpen && value !== prevValueRef.current) {
            setSelectedDate(parsed.date);
            const currentRefTime = `${(hourValRef.current || '08').padStart(2, '0')}:${(minuteValRef.current || '00').padStart(2, '0')}`;
            if (parsed.time && parsed.time !== currentRefTime) {
                setSelectedTime(parsed.time);
                setHourVal(h);
                setMinuteVal(m);
                hourValRef.current = h;
                minuteValRef.current = m;
            }
        }

        prevIsOpenRef.current = isOpen;
        prevValueRef.current = value;
    }, [value, withTime, isOpen]);

    // Native Focus & Pointer Event Bubbling Isolation:
    // Prevents focusin, focusout, pointerdown from bubbling up to document,
    // so Radix UI's Dialog FocusScope on the parent modal NEVER steals focus!
    useEffect(() => {
        const el = portalWrapperRef.current;
        if (!el || !isOpen) return;

        const stopPropagation = (e: Event) => {
            e.stopPropagation();
        };

        el.addEventListener('focusin', stopPropagation, false);
        el.addEventListener('focusout', stopPropagation, false);
        el.addEventListener('pointerdown', stopPropagation, false);
        el.addEventListener('mousedown', stopPropagation, false);

        return () => {
            el.removeEventListener('focusin', stopPropagation, false);
            el.removeEventListener('focusout', stopPropagation, false);
            el.removeEventListener('pointerdown', stopPropagation, false);
            el.removeEventListener('mousedown', stopPropagation, false);
        };
    }, [isOpen, shouldCenter]);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            // Pada centered modal / portaled popup, penutupan diatur via backdrop overlay
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

    const updateTimeFromParts = (h: string, m: string) => {
        const validH = (h || '08').padStart(2, '0');
        const validM = (m || '00').padStart(2, '0');
        const fullTime = `${validH}:${validM}`;
        hourValRef.current = validH;
        minuteValRef.current = validM;
        setSelectedTime(fullTime);
    };

    const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let raw = e.target.value.replace(/\D/g, '');
        if (raw === '') {
            hourValRef.current = '';
            setHourVal('');
            return;
        }

        // Jika user mengetik angka ke-3 ke dalam box yang sudah berisi 2 digit
        // (tanpa sempat block/select all), ambil digit yang baru diketik!
        if (raw.length > 2) {
            raw = raw.slice(-1);
        }

        const num = parseInt(raw, 10);
        if (isNaN(num)) return;

        if (raw.length === 2) {
            const clamped = Math.min(23, Math.max(0, num));
            const formatted = String(clamped).padStart(2, '0');
            hourValRef.current = formatted;
            setHourVal(formatted);
            updateTimeFromParts(formatted, minuteValRef.current || '00');
            // Auto-advance ke input menit dan langsung select all teks menit
            minuteInputRef.current?.focus();
            requestAnimationFrame(() => minuteInputRef.current?.select());
        } else {
            // raw.length === 1
            if (num > 2) {
                // Jam dalam format 24h: angka 3 - 9 otomatis jadi 03 - 09
                const formatted = `0${num}`;
                hourValRef.current = formatted;
                setHourVal(formatted);
                updateTimeFromParts(formatted, minuteValRef.current || '00');
                // Auto-advance ke input menit dan langsung select all teks menit
                minuteInputRef.current?.focus();
                requestAnimationFrame(() => minuteInputRef.current?.select());
            } else {
                // Angka 0, 1, 2: tunggu kemungkinan digit kedua (misal 12, 15, 23)
                hourValRef.current = raw;
                setHourVal(raw);
            }
        }
    };

    const handleHourBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, '');
        let formatted = '08';
        if (raw !== '') {
            const num = parseInt(raw, 10);
            if (!isNaN(num)) {
                const clamped = Math.min(23, Math.max(0, num));
                formatted = String(clamped).padStart(2, '0');
            }
        }
        hourValRef.current = formatted;
        setHourVal(formatted);
        updateTimeFromParts(formatted, minuteValRef.current || '00');
    };

    const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let raw = e.target.value.replace(/\D/g, '');
        if (raw === '') {
            minuteValRef.current = '';
            setMinuteVal('');
            return;
        }

        // Jika user mengetik angka ke-3 ke dalam box yang sudah berisi 2 digit
        if (raw.length > 2) {
            raw = raw.slice(-1);
        }

        const num = parseInt(raw, 10);
        if (isNaN(num)) return;

        if (raw.length === 2) {
            const clamped = Math.min(59, Math.max(0, num));
            const formatted = String(clamped).padStart(2, '0');
            minuteValRef.current = formatted;
            setMinuteVal(formatted);
            updateTimeFromParts(hourValRef.current || '08', formatted);
        } else {
            // raw.length === 1
            if (num > 5) {
                // Angka menit 6 - 9 otomatis jadi 06 - 09
                const formatted = `0${num}`;
                minuteValRef.current = formatted;
                setMinuteVal(formatted);
                updateTimeFromParts(hourValRef.current || '08', formatted);
            } else {
                minuteValRef.current = raw;
                setMinuteVal(raw);
            }
        }
    };

    const handleMinuteBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, '');
        let formatted = '00';
        if (raw !== '') {
            const num = parseInt(raw, 10);
            if (!isNaN(num)) {
                const clamped = Math.min(59, Math.max(0, num));
                formatted = String(clamped).padStart(2, '0');
            }
        }
        minuteValRef.current = formatted;
        setMinuteVal(formatted);
        updateTimeFromParts(hourValRef.current || '08', formatted);
    };

    const handleHourKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const cur = parseInt(hourValRef.current || hourVal, 10) || 0;
            const next = (cur + 1) % 24;
            const formatted = String(next).padStart(2, '0');
            hourValRef.current = formatted;
            setHourVal(formatted);
            updateTimeFromParts(formatted, minuteValRef.current || '00');
            requestAnimationFrame(() => hourInputRef.current?.select());
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const cur = parseInt(hourValRef.current || hourVal, 10) || 0;
            const next = (cur - 1 + 24) % 24;
            const formatted = String(next).padStart(2, '0');
            hourValRef.current = formatted;
            setHourVal(formatted);
            updateTimeFromParts(formatted, minuteValRef.current || '00');
            requestAnimationFrame(() => hourInputRef.current?.select());
        } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
            e.preventDefault();
            minuteInputRef.current?.focus();
            requestAnimationFrame(() => minuteInputRef.current?.select());
        }
    };

    const handleMinuteKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const cur = parseInt(minuteValRef.current || minuteVal, 10) || 0;
            const next = (cur + 1) % 60;
            const formatted = String(next).padStart(2, '0');
            minuteValRef.current = formatted;
            setMinuteVal(formatted);
            updateTimeFromParts(hourValRef.current || '08', formatted);
            requestAnimationFrame(() => minuteInputRef.current?.select());
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const cur = parseInt(minuteValRef.current || minuteVal, 10) || 0;
            const next = (cur - 1 + 60) % 60;
            const formatted = String(next).padStart(2, '0');
            minuteValRef.current = formatted;
            setMinuteVal(formatted);
            updateTimeFromParts(hourValRef.current || '08', formatted);
            requestAnimationFrame(() => minuteInputRef.current?.select());
        } else if (e.key === 'Backspace' && (minuteVal === '' || minuteInputRef.current?.selectionStart === 0)) {
            e.preventDefault();
            hourInputRef.current?.focus();
            requestAnimationFrame(() => hourInputRef.current?.select());
        } else if (e.key === 'ArrowLeft') {
            if (minuteInputRef.current?.selectionStart === 0) {
                e.preventDefault();
                hourInputRef.current?.focus();
                requestAnimationFrame(() => hourInputRef.current?.select());
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            handleApply();
        }
    };

    const handleTimePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text').trim();
        const match = text.match(/^(\d{1,2})[:.](\d{1,2})/);
        if (match) {
            const h = String(Math.min(23, Math.max(0, parseInt(match[1], 10)))).padStart(2, '0');
            const m = String(Math.min(59, Math.max(0, parseInt(match[2], 10)))).padStart(2, '0');
            hourValRef.current = h;
            minuteValRef.current = m;
            setHourVal(h);
            setMinuteVal(m);
            updateTimeFromParts(h, m);
        }
    };

    const handleApply = (d = selectedDate, t = selectedTime) => {
        if (!d) {
            onChange('');
            setIsOpen(false);
            return;
        }
        const h = (hourValRef.current || hourVal || '08').padStart(2, '0');
        const m = (minuteValRef.current || minuteVal || '00').padStart(2, '0');
        const finalTime = `${h}:${m}`;
        if (withTime) {
            onChange(`${d}T${finalTime}`);
        } else {
            onChange(d);
        }
        setIsOpen(false);
    };

    const handleClear = (e?: React.SyntheticEvent | Event) => {
        e?.stopPropagation();
        setSelectedDate('');
        const nowTime = getNowLocalTime();
        setSelectedTime(nowTime);
        const [h, m] = nowTime.split(':');
        const validH = h || '08';
        const validM = m || '00';
        hourValRef.current = validH;
        minuteValRef.current = validM;
        setHourVal(validH);
        setMinuteVal(validM);
        onChange('');
        setIsOpen(false);
    };

    const handleDateSelect = (ymd: string) => {
        setSelectedDate(ymd);
        const h = (hourValRef.current || hourVal || '08').padStart(2, '0');
        const m = (minuteValRef.current || minuteVal || '00').padStart(2, '0');
        const t = `${h}:${m}`;
        if (withTime) {
            onChange(`${ymd}T${t}`);
        } else {
            onChange(ymd);
        }
    };

    const handleSetNowTime = () => {
        const nowTime = getNowLocalTime();
        setSelectedTime(nowTime);
        const [h, m] = nowTime.split(':');
        const validH = h || '08';
        const validM = m || '00';
        hourValRef.current = validH;
        minuteValRef.current = validM;
        setHourVal(validH);
        setMinuteVal(validM);
        const d = selectedDate || formatYMD(new Date());
        if (!selectedDate) setSelectedDate(d);
        if (withTime) {
            onChange(`${d}T${nowTime}`);
        }
    };

    const setNow = () => {
        const now = new Date();
        const dateStr = formatYMD(now);
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const timeStr = `${hours}:${minutes}`;

        setSelectedDate(dateStr);
        setSelectedTime(timeStr);
        hourValRef.current = hours;
        minuteValRef.current = minutes;
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
        const h = (hourValRef.current || hourVal || '08').padStart(2, '0');
        const m = (minuteValRef.current || minuteVal || '00').padStart(2, '0');
        const t = `${h}:${m}`;
        if (withTime) {
            onChange(`${dateStr}T${t}`);
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
        const h = (hourValRef.current || hourVal || '08').padStart(2, '0');
        const m = (minuteValRef.current || minuteVal || '00').padStart(2, '0');
        const t = `${h}:${m}`;
        if (withTime) {
            onChange(`${dateStr}T${t}`);
        } else {
            onChange(dateStr);
        }
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
                            className="p-1 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Hapus"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    ) : (
                        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180 text-gray-900' : ''}`} />
                    )}
                </div>
            </div>

            {/* Dropdown Calendar / Time Panel */}
            {isOpen && (() => {
                const panelContent = (
                    <>
                        {/* Quick Preset Buttons Header */}
                        <div className="flex items-center justify-between gap-1.5 pb-2.5 mb-2.5 border-b border-gray-100 shrink-0">
                            <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                                Shortcut
                            </span>
                            <div className="flex items-center gap-1">
                                {withTime && (
                                    <button
                                        type="button"
                                        onClick={setNow}
                                        className="px-2 py-1 text-[11px] font-semibold text-gray-900 bg-gray-100 hover:bg-gray-200 rounded transition cursor-pointer"
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
                        <div className="flex items-center justify-between mb-3 px-1 shrink-0">
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
                        <div className="grid grid-cols-7 gap-1 text-center mb-1 shrink-0">
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
                        <div className="grid grid-cols-7 gap-y-1 text-center shrink-0">
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
                                        onPointerDown={(e) => {
                                            e.stopPropagation();
                                            handleDateSelect(ymd);
                                        }}
                                        onTouchEnd={(e) => {
                                            e.stopPropagation();
                                            handleDateSelect(ymd);
                                        }}
                                        onClick={() => handleDateSelect(ymd)}
                                        className={`h-8 flex items-center justify-center text-xs font-medium cursor-pointer select-none transition-colors rounded-lg ${
                                            isSelected
                                                ? 'bg-gray-900 text-white font-bold shadow-xs'
                                                : 'hover:bg-gray-100 text-gray-700'
                                        }`}
                                    >
                                        <span
                                            className={`flex items-center justify-center w-7 h-7 rounded-full ${
                                                isToday && !isSelected
                                                    ? 'border border-gray-900 font-bold text-gray-900'
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
                            <div className="pt-3 mt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 shrink-0">
                                <div className="flex items-center gap-1.5 text-xs text-gray-700 font-semibold">
                                    <Clock className="h-3.5 w-3.5 text-gray-900" />
                                    <span>Jam (WIB):</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Direct Editable Time Input Container */}
                                    <div
                                        className="flex items-center bg-gray-50 border border-gray-300 rounded-lg px-2 py-1 focus-within:bg-white focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/10 transition-all shadow-xs"
                                        onPointerDown={(e) => e.stopPropagation()}
                                        onMouseDown={(e) => e.stopPropagation()}
                                    >
                                        <input
                                            ref={hourInputRef}
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            maxLength={3}
                                            value={hourVal}
                                            onChange={handleHourChange}
                                            onKeyDown={handleHourKeyDown}
                                            onClick={(e) => (e.target as HTMLInputElement).select()}
                                            onFocus={(e) => {
                                                const el = e.currentTarget;
                                                requestAnimationFrame(() => el.select());
                                            }}
                                            onBlur={handleHourBlur}
                                            onPaste={handleTimePaste}
                                            className="w-7 text-center text-xs font-mono font-bold text-gray-900 bg-transparent focus:bg-gray-100 rounded focus:outline-none select-all cursor-text transition-colors"
                                            placeholder="JJ"
                                            title="Ketik 2 digit jam (00 - 23)"
                                        />
                                        <span className="font-bold text-gray-400 select-none px-0.5">:</span>
                                        <input
                                            ref={minuteInputRef}
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            maxLength={3}
                                            value={minuteVal}
                                            onChange={handleMinuteChange}
                                            onKeyDown={handleMinuteKeyDown}
                                            onClick={(e) => (e.target as HTMLInputElement).select()}
                                            onFocus={(e) => {
                                                const el = e.currentTarget;
                                                requestAnimationFrame(() => el.select());
                                            }}
                                            onBlur={handleMinuteBlur}
                                            onPaste={handleTimePaste}
                                            className="w-7 text-center text-xs font-mono font-bold text-gray-900 bg-transparent focus:bg-gray-100 rounded focus:outline-none select-all cursor-text transition-colors"
                                            placeholder="MM"
                                            title="Ketik 2 digit menit (00 - 59)"
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onPointerDown={(e) => {
                                            e.stopPropagation();
                                            handleSetNowTime();
                                        }}
                                        onTouchEnd={(e) => {
                                            e.stopPropagation();
                                            handleSetNowTime();
                                        }}
                                        onClick={handleSetNowTime}
                                        className="px-2.5 py-1.5 text-[11px] font-semibold text-gray-900 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg transition cursor-pointer flex items-center gap-1 shadow-2xs"
                                        title="Gunakan jam saat ini"
                                    >
                                        <Clock className="h-3 w-3 text-gray-700" />
                                        <span>Jam Sekarang</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Footer Actions */}
                        <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-gray-100 shrink-0">
                            <button
                                type="button"
                                onPointerDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleClear(e);
                                }}
                                onTouchEnd={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleClear(e);
                                }}
                                onClick={handleClear}
                                className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 active:bg-red-100 px-2.5 py-1.5 rounded-md transition font-medium flex items-center gap-1 cursor-pointer"
                            >
                                <RotateCcw className="h-3 w-3" />
                                Hapus
                            </button>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onPointerDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setIsOpen(false);
                                    }}
                                    onTouchEnd={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setIsOpen(false);
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsOpen(false);
                                    }}
                                    className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 active:bg-gray-200 rounded-md transition font-medium cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onPointerDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (selectedDate) handleApply();
                                    }}
                                    onTouchEnd={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (selectedDate) handleApply();
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (selectedDate) handleApply();
                                    }}
                                    disabled={!selectedDate}
                                    className="px-3.5 py-1.5 text-xs bg-gray-900 hover:bg-black active:bg-neutral-800 disabled:opacity-50 text-white rounded-md transition font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
                                >
                                    <Check className="h-3.5 w-3.5" />
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </>
                );

                if (shouldCenter && typeof document !== 'undefined') {
                    return createPortal(
                        <DismissableLayerBranch asChild>
                            <div
                                ref={portalWrapperRef}
                                className="fixed inset-0 z-[99999] pointer-events-auto flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
                                onPointerDown={(e) => {
                                    if (e.target === e.currentTarget) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setIsOpen(false);
                                    }
                                }}
                                onTouchEnd={(e) => {
                                    if (e.target === e.currentTarget) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setIsOpen(false);
                                    }
                                }}
                                onClick={(e) => {
                                    if (e.target === e.currentTarget) {
                                        e.stopPropagation();
                                        setIsOpen(false);
                                    }
                                }}
                            >
                                <div
                                    className="w-full max-w-[340px] max-h-[92vh] overflow-y-auto bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 animate-in zoom-in-95 duration-150 flex flex-col pointer-events-auto"
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onTouchEnd={(e) => e.stopPropagation()}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* Header Bar */}
                                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 shrink-0">
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon className="h-4 w-4 text-gray-900" />
                                            <span className="text-xs font-bold text-gray-900">
                                                {withTime ? 'Pilih Tanggal & Jam' : 'Pilih Tanggal'}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onPointerDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setIsOpen(false);
                                            }}
                                            onTouchEnd={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setIsOpen(false);
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsOpen(false);
                                            }}
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
                        document.body
                    );
                }

                return (
                    <div
                        className={`absolute z-50 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl p-3.5 w-[320px] sm:w-[340px] max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150 ${
                            align === 'right' ? 'right-0' : align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0'
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
