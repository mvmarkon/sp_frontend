import { formatCurrency, formatDate } from './utils';

describe('formatCurrency', () => {
  it('should format a number as currency', () => {
    expect(formatCurrency(1234.56)).toBe('$' + '\u00A0' + '1.234,56');
  });

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('$' + '\u00A0' + '0,00');
  });

  it('should handle large numbers', () => {
    expect(formatCurrency(123456789.12)).toBe('$' + '\u00A0' + '123.456.789,12');
  });
});

describe('formatDate', () => {
  it('should format a date correctly', () => {
    expect(formatDate('2023-01-15T10:00:00Z')).toBe('15 de ene de 2023');
  });

  it('should handle different months', () => {
    expect(formatDate('2024-07-20T10:00:00Z')).toBe('20 de jul de 2024');
  });
});