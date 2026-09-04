/**
 * DRAKEN'26 — Google Apps Script Registration Backend
 * 
 * Instructions:
 * 1. Open Google Sheets -> Extensions -> Apps Script.
 * 2. Replace Code.gs with this file's contents.
 * 3. Click 'Deploy' -> 'New Deployment'.
 * 4. Select type 'Web app'.
 * 5. Execute as: 'Me' (your account).
 * 6. Who has access: 'Anyone'.
 * 7. Deploy and copy the Web App URL into js/config.js (API_URL).
 */

// Master sheet names
const SHEET_ALL = "All Registrations";
const SHEET_AAMEC = "AAMEC Registrations";
const SHEET_OTHER = "Other College Registrations";

// Capacity limits
const MAX_TOTAL_TEAMS = 60;
const MAX_AAMEC_SLOTS = 20;
const MAX_OTHER_SLOTS = 40;
const MAX_EVENT_AAMEC = 5;
const MAX_EVENT_OTHER = 15;

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    // Acquire lock for up to 10 seconds to prevent race conditions during registration
    lock.waitLock(10000);
  } catch (err) {
    return createJsonResponse({
      success: false,
      message: "Server busy. Please try submitting again in a moment."
    });
  }

  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Ensure sheets exist
    const allSheet = getOrCreateSheet(ss, SHEET_ALL);
    const aamecSheet = getOrCreateSheet(ss, SHEET_AAMEC);
    const otherSheet = getOrCreateSheet(ss, SHEET_OTHER);

    // Read existing data for duplicate checks & capacity checks
    const allData = allSheet.getDataRange().getValues();
    
    // Header check / creation
    if (allData.length === 0 || allData[0][0] !== "Registration ID") {
      const headers = [
        "Registration ID",
        "Team Name",
        "College Type",
        "College Name",
        "College Code",
        "Technical Event",
        "Non-Technical Event",
        "Member 1 Name",
        "Member 1 Register Number",
        "Member 1 Email",
        "Member 1 Mobile",
        "Member 2 Name",
        "Member 2 Register Number",
        "Member 2 Email",
        "Member 2 Mobile",
        "Registration Date/Time"
      ];
      allSheet.appendRow(headers);
      aamecSheet.appendRow(headers);
      otherSheet.appendRow(headers);
    }

    const rows = allSheet.getDataRange().getValues().slice(1); // Exclude header

    // ── 1. DUPLICATE VALIDATION ────────────────────────────
    const teamNameLower = data.teamName.trim().toLowerCase();
    const m1RegLower = data.member1.regNo.trim().toLowerCase();
    const m2RegLower = data.member2.regNo.trim().toLowerCase();
    const m1EmailLower = data.member1.email.trim().toLowerCase();
    const m2EmailLower = data.member2.email.trim().toLowerCase();

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const existingTeam = String(row[1]).trim().toLowerCase();
      const existingM1Reg = String(row[8]).trim().toLowerCase();
      const existingM1Email = String(row[9]).trim().toLowerCase();
      const existingM2Reg = String(row[12]).trim().toLowerCase();
      const existingM2Email = String(row[13]).trim().toLowerCase();

      if (existingTeam === teamNameLower) {
        return createJsonResponse({
          success: false,
          field: "teamName",
          message: "Team name already taken."
        });
      }

      if (existingM1Reg === m1RegLower || existingM2Reg === m1RegLower) {
        return createJsonResponse({
          success: false,
          field: "m1RegNo",
          message: "Member 1's register number is already registered."
        });
      }

      if (existingM1Reg === m2RegLower || existingM2Reg === m2RegLower) {
        return createJsonResponse({
          success: false,
          field: "m2RegNo",
          message: "Member 2's register number is already registered."
        });
      }

      if (existingM1Email === m1EmailLower || existingM2Email === m1EmailLower) {
        return createJsonResponse({
          success: false,
          field: "m1Email",
          message: "Member 1's email ID is already registered."
        });
      }

      if (existingM1Email === m2EmailLower || existingM2Email === m2EmailLower) {
        return createJsonResponse({
          success: false,
          field: "m2Email",
          message: "Member 2's email ID is already registered."
        });
      }
    }

    // ── 2. CAPACITY VALIDATION ──────────────────────────────
    const isAamec = (data.member1.collegeType === "AAMEC" && data.member1.collegeCode === "8204") ||
                    (data.member2.collegeType === "AAMEC" && data.member2.collegeCode === "8204");
    
    const collegeCategory = isAamec ? "AAMEC" : "Other";

    let aamecCount = 0;
    let otherCount = 0;
    let techEventCount = 0;
    let nonTechEventCount = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowCollegeType = row[2];
      const rowTechEvent = row[5];
      const rowNonTechEvent = row[6];

      if (rowCollegeType === "AAMEC") {
        aamecCount++;
        if (rowTechEvent === data.technicalEvent) techEventCount++;
        if (rowNonTechEvent === data.nonTechnicalEvent) nonTechEventCount++;
      } else {
        otherCount++;
        if (rowTechEvent === data.technicalEvent) techEventCount++;
        if (rowNonTechEvent === data.nonTechnicalEvent) nonTechEventCount++;
      }
    }

    if (isAamec) {
      if (aamecCount >= MAX_AAMEC_SLOTS) {
        return createJsonResponse({
          success: false,
          message: "AAMEC registration capacity (20 slots) has been reached."
        });
      }
      if (techEventCount >= MAX_EVENT_AAMEC) {
        return createJsonResponse({
          success: false,
          field: "techEvent",
          message: `Slot allocation reached for ${data.technicalEvent} (AAMEC category).`
        });
      }
      if (nonTechEventCount >= MAX_EVENT_AAMEC) {
        return createJsonResponse({
          success: false,
          field: "nonTechEvent",
          message: `Slot allocation reached for ${data.nonTechnicalEvent} (AAMEC category).`
        });
      }
    } else {
      if (otherCount >= MAX_OTHER_SLOTS) {
        return createJsonResponse({
          success: false,
          message: "Other College registration capacity (40 slots) has been reached."
        });
      }
      if (techEventCount >= MAX_EVENT_OTHER) {
        return createJsonResponse({
          success: false,
          field: "techEvent",
          message: `Slot allocation reached for ${data.technicalEvent} (Other College category).`
        });
      }
      if (nonTechEventCount >= MAX_EVENT_OTHER) {
        return createJsonResponse({
          success: false,
          field: "nonTechEvent",
          message: `Slot allocation reached for ${data.nonTechnicalEvent} (Other College category).`
        });
      }
    }

    // ── 3. GENERATE REGISTRATION ID ─────────────────────────
    const regNum = String(rows.length + 1).padStart(3, "0");
    const registrationId = "DRK26-" + (isAamec ? "A" : "O") + "-" + regNum;
    const timestamp = new Date().toISOString();

    const newRow = [
      registrationId,
      data.teamName,
      collegeCategory,
      data.member1.collegeName,
      data.member1.collegeCode,
      data.technicalEvent,
      data.nonTechnicalEvent,
      data.member1.name,
      data.member1.regNo,
      data.member1.email,
      data.member1.mobile,
      data.member2.name,
      data.member2.regNo,
      data.member2.email,
      data.member2.mobile,
      timestamp
    ];

    // Append to Master Sheet
    allSheet.appendRow(newRow);

    // Append to specific category sheet
    if (isAamec) {
      aamecSheet.appendRow(newRow);
    } else {
      otherSheet.appendRow(newRow);
    }

    // ── 4. SEND CONFIRMATION EMAIL ──────────────────────────
    sendConfirmationEmails(data, registrationId, isAamec);

    return createJsonResponse({
      success: true,
      registrationId: registrationId,
      message: "Registration successful."
    });

  } catch (error) {
    return createJsonResponse({
      success: false,
      message: "An internal server error occurred: " + error.message
    });
  } finally {
    lock.releaseLock();
  }
}

