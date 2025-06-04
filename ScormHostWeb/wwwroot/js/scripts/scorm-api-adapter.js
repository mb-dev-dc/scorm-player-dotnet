// SCORM 1.2 and 2004 API Adapter for Development
// Enhanced implementation with console logging and basic data storage

// Store SCORM data during the session
const scormData = {
  "cmi.core.lesson_status": "not attempted",
  "cmi.core.score.raw": "0",
  "cmi.core.score.min": "0",
  "cmi.core.score.max": "100",
  "cmi.core.lesson_location": "",
  "cmi.suspend_data": "",
  "cmi.core.entry": "ab-initio",
  "cmi.core.exit": "",
  "cmi.core.session_time": "00:00:00",
  // SCORM 2004 specific
  "cmi.completion_status": "not attempted",
  "cmi.success_status": "unknown",
  "cmi.score.scaled": "0"
};

// Helper function to log API calls during development
function logApiCall(version, func, args, result) {
  console.log(`SCORM ${version} | ${func}(${args ? args : ''}) => ${result}`);
}

// Extract query parameters (for courseId, userId etc.)
function getQueryParams() {
  const params = {};
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  
  // Common parameters we might need
  params.courseId = urlParams.get('courseId');
  params.userId = urlParams.get('userId');
  params.attemptId = urlParams.get('attemptId');
  
  return params;
}

// Save data to server
async function saveToServer(endpoint) {
  try {
    const params = getQueryParams();
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scormData)
    });

    if (!response.ok) {
      console.error(`Failed to save data to ${endpoint}:`, response.statusText);
      return false;
    }

    console.log(`Data successfully saved to ${endpoint}`);
    return true;
  } catch (err) {
    console.error(`Error saving to ${endpoint}:`, err);
    return false;
  }
}

// SCORM 1.2 API Implementation
window.API = {
  LMSInitialize: function(param) {
    logApiCall("1.2", "LMSInitialize", param, "true");
    return "true";
  },
  
  LMSFinish: async function(param) {
    // Save data when course finishes
    const params = getQueryParams();
    await saveToServer(`/api/scorm/attempts/${params.attemptId}/finish`);
    logApiCall("1.2", "LMSFinish", param, "true");
    return "true"; 
  },
  
  LMSGetValue: function(element) {
    const value = scormData[element] || "";
    logApiCall("1.2", "LMSGetValue", element, value);
    return value;
  },
  
  LMSSetValue: function(element, value) {
    scormData[element] = value;
    logApiCall("1.2", "LMSSetValue", `${element}, ${value}`, "true");
    return "true";
  },
  
  LMSCommit: async function(param) {
    // Save progress
    const params = getQueryParams();
    await saveToServer(`/api/scorm/attempts/${params.attemptId}/commit`);
    logApiCall("1.2", "LMSCommit", param, "true");
    return "true";
  },
  
  LMSGetLastError: function() {
    logApiCall("1.2", "LMSGetLastError", "", "0");
    return "0";
  },
  
  LMSGetErrorString: function(errorCode) {
    logApiCall("1.2", "LMSGetErrorString", errorCode, "No error");
    return "No error";
  },
  
  LMSGetDiagnostic: function(errorCode) {
    logApiCall("1.2", "LMSGetDiagnostic", errorCode, "No error");
    return "No error";
  }
};

// SCORM 2004 API Implementation
window.API_1484_11 = {
  Initialize: function(param) {
    logApiCall("2004", "Initialize", param, "true");
    return "true";
  },
  
  Terminate: async function(param) {
    // Save data when course terminates
    const params = getQueryParams();
    await saveToServer(`/api/scorm/attempts/${params.attemptId}/finish`);
    logApiCall("2004", "Terminate", param, "true");
    return "true";
  },
  
  GetValue: function(element) {
    const value = scormData[element] || "";
    logApiCall("2004", "GetValue", element, value);
    return value;
  },
  
  SetValue: function(element, value) {
    scormData[element] = value;
    logApiCall("2004", "SetValue", `${element}, ${value}`, "true");
    return "true";
  },
  
  Commit: async function(param) {
    // Save progress
    const params = getQueryParams();
    await saveToServer(`/api/scorm/attempts/${params.attemptId}/commit`);
    logApiCall("2004", "Commit", param, "true");
    return "true";
  },
  
  GetLastError: function() {
    logApiCall("2004", "GetLastError", "", "0");
    return "0";
  },
  
  GetErrorString: function(errorCode) {
    logApiCall("2004", "GetErrorString", errorCode, "No error");
    return "No error";
  },
  
  GetDiagnostic: function(errorCode) {
    logApiCall("2004", "GetDiagnostic", errorCode, "No error");
    return "No error";
  }
};

// Log when the SCORM APIs are ready
console.log("SCORM API adapters initialized for development mode");
console.log("Query parameters:", getQueryParams());

