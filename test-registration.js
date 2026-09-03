/**
 * DRAKEN'26 — Automated Registration Backend Test Suite
 * Validates Google Apps Script Web App Registration API Endpoint.
 * 
 * Usage:
 *   node test-registration.js
 */

const https = require('https');
const { URL } = require('url');

const ENDPOINT_URL = "https://script.google.com/macros/s/AKfycbxoBnam_fBf93tqijDs5bolZvuNsRGadmUE-CW6boewhrHf7FEiVdWueK54MZ7zPQqz/exec";

const TEST_PAYLOAD = {
    teamName: "DRAKEN-AUTO-TEST",
    technicalEvent: "UNVEIL",
    nonTechnicalEvent: "GAME VERSE",
    member1: {
        name: "DRAKEN Test Member 1",
        registerNumber: "TEST001",
        collegeName: "TEST COLLEGE",
        collegeCode: "TEST",
        email: "drakenece26@gmail.com",
        mobile: "9000000001"
    },
    member2: {
        name: "DRAKEN Test Member 2",
        registerNumber: "TEST002",
        collegeName: "TEST COLLEGE",
        collegeCode: "TEST",
        email: "sanjaykannan050@gmail.com",
        mobile: "9000000002"
    },
    rulesAccepted: true
};

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function sendRequestWithHttps(targetUrl, payload, redirectCount = 0) {
    return new Promise((resolve, reject) => {
        if (redirectCount > 5) return reject(new Error("Too many redirects"));

        const parsedUrl = new URL(targetUrl);
        const payloadStr = payload ? JSON.stringify(payload) : null;
        const method = payloadStr ? 'POST' : 'GET';

        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || 443,
            path: parsedUrl.pathname + parsedUrl.search,
            method: method,
            headers: {
                'User-Agent': USER_AGENT
            }
        };

        if (payloadStr) {
            options.headers['Content-Type'] = 'text/plain;charset=utf-8';
            options.headers['Content-Length'] = Buffer.byteLength(payloadStr);
        }

        const req = https.request(options, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                // Follow 302 redirect using GET without sending body again
                return sendRequestWithHttps(res.headers.location, null, redirectCount + 1)
                    .then(resolve)
                    .catch(reject);
            }

            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: body.trim() }));
        });

        req.on('error', reject);
        if (payloadStr) req.write(payloadStr);
        req.end();
    });
}

async function runRegistrationTest() {
    console.log("\n=======================================================");
    console.log(" 🐉 DRAKEN'26 — AUTOMATED REGISTRATION BACKEND TEST");
    console.log("=======================================================");
    console.log(`Target Endpoint: ${ENDPOINT_URL}`);
    console.log(`Payload Submitted:\n${JSON.stringify(TEST_PAYLOAD, null, 2)}\n`);

    try {
        const startTime = Date.now();
        console.log("▶ Sending HTTP POST request to Google Apps Script Web App...");

        const response = await sendRequestWithHttps(ENDPOINT_URL, TEST_PAYLOAD);
        const responseTime = Date.now() - startTime;

        console.log(`✔ HTTP Response Received (${response.status} OK) in ${responseTime}ms`);
        console.log(`✔ Raw Response Body: ${response.body}`);

        let data;
        try {
            data = JSON.parse(response.body);
        } catch (e) {
            throw new Error(`Failed to parse backend response as JSON. Raw body received:\n"${response.body}"`);
        }

        // Assertion Checks
        console.log("\n--- Executing Backend Assertions ---");

        const assertions = [
            {
                name: "1. HTTP status is 200 OK",
                pass: response.status === 200,
                error: `Expected 200, received ${response.status}`
            },
            {
                name: "2. Response is valid JSON object",
                pass: typeof data === 'object' && data !== null,
                error: "Response is not a valid JSON object"
            },
            {
                name: "3. success === true",
                pass: data.success === true,
                error: `Expected success === true, received ${data.success} (${data.message || 'No message'})`
            },
            {
                name: "4. registrationId exists",
                pass: typeof data.registrationId === 'string' && data.registrationId.length > 0,
                error: "registrationId is missing or empty"
            },
            {
                name: "5. registrationId starts with 'DRK26-'",
                pass: typeof data.registrationId === 'string' && data.registrationId.startsWith("DRK26-"),
                error: `Expected prefix 'DRK26-', received "${data.registrationId}"`
            },
            {
                name: "6. No unexpected backend error returned",
                pass: !data.error && (!data.message || data.message.toLowerCase().includes("success")),
                error: `Backend error reported: ${data.error || data.message}`
            }
        ];

        let allPassed = true;
        for (const check of assertions) {
            if (check.pass) {
                console.log(`  ✅ [PASS] ${check.name}`);
            } else {
                console.log(`  ❌ [FAIL] ${check.name} — ${check.error}`);
                allPassed = false;
            }
        }

        console.log("\n=======================================================");
        if (allPassed) {
            console.log(` 🎉 TEST RESULT: PASS`);
            console.log(` Generated Registration ID: ${data.registrationId}`);
            console.log(` Member 1 Email Submitted: ${TEST_PAYLOAD.member1.email}`);
            console.log(` Member 2 Email Submitted: ${TEST_PAYLOAD.member2.email}`);
            console.log("=======================================================");
            process.exit(0);
        } else {
            console.log(` 💥 TEST RESULT: FAIL`);
            console.log("=======================================================");
            process.exit(1);
        }

    } catch (err) {
        console.error("\n=======================================================");
        console.error(" 💥 TEST RESULT: FAIL (Network or Unexpected Exception)");
        console.error(` Error Details: ${err.message}`);
        console.error("=======================================================");
        process.exit(1);
    }
}

runRegistrationTest();
