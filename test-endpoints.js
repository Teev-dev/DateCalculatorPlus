const http = require('http');

// Configuration
const ENDPOINTS = [
  { url: 'http://localhost:3000', name: 'Test Server Homepage' },
  { url: 'http://localhost:3000/api/status', name: 'Test Server API Status' },
  { url: 'http://localhost:8080', name: 'Main Server Homepage' },
  { url: 'http://localhost:8080/api/status', name: 'Main Server API Status' },
  { url: 'http://localhost:8080/api/test', name: 'Main Server Test Endpoint' }
];

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

/**
 * Make an HTTP request to the given URL
 * @param {string} url - The URL to request
 * @returns {Promise<Object>} - Resolution with response data or rejection with error
 */
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const timeStart = new Date().getTime();
    
    const req = http.get(url, (res) => {
      const { statusCode } = res;
      const contentType = res.headers['content-type'];
      const timeEnd = new Date().getTime();
      const responseTime = timeEnd - timeStart;

      let error;
      // Verify status code
      if (statusCode !== 200) {
        error = new Error(`Request Failed. Status Code: ${statusCode}`);
      }
      
      if (error) {
        // Consume response data to free up memory
        res.resume();
        reject({ error, statusCode, responseTime });
        return;
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          let parsedData;
          if (contentType && contentType.includes('application/json')) {
            parsedData = JSON.parse(rawData);
          } else {
            // For HTML or other content types, just use the first 100 characters
            parsedData = rawData.substring(0, 100) + '... [truncated]';
          }
          resolve({ 
            data: parsedData, 
            statusCode, 
            contentType, 
            responseTime 
          });
        } catch (e) {
          reject({ error: e, statusCode, responseTime });
        }
      });
    });

    req.on('error', (e) => {
      reject({ error: e });
    });

    // Set a timeout for the request
    req.setTimeout(5000, () => {
      req.abort();
      reject({ error: new Error('Request timed out') });
    });
  });
}

/**
 * Test all endpoints and display results
 */
async function testAllEndpoints() {
  console.log(`\n${colors.cyan}=============================================`);
  console.log(`${colors.cyan}      DATECALCULATOR PLUS ENDPOINT TEST      `);
  console.log(`${colors.cyan}=============================================\n`);
  
  console.log(`${colors.white}Testing ${ENDPOINTS.length} endpoints...\n`);
  
  for (const endpoint of ENDPOINTS) {
    process.stdout.write(`${colors.yellow}Testing ${endpoint.name} (${endpoint.url})... `);
    
    try {
      const result = await makeRequest(endpoint.url);
      
      console.log(`${colors.green}SUCCESS ${colors.reset}`);
      console.log(`${colors.white}  Status: ${result.statusCode}`);
      console.log(`${colors.white}  Response Time: ${result.responseTime}ms`);
      console.log(`${colors.white}  Content Type: ${result.contentType || 'unknown'}`);
      
      if (result.data) {
        if (typeof result.data === 'object') {
          console.log(`${colors.white}  Data: ${JSON.stringify(result.data, null, 2).substring(0, 200)}`);
        } else {
          console.log(`${colors.white}  Data: ${result.data}`);
        }
      }
    } catch (err) {
      if (err.statusCode) {
        console.log(`${colors.red}FAILED ${colors.reset}`);
        console.log(`${colors.white}  Status: ${err.statusCode}`);
        console.log(`${colors.white}  Response Time: ${err.responseTime}ms`);
        console.log(`${colors.red}  Error: ${err.error.message}`);
      } else {
        console.log(`${colors.red}ERROR ${colors.reset}`);
        console.log(`${colors.red}  ${err.error.message}`);
      }
    }
    
    console.log(''); // Empty line between endpoints
  }
  
  console.log(`${colors.cyan}=============================================`);
  console.log(`${colors.cyan}               TEST COMPLETE                `);
  console.log(`${colors.cyan}=============================================\n`);
}

testAllEndpoints().catch(err => {
  console.error(`${colors.red}Unhandled error:`, err);
}); 