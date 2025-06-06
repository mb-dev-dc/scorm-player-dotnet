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

// Update getQueryParams to work correctly whether in main window or iframe
function getQueryParams() {
  const params = {};
  
  try {
    // Determine if we're in an iframe
    const isInIframe = window !== window.parent;
    console.log("Is running in iframe:", isInIframe);
    
    let queryString = '';
    
    if (isInIframe) {
      // We're in the iframe, so we need to parse our own location
      queryString = window.location.search;
      console.log("Iframe query string:", queryString);
    } else {
      // We're in the parent window, so we need to get the iframe's src
      const iframe = document.getElementById('scorm-content');
      if (iframe) {
        const src = iframe.getAttribute('src');
        console.log("Iframe src attribute:", src);
        
        // Extract query string from src
        const queryIndex = src.indexOf('?');
        if (queryIndex !== -1) {
          queryString = src.substring(queryIndex);
        }
      }
    }
    
    console.log("Using query string:", queryString);
    
    // Ensure any HTML entities are decoded
    queryString = queryString.replace(/&amp;/g, '&');
    
    // Parse the query string manually to avoid encoding issues
    if (queryString && queryString.length > 1) {
      const paramPairs = queryString.substring(1).split('&');
      for (let i = 0; i < paramPairs.length; i++) {
        const pair = paramPairs[i].split('=');
        if (pair.length === 2) {
          const key = decodeURIComponent(pair[0]);
          const value = decodeURIComponent(pair[1]);
          params[key] = value;
        }
      }
    }
    
    console.log("Extracted parameters:", params);
  } catch (error) {
    console.error("Error extracting query parameters:", error);
  }
  
  return params;
}

// Update saveToServer to send the SCORM data as the root object
async function saveToServer(endpoint) {
  try {
    const params = getQueryParams();

    // Check if attemptId is valid
    if (!params.attemptId) {
      console.error("Attempt ID is missing. Cannot save data.");
      return false;
    }

    // Format the data as expected by the server
    const dataToSend = {};
    dataToSend.core = {};
    if (scormData["cmi.core.lesson_status"]) dataToSend.core.lesson_status = scormData["cmi.core.lesson_status"];
    if (scormData["cmi.core.lesson_location"]) dataToSend.core.lesson_location = scormData["cmi.core.lesson_location"];
    if (scormData["cmi.core.session_time"]) dataToSend.core.session_time = scormData["cmi.core.session_time"];
    if (scormData["cmi.core.exit"]) dataToSend.core.exit = scormData["cmi.core.exit"];
    dataToSend.core.score = {};
    if (scormData["cmi.core.score.raw"]) dataToSend.core.score.raw = scormData["cmi.core.score.raw"];
    if (scormData["cmi.core.score.min"]) dataToSend.core.score.min = scormData["cmi.core.score.min"];
    if (scormData["cmi.core.score.max"]) dataToSend.core.score.max = scormData["cmi.core.score.max"];
    if (scormData["cmi.suspend_data"]) dataToSend.suspend_data = scormData["cmi.suspend_data"];

    // Critical - Construct the request body to exactly match the PayloadWrapper expectation
    const requestBody = {
      payload: dataToSend
    };

    console.log("Sending data to server:", endpoint);
    console.log("Request body:", JSON.stringify(requestBody));

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      let errorDetails = "";
      try {
        // Try to parse error as JSON first
        const errorJson = await response.json();
        errorDetails = JSON.stringify(errorJson);
      } catch (err) {
        // If JSON parsing fails, try as text
        try {
          errorDetails = await response.text();
        } catch (textErr) {
          errorDetails = "Could not read error details";
        }
      }
      console.error(`Failed to save data to ${endpoint}: ${response.status} ${response.statusText}`);
      console.error("Error details:", errorDetails);
      return false;
    }

    // Try to parse the response
    try {
      const responseData = await response.json();
      console.log(`Data successfully saved to ${endpoint}:`, responseData);
    } catch (e) {
      console.log(`Data saved to ${endpoint}, but could not parse response`);
    }
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

