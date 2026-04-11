// src/utils/holidayChecker.js

const APIVERVE_URL = 'https://api.apiverve.com/v1/worldholidays';

const toSafeDate = (value) => {
  if (value instanceof Date) return value;

  // Date input fields provide YYYY-MM-DD. Parse at local noon to avoid timezone drift.
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T12:00:00`);
  }

  return new Date(value);
};

export const isWeekend = (value) => {
  const date = toSafeDate(value);
  if (Number.isNaN(date.getTime())) return false;
  const day = date.getDay();
  return day === 0 || day === 6;
};

/**
 * Checks if a given date is a public holiday in Sri Lanka.
 * Always returns a boolean, never throws.
 * @param {Date} date - The date to check.
 * @returns {Promise<boolean>} - True if confirmed holiday, false otherwise.
 */
export const isHoliday = async (date) => {
  try {
    const safeDate = toSafeDate(date);
    if (Number.isNaN(safeDate.getTime())) return false;

    const apiKey = import.meta.env.VITE_HOLIDAY_API_KEY;
    if (!apiKey) {
      console.warn('⚠️ Holiday API key missing. Skipping validation.');
      return false;
    }

    const year = safeDate.getFullYear();
    const month = String(safeDate.getMonth() + 1).padStart(2, '0');
    const day = String(safeDate.getDate()).padStart(2, '0');
    const currentYear = new Date().getFullYear();

    // Free API may not have data for future years – skip check
    if (year > currentYear + 1) {
      console.log(`📅 Skipping holiday check for year ${year} (too far in future)`);
      return false;
    }

    const url = `${APIVERVE_URL}?country=LK&year=${year}&month=${month}&day=${day}`;
    console.log(`🌐 Checking holiday: ${safeDate.toISOString().split('T')[0]}`);

    const response = await fetch(url, {
      headers: { 'x-api-key': apiKey }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    // Apiverve returns { status: "error", error: "..." } for invalid requests
    if (data.status === 'error') {
      console.warn(`⚠️ Holiday API error: ${data.error}. Assuming non‑holiday.`);
      return false;
    }

    const isHolidayResult = data?.data?.isHoliday || false;
    console.log(`✅ Holiday check result: ${isHolidayResult}`);
    return isHolidayResult;
  } catch (error) {
    console.error('❌ Holiday API failed:', error.message);
    return false; // Always allow event creation on failure
  }
};

export const validateNormalEventDay = async (value) => {
  if (isWeekend(value)) {
    return {
      isValid: false,
      message: 'Events can only be created on normal weekdays (not Saturday/Sunday).',
    };
  }

  const holiday = await isHoliday(value);
  if (holiday) {
    return {
      isValid: false,
      message: 'Selected date is a Sri Lankan public holiday. Please choose a normal day.',
    };
  }

  return { isValid: true, message: '' };
};