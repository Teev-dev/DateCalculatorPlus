import { calculateEndDate, calculateWorkingDays } from '../../../src/features/calculator/services/calculatorService';
import { getHolidaysForCountry } from '../../../src/features/holidays/services/holidayApiService';

// Mock the holiday service
jest.mock('../../../src/features/holidays/services/holidayApiService');

describe('calculatorService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('calculateEndDate', () => {
    const mockHolidays = [
      {
        date: new Date('2024-01-01'),
        name: "New Year's Day",
        type: 'Public'
      },
      {
        date: new Date('2024-01-15'),
        name: "Martin Luther King Jr. Day",
        type: 'Public'
      }
    ];

    beforeEach(() => {
      getHolidaysForCountry.mockResolvedValue(mockHolidays);
    });

    it('should calculate end date correctly with no holidays', async () => {
      getHolidaysForCountry.mockResolvedValue([]);
      const startDate = new Date('2024-01-01');
      const workingDays = 5;

      const result = await calculateEndDate(startDate, workingDays, 'US');
      
      // Should be Jan 8th (skipping weekend days)
      expect(result.endDate).toEqual(new Date('2024-01-08'));
      expect(result.actualWorkingDays).toBe(5);
      expect(result.holidays).toEqual([]);
    });

    it('should account for holidays in end date calculation', async () => {
      const startDate = new Date('2024-01-01');
      const workingDays = 5;

      const result = await calculateEndDate(startDate, workingDays, 'US');
      
      // Should be Jan 10th (skipping weekends and 2 holidays)
      // Jan 1 (holiday), Jan 2-5 (4 working days), Jan 6-7 (weekend), Jan 8-9, Jan 10 (5th working day)
      expect(result.endDate).toEqual(new Date('2024-01-10'));
      expect(result.actualWorkingDays).toBe(5);
      expect(result.holidays).toEqual(mockHolidays);
    });

    it('should handle multiple years', async () => {
      const startDate = new Date('2023-12-28');
      const workingDays = 10;
      const mockHolidays2023 = [];
      const mockHolidays2024 = mockHolidays;

      // Mock holidays for both years
      getHolidaysForCountry
        .mockResolvedValueOnce(mockHolidays2023)
        .mockResolvedValueOnce(mockHolidays2024);

      const result = await calculateEndDate(startDate, workingDays, 'US');
      
      // Dec 28-29 (2 days), Jan 2-5 (4 days), Jan 8-9 (2 days), Jan 10-11 (2 days)
      expect(result.endDate).toEqual(new Date('2024-01-11'));
      expect(result.actualWorkingDays).toBe(10);
      expect(result.holidays).toEqual(mockHolidays2024);
    });

    it('should throw error if start date is invalid', async () => {
      await expect(calculateEndDate(null, 5, 'US'))
        .rejects
        .toThrow('Invalid start date');
    });

    it('should throw error if working days is invalid', async () => {
      await expect(calculateEndDate(new Date(), -1, 'US'))
        .rejects
        .toThrow('Invalid number of working days');
    });
  });

  describe('calculateWorkingDays', () => {
    const mockHolidays = [
      {
        date: new Date('2024-01-01'),
        name: "New Year's Day",
        type: 'Public'
      },
      {
        date: new Date('2024-01-15'),
        name: "Martin Luther King Jr. Day",
        type: 'Public'
      }
    ];

    beforeEach(() => {
      getHolidaysForCountry.mockResolvedValue(mockHolidays);
    });

    it('should calculate working days correctly with no holidays', async () => {
      getHolidaysForCountry.mockResolvedValue([]);
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-08');

      const result = await calculateWorkingDays(startDate, endDate, 'US');
      
      expect(result.workingDays).toBe(5); // 5 weekdays between dates
      expect(result.holidays).toEqual([]);
    });

    it('should account for holidays in working days calculation', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-10');

      const result = await calculateWorkingDays(startDate, endDate, 'US');
      
      // Jan 1 (holiday), Jan 2-5 (4 days), Jan 8-10 (3 days), minus 1 holiday = 5 working days
      expect(result.workingDays).toBe(5);
      expect(result.holidays).toEqual(mockHolidays);
    });

    it('should handle multiple years', async () => {
      const startDate = new Date('2023-12-28');
      const endDate = new Date('2024-01-15');
      const mockHolidays2023 = [];
      const mockHolidays2024 = mockHolidays;

      // Mock holidays for both years
      getHolidaysForCountry
        .mockResolvedValueOnce(mockHolidays2023)
        .mockResolvedValueOnce(mockHolidays2024);

      const result = await calculateWorkingDays(startDate, endDate, 'US');
      
      // Dec 28-29 (2 days), Jan 2-5 (4 days), Jan 8-12 (5 days), minus 1 holiday = 10 working days
      expect(result.workingDays).toBe(10);
      expect(result.holidays).toEqual(mockHolidays2024);
    });

    it('should throw error if start date is invalid', async () => {
      await expect(calculateWorkingDays(null, new Date(), 'US'))
        .rejects
        .toThrow('Invalid start date');
    });

    it('should throw error if end date is invalid', async () => {
      await expect(calculateWorkingDays(new Date(), null, 'US'))
        .rejects
        .toThrow('Invalid end date');
    });

    it('should throw error if end date is before start date', async () => {
      const startDate = new Date('2024-01-10');
      const endDate = new Date('2024-01-01');

      await expect(calculateWorkingDays(startDate, endDate, 'US'))
        .rejects
        .toThrow('End date must be after start date');
    });
  });
}); 