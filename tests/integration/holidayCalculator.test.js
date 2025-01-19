import { getHolidaysForCountry } from '../../src/features/holidays/services/holidayApiService';
import { calculateEndDate, calculateWorkingDays } from '../../src/features/calculator/services/calculatorService';

describe('Holiday Calculator Integration', () => {
  // Use a real API call for integration tests
  const realFetch = global.fetch;
  
  beforeAll(() => {
    // Restore the real fetch for integration tests
    global.fetch = realFetch;
  });

  describe('End-to-end calculation flow', () => {
    it('should calculate end date with real holidays', async () => {
      const startDate = new Date('2024-01-01');
      const workingDays = 10;
      const country = 'US';

      const result = await calculateEndDate(startDate, workingDays, country);

      expect(result).toEqual(expect.objectContaining({
        endDate: expect.any(Date),
        actualWorkingDays: workingDays,
        holidays: expect.arrayContaining([
          expect.objectContaining({
            date: expect.any(Date),
            name: expect.any(String),
            type: expect.any(String)
          })
        ])
      }));
    });

    it('should calculate working days between dates with real holidays', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      const country = 'US';

      const result = await calculateWorkingDays(startDate, endDate, country);

      expect(result).toEqual(expect.objectContaining({
        workingDays: expect.any(Number),
        holidays: expect.arrayContaining([
          expect.objectContaining({
            date: expect.any(Date),
            name: expect.any(String),
            type: expect.any(String)
          })
        ])
      }));
    });
  });

  describe('Holiday API integration', () => {
    it('should fetch real holidays for a country', async () => {
      const country = 'US';
      const year = new Date().getFullYear();

      const holidays = await getHolidaysForCountry(country, year);

      expect(holidays).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            date: expect.any(Date),
            name: expect.any(String),
            localName: expect.any(String),
            countryCode: country,
            fixed: expect.any(Boolean),
            global: expect.any(Boolean),
            type: expect.any(String)
          })
        ])
      );
    });

    it('should handle invalid country codes gracefully', async () => {
      await expect(getHolidaysForCountry('INVALID'))
        .rejects
        .toThrow('Invalid country code');
    });
  });

  describe('End-to-end calculation scenarios', () => {
    it('should handle year transitions correctly', async () => {
      const startDate = new Date('2023-12-20');
      const workingDays = 15;
      const country = 'US';

      const result = await calculateEndDate(startDate, workingDays, country);

      expect(result).toEqual(expect.objectContaining({
        endDate: expect.any(Date),
        actualWorkingDays: workingDays,
        holidays: expect.arrayContaining([
          expect.objectContaining({
            date: expect.any(Date),
            name: expect.any(String)
          })
        ])
      }));
    });

    it('should calculate working days across multiple months', async () => {
      const startDate = new Date('2024-01-15');
      const endDate = new Date('2024-03-15');
      const country = 'US';

      const result = await calculateWorkingDays(startDate, endDate, country);

      expect(result.workingDays).toBeGreaterThan(0);
      expect(result.holidays.length).toBeGreaterThan(0);
    });
  });
}); 