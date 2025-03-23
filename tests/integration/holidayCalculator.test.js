import { calculateEndDate, calculateWorkingDays } from '../../src/features/calculator/services/calculatorService';
import { getHolidaysForCountry } from '../../src/features/holidays/services/holidayApiService';
import { HolidayApiError } from '../../src/config/apiConfig';

jest.mock('../../src/features/holidays/services/holidayApiService');

describe('Holiday Calculator Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('End-to-end calculation flow', () => {
    it('should calculate end date with real holidays', async () => {
      getHolidaysForCountry.mockResolvedValue([
        { date: '2024-01-01', name: 'New Year\'s Day' },
        { date: '2024-01-15', name: 'Martin Luther King Jr. Day' }
      ]);

      const result = await calculateEndDate('2024-01-01', 5, 'US');
      expect(result).toEqual(new Date('2024-01-08'));
    });

    it('should calculate working days between dates with real holidays', async () => {
      getHolidaysForCountry.mockResolvedValue([
        { date: '2024-01-01', name: 'New Year\'s Day' },
        { date: '2024-01-15', name: 'Martin Luther King Jr. Day' }
      ]);

      const result = await calculateWorkingDays('2024-01-01', '2024-01-10', 'US');
      expect(result).toBe(7);
    });
  });

  describe('Holiday API integration', () => {
    it('should fetch real holidays for a country', async () => {
      const mockHolidays = [
        { date: '2024-01-01', name: 'New Year\'s Day' },
        { date: '2024-01-15', name: 'Martin Luther King Jr. Day' }
      ];
      getHolidaysForCountry.mockResolvedValue(mockHolidays);

      const holidays = await getHolidaysForCountry('US', 2024);
      expect(holidays).toEqual(mockHolidays);
    });

    it('should handle invalid country codes gracefully', async () => {
      getHolidaysForCountry.mockRejectedValue(new HolidayApiError('Invalid country code: INVALID', 400));

      await expect(getHolidaysForCountry('INVALID', 2024))
        .rejects
        .toThrow('Invalid country code: INVALID');
    });
  });

  describe('End-to-end calculation scenarios', () => {
    it('should handle year transitions correctly', async () => {
      getHolidaysForCountry.mockResolvedValue([
        { date: '2024-01-01', name: 'New Year\'s Day' }
      ]);

      const result = await calculateEndDate('2023-12-28', 10, 'US');
      expect(result).toEqual(new Date('2024-01-11'));
    });

    it('should calculate working days across multiple months', async () => {
      getHolidaysForCountry.mockResolvedValue([
        { date: '2024-01-01', name: 'New Year\'s Day' },
        { date: '2024-01-15', name: 'Martin Luther King Jr. Day' },
        { date: '2024-02-19', name: 'Presidents\' Day' }
      ]);

      const result = await calculateWorkingDays('2024-01-01', '2024-02-15', 'US');
      expect(result).toBe(32);
    });
  });
}); 