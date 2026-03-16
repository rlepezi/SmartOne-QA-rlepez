import { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import {
  yyyyMMDDToDDMMYYYY,
  ddmmYYYYToYYYYMMDD,
  isValidDDMMYYYY,
  maskDDMMYYYY,
  parseDateYYYYMMDD,
} from '../utils/dateHelpers';

const WEEKDAYS = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

function dateToYMD(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getCalendarGrid(viewYear, viewMonth) {
  const first = new Date(viewYear, viewMonth, 1);
  const last = new Date(viewYear, viewMonth + 1, 0);
  const startDay = first.getDay();
  const daysInMonth = last.getDate();
  const rows = [];
  let day = 1 - startDay;
  for (let r = 0; r < 6; r++) {
    const week = [];
    for (let c = 0; c < 7; c++) {
      const d = new Date(viewYear, viewMonth, day);
      week.push({
        date: d,
        dayNum: d.getDate(),
        isCurrentMonth: d.getMonth() === viewMonth,
        ymd: dateToYMD(d),
      });
      day++;
    }
    rows.push(week);
  }
  return rows;
}

export default function DatePicker({
  value,
  onChange,
  name,
  id,
  label,
  required = false,
  error,
  placeholder = 'DD-MM-AAAA',
  disabled = false,
  className = '',
}) {
  const [inputDisplay, setInputDisplay] = useState('');
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth());
  const containerRef = useRef(null);

  const valueYMD = value && String(value).trim() ? value.trim() : '';

  useEffect(() => {
    setInputDisplay(valueYMD ? yyyyMMDDToDDMMYYYY(valueYMD) : '');
  }, [valueYMD]);

  useEffect(() => {
    if (valueYMD) {
      const d = parseDateYYYYMMDD(valueYMD);
      if (d) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
  }, [valueYMD]);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleInputChange = (e) => {
    const raw = e.target.value;
    const masked = maskDDMMYYYY(raw);
    setInputDisplay(masked);
    if (masked.length === 10 && isValidDDMMYYYY(masked)) {
      const ymd = ddmmYYYYToYYYYMMDD(masked);
      if (ymd) onChange(ymd);
    } else if (masked.length < 10) {
      onChange('');
    }
  };

  const handleInputBlur = () => {
    const trimmed = inputDisplay.trim();
    if (trimmed.length === 10) {
      if (isValidDDMMYYYY(trimmed)) {
        const ymd = ddmmYYYYToYYYYMMDD(trimmed);
        if (ymd) onChange(ymd);
      } else {
        setInputDisplay(valueYMD ? yyyyMMDDToDDMMYYYY(valueYMD) : '');
      }
    } else if (trimmed.length > 0) {
      setInputDisplay(valueYMD ? yyyyMMDDToDDMMYYYY(valueYMD) : '');
    }
  };

  const handleDaySelect = (ymd) => {
    onChange(ymd);
    setInputDisplay(yyyyMMDDToDDMMYYYY(ymd));
    setOpen(false);
  };

  const grid = getCalendarGrid(viewYear, viewMonth);
  const todayYMD = dateToYMD(new Date());

  return (
    <div className={className} ref={containerRef}>
      {label && (
        <label htmlFor={id || name} className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
          <CalendarIcon className="size-5" aria-hidden />
        </div>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          id={id || name}
          name={name}
          value={inputDisplay}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          maxLength={10}
          className={`block w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500 ${
            error ? 'border-red-400 bg-red-50/50' : 'border-slate-300 bg-white'
          }`}
        />
        {open && (
          <div className="absolute left-0 top-full z-50 mt-1.5 w-full min-w-[280px] max-w-[320px] rounded-xl border border-slate-200 bg-white py-3 shadow-lg">
            <div className="mb-2 flex items-center justify-between px-3">
              <button
                type="button"
                onClick={() => {
                  if (viewMonth === 0) {
                    setViewYear((y) => y - 1);
                    setViewMonth(11);
                  } else setViewMonth((m) => m - 1);
                }}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Mes anterior"
              >
                <span className="text-lg leading-none">‹</span>
              </button>
              <span className="text-sm font-semibold text-slate-800">
                {MONTHS[viewMonth]} {viewYear}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (viewMonth === 11) {
                    setViewYear((y) => y + 1);
                    setViewMonth(0);
                  } else setViewMonth((m) => m + 1);
                }}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Mes siguiente"
              >
                <span className="text-lg leading-none">›</span>
              </button>
            </div>
            <div className="grid grid-cols-7 gap-0.5 px-2">
              {WEEKDAYS.map((wd) => (
                <div
                  key={wd}
                  className="py-1 text-center text-[10px] font-medium uppercase tracking-wider text-slate-400"
                >
                  {wd}
                </div>
              ))}
              {grid.flat().map((cell) => {
                const isSelected = cell.ymd === valueYMD;
                const isToday = cell.ymd === todayYMD;
                return (
                  <button
                    key={cell.ymd}
                    type="button"
                    onClick={() => handleDaySelect(cell.ymd)}
                    className={`min-h-[32px] rounded-lg text-xs font-medium transition-colors ${
                      !cell.isCurrentMonth
                        ? 'text-slate-300'
                        : isSelected
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : isToday
                            ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                            : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {cell.dayNum}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