function sendConfirmationEmails(data, registrationId, isAamec) {
  const foodInfo = isAamec
    ? "AAMEC students are not included in the provided food arrangements."
    : "Food and refreshment will be provided at the campus for external participants.";

  const bodyHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; color: #111; line-height: 1.6;">
      <h2 style="color: #c9a84c; border-bottom: 2px solid #c9a84c; padding-bottom: 8px;">DRAKEN'26 Registration Confirmation</h2>
      <p>Dear <strong>${data.teamName}</strong>,</p>
      <p>Your team registration for <strong>DRAKEN'26 — National Level Technical Symposium</strong> has been confirmed!</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Registration ID:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee; color: #c9a84c;"><strong>${registrationId}</strong></td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Team Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.teamName}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Technical Event:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.technicalEvent}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Non-Technical Event:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.nonTechnicalEvent}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Member 1:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.member1.name} (${data.member1.regNo})</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Member 2:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.member2.name} (${data.member2.regNo})</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Date:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">26 September 2026</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Venue:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">Anjalai Ammal Mahalingam Engineering College, Kovilvenni</td></tr>
      </table>

      <p style="background: #f9f9f9; padding: 12px; border-left: 3px solid #c9a84c; font-size: 0.9em;">
        <strong>Food Information:</strong> ${foodInfo}
      </p>

      <p style="font-size: 0.85em; color: #555;">
        * For UNVEIL (Paper Presentation), please send your presentation abstract to <a href="mailto:drakenece2026@gmail.com">drakenece2026@gmail.com</a> at least 1 week prior to the event.
      </p>

      <p style="margin-top: 30px; font-size: 0.8em; color: #888;">
        DRAKEN'26 Organizing Committee<br>
        Anjalai Ammal Mahalingam Engineering College
      </p>
    </div>
  `;

  const recipients = [data.member1.email, data.member2.email].join(",");

  try {
    MailApp.sendEmail({
      to: recipients,
      subject: `DRAKEN'26 Registration Confirmation — ${registrationId}`,
      htmlBody: bodyHtml
    });
  } catch (e) {
    Logger.log("Email error: " + e.message);
  }
}

function getOrCreateSheet(ss, name) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
