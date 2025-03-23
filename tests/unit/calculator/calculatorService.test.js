import { calculateEndDate, calculateWorkingDays } from '../../../src/features/calculator/services/calculatorService';
import { getHolidaysForCountry } from '../../../src/features/holidays/services/holidayApiService';

jest.mock('../../../src/features/holidays/services/holidayApiService');

describe('calculatorService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('calculateEndDate', () => {
    it('should calculate end date correctly with no holidays', async () => {
      getHolidaysForCountry.mockResolvedValue([]);
      
      const result = await calculateEndDate('2024-01-01', 5, 'US');
      expect(result).toEqual(new Date('2024-01-05'));
    });

    it('should account for holidays in end date calculation', async () => {
      getHolidaysForCountry.mockResolvedValue([
        { date: '2024-01-01', name: 'New Year\'s Day' },
        { date: '2024-01-15', name: 'Martin Luther King Jr. Day' }
      ]);
      
      const result = await calculateEndDate('2024-01-01', 5, 'US');
      expect(result).toEqual(new Date('2024-01-08'));
    });

    it('should handle multiple years', async () => {
      getHolidaysForCountry.mockResolvedValue([]);
      
      const result = await calculateEndDate('2023-12-28', 10, 'US');
      expect(result).toEqual(new Date('2024-01-11'));
    });

    it('should throw error if start date is invalid', async () => {
      await expect(calculateEndDate('invalid-date', 5, 'US'))
        .rejects
        .toThrow('Invalid start date');
    });

    it('should throw error if working days is invalid', async () => {
      await expect(calculateEndDate('2024-01-01', 0, 'US'))
        .rejects
        .toThrow('Invalid number of working days');
    });
  });

  describe('calculateWorkingDays', () => {
    it('should calculate working days correctly with no holidays', async () => {
      getHolidaysForCountry.mockResolvedValue([]);
      
      const result = await calculateWorkingDays('2024-01-01', '2024-01-05', 'US');
      expect(result).toBe(5);
    });

    it('should account for holidays in working days calculation', async () => {
      getHolidaysForCountry.mockResolvedValue([
        { date: '2024-01-01', name: 'New Year\'s Day' },
        { date: '2024-01-15', name: 'Martin Luther King Jr. Day' }
      ]);
      
      const result = await calculateWorkingDays('2024-01-01', '2024-01-10', 'US');
      expect(result).toBe(7);
    });

    it('should handle multiple years', async () => {
      getHolidaysForCountry.mockResolvedValue([]);
      
      const result = await calculateWorkingDays('2023-12-28', '2024-01-11', 'US');
      expect(result).toBe(10);
    });

    it('should throw error if start date is invalid', async () => {
      await expect(calculateWorkingDays('invalid-date', '2024-01-05', 'US'))
        .rejects
        .toThrow('Invalid start date');
    });

    it('should throw error if end date is invalid', async () => {
      await expect(calculateWorkingDays('2024-01-01', 'invalid-date', 'US'))
        .rejects
        .toThrow('Invalid end date');
    });

    it('should throw error if end date is before start date', async () => {
      await expect(calculateWorkingDays('2024-01-05', '2024-01-01', 'US'))
        .rejects
        .toThrow('End date must be after start date');
    });
  });
}); 