/**
 * Format phone string to (XX) XXXXX-XXXX or (XX) XXXX-XXXX
 */
export function formatPhone(value) {
  if (!value) return '';
  const digits = value.replace(/\D/g, '').slice(0, 11);
  
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/**
 * Format ISO date string YYYY-MM-DD to DD/MM/YYYY
 */
export function formatDateToBR(isoString) {
  if (!isoString) return '';
  const parts = isoString.split('-');
  if (parts.length !== 3) return isoString;
  const [year, month, day] = parts;
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
}

/**
 * Format DD/MM/YYYY to ISO YYYY-MM-DD
 */
export function formatDateToISO(brString) {
  if (!brString) return '';
  const parts = brString.split('/');
  if (parts.length !== 3) return brString;
  const [day, month, year] = parts;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

/**
 * Normalize time string to HH:mm
 */
export function formatTime(timeString) {
  if (!timeString) return '';
  const parts = timeString.split(':');
  if (parts.length < 2) return timeString;
  return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
}
