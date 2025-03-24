# DateCalculatorPlus Server Testing Guide

This guide provides step-by-step instructions for testing the DateCalculatorPlus server and application, based on the fixes we've implemented for the 403 Forbidden errors.

## 1. Start Test Server

First, let's start the test server to verify basic connectivity:

```bash
node test-server.js
```

You should see output similar to:
```
======================================
🟢 DATECALCULATOR PLUS TEST SERVER
======================================
✅ Port: 3000
✅ URL: http://localhost:3000
✅ API: http://localhost:3000/api/status
======================================
```

## 2. Verify Test Server Functionality

Open a new terminal window and run:

```bash
curl http://localhost:3000/api/status
```

You should see a JSON response similar to:
```json
{
  "success": true,
  "message": "DateCalculatorPlus API is working",
  "timestamp": "2023-03-23T10:15:30.123Z",
  "environment": "development",
  "request": {
    "path": "/api/status",
    "method": "GET",
    "headers": { ... }
  }
}
```

## 3. Start Main Server

In a new terminal window (or stop the test server with Ctrl+C first), start the main server:

```bash
npm run dev
```

You should see output similar to:
```
Server running on port 8080
- Local URL: http://localhost:8080
- API status: http://localhost:8080/api/status
- Test endpoint: http://localhost:8080/api/test
```

## 4. Verify Main Server Functionality

Run these commands to test main server endpoints:

```bash
# Test API status endpoint
curl http://localhost:8080/api/status

# Test API test endpoint
curl http://localhost:8080/api/test
```

## 5. Browser Testing

For browser-based testing, open `browser-test.html` in your web browser. This page provides buttons to test all server endpoints and displays the results.

Alternatively, you can access the application directly:

1. Test server: http://localhost:3000
2. Main server: http://localhost:8080

## 6. Test Frontend Functionality

Once the server is running correctly, test these core functionalities:

1. **Date Calculator:**
   - Select a start date and end date
   - Choose calculation units (days, weeks, months, years)
   - Toggle exclude weekends and holidays options
   - Verify calculation results

2. **Date Adder:**
   - Select a start date
   - Add/subtract time periods in different units
   - Verify result date

3. **Timezone Converter:**
   - Select a date and time
   - Convert between timezones
   - Verify converted time

4. **Holiday Calculator:**
   - Select a date range
   - Choose a region
   - View holidays in the selected range

## 7. API Testing

Test API endpoints with different parameters:

```bash
# Get date difference
curl "http://localhost:8080/api/calculate/difference?start=2023-01-01&end=2023-12-31&unit=days"

# Add to date
curl "http://localhost:8080/api/calculate/add?date=2023-01-01&amount=30&unit=days"

# Get holidays
curl "http://localhost:8080/api/holidays?region=US&start=2023-01-01&end=2023-12-31"
```

## 8. Test Error Handling

Intentionally create errors to verify error handling:

1. Request invalid endpoints:
   ```bash
   curl http://localhost:8080/api/nonexistent
   ```

2. Provide invalid parameters:
   ```bash
   curl "http://localhost:8080/api/calculate/difference?start=invalid-date&end=2023-12-31"
   ```

## 9. Server-Side Performance Testing

Run a simple load test using Apache Bench (if installed):

```bash
ab -n 100 -c 10 http://localhost:8080/api/status
```

## Troubleshooting

If you encounter issues during testing:

1. **Connection Refused:**
   - Verify the server is running
   - Check if the port is correct
   - Run `lsof -i :8080` to see if the port is in use

2. **403 Forbidden:**
   - Run the diagnostic tools:
     ```bash
     npm run debug
     npm run fix-env
     npm run fix-replit
     ```

3. **404 Not Found:**
   - Verify the endpoint URL is correct
   - Check server logs for routing issues

4. **500 Server Error:**
   - Check server logs for error messages
   - Verify database connection (if applicable)

## Success Criteria

Your server is working correctly if:

1. All API endpoints return 200 OK responses
2. Browser test page shows green success indicators
3. Core functionality works as expected
4. Error handling properly manages invalid inputs
5. No 403 Forbidden errors appear

## Next Steps

After successful testing:

1. Implement persistence with database integration
2. Add user authentication
3. Complete remaining calculator components
4. Enhance visualization features 