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

// Helper to send logs to the backend
async function sendLogToServer(logObj) {
  try {
    await fetch('/api/scorm/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logObj)
    });
  } catch (e) {
    // Ignore errors for logging
  }
}

// Helper function to log API calls during development
function logApiCall(version, func, args, result) {
  const logMsg = `SCORM ${version} | ${func}(${args ? args : ''}) => ${result}`;
  console.log(logMsg);
  sendLogToServer({ version, func, args, result, timestamp: new Date().toISOString() });

  // Any API call indicates activity - trigger progress check
  if (func === 'LMSSetValue' || func === 'SetValue' ||
      func === 'LMSCommit' || func === 'Commit' ||
      func === 'LMSGetValue' || func === 'GetValue') {
    console.log(`🎯 API activity detected (${func}), scheduling progress check...`);

    // Immediate check for SetValue calls
    if (func === 'LMSSetValue' || func === 'SetValue') {
      setTimeout(() => {
        console.log('🔍 Post-SetValue progress check...');
        trackProgressChange();
      }, 100);
    }

    // Also mark user interaction for the monitor
    userInteractionDetected = true;
  }
}

// Enhanced getQueryParams with fallback mechanisms and better error handling
function getQueryParams() {
  const params = {};

  try {
    // Determine if we're in an iframe
    const isInIframe = window !== window.parent;
    console.log("Is running in iframe:", isInIframe);

    let queryString = '';
    let source = 'unknown';

    if (isInIframe) {
      // We're in the iframe, so we need to parse our own location
      queryString = window.location.search;
      source = 'iframe-location';
      console.log("Iframe query string:", queryString);
    } else {
      // We're in the parent window, so we need to get the iframe's src
      const iframe = document.getElementById('scorm-content');
      if (iframe) {
        const src = iframe.getAttribute('src');
        source = 'iframe-src';
        console.log("Iframe src attribute:", src);

        // Extract query string from src
        const queryIndex = src.indexOf('?');
        if (queryIndex !== -1) {
          queryString = src.substring(queryIndex);
        }
      }
    }

    console.log(`Using query string from ${source}:`, queryString);

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

    // Validation and fallback mechanisms
    if (!params.attemptId) {
      console.warn("⚠️ attemptId not found in URL parameters!");

      // Try alternative parameter extraction methods
      const alternativeParams = getAlternativeParams();
      if (alternativeParams.attemptId) {
        console.log("Found attemptId in alternative source:", alternativeParams.attemptId);
        Object.assign(params, alternativeParams);
      } else {
        console.error("❌ Failed to find attemptId in any source!");

        // Log debugging information
        console.log("Debug information:");
        console.log("- Current window URL:", window.location.href);
        console.log("- Parent window URL:", isInIframe ? 'N/A (in iframe)' : window.location.href);
        console.log("- Query string source:", source);
        console.log("- Raw query string:", queryString);

        // Try to get parameters from parent window if possible
        if (isInIframe && window.parent) {
          try {
            const parentParams = window.parent.getQueryParams?.();
            if (parentParams && parentParams.attemptId) {
              console.log("Found attemptId in parent window:", parentParams.attemptId);
              Object.assign(params, parentParams);
            }
          } catch (e) {
            console.warn("Could not access parent window parameters:", e.message);
          }
        }
      }
    }

    // Final validation
    validateRequiredParams(params);

  } catch (error) {
    console.error("Error extracting query parameters:", error);

    // Emergency fallback - try to extract from any available source
    const emergencyParams = getEmergencyParams();
    if (emergencyParams && Object.keys(emergencyParams).length > 0) {
      console.log("Using emergency parameter extraction:", emergencyParams);
      Object.assign(params, emergencyParams);
    }
  }

  return params;
}

// Alternative parameter extraction methods
function getAlternativeParams() {
  const params = {};

  try {
    // Try URLSearchParams API
    const urlParams = new URLSearchParams(window.location.search);
    for (const [key, value] of urlParams) {
      params[key] = value;
    }

    // Try hash parameters as backup
    const hash = window.location.hash;
    if (hash && hash.includes('?')) {
      const hashQuery = hash.substring(hash.indexOf('?') + 1);
      const hashParams = new URLSearchParams(hashQuery);
      for (const [key, value] of hashParams) {
        if (!params[key]) params[key] = value;
      }
    }

  } catch (error) {
    console.warn("Alternative parameter extraction failed:", error);
  }

  return params;
}

// Emergency parameter extraction from global variables or DOM
function getEmergencyParams() {
  const params = {};

  try {
    // Try to get from global variables set by the parent page
    if (window.scormAttemptId) {
      params.attemptId = window.scormAttemptId;
    }
    if (window.scormCourseId) {
      params.courseId = window.scormCourseId;
    }
    if (window.scormUserId) {
      params.userId = window.scormUserId;
    }

    // Try to extract from meta tags
    const attemptMeta = document.querySelector('meta[name="scorm-attempt-id"]');
    if (attemptMeta) {
      params.attemptId = attemptMeta.content;
    }

    const courseMeta = document.querySelector('meta[name="scorm-course-id"]');
    if (courseMeta) {
      params.courseId = courseMeta.content;
    }

    const userMeta = document.querySelector('meta[name="scorm-user-id"]');
    if (userMeta) {
      params.userId = userMeta.content;
    }

  } catch (error) {
    console.warn("Emergency parameter extraction failed:", error);
  }

  return params;
}

// Validate that required parameters are present
function validateRequiredParams(params) {
  const required = ['attemptId', 'courseId', 'userId'];
  const missing = required.filter(param => !params[param]);

  if (missing.length > 0) {
    console.error(`❌ Missing required parameters: ${missing.join(', ')}`);
    console.log("Available parameters:", Object.keys(params));

    // Send error report to server
    sendLogToServer({
      type: 'missing_parameters',
      missing: missing,
      available: Object.keys(params),
      url: window.location.href,
      timestamp: new Date().toISOString()
    });
  } else {
    console.log("✅ All required parameters found:", required);
  }
}

// Progress indicator functionality
let saveStatusElement = null;
let saveStatusTimeout = null;

function createSaveStatusElement() {
  if (!saveStatusElement) {
    saveStatusElement = document.createElement('div');
    saveStatusElement.id = 'scorm-save-status';
    saveStatusElement.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 8px 12px;
      border-radius: 4px;
      font-family: Arial, sans-serif;
      font-size: 12px;
      font-weight: bold;
      z-index: 10000;
      transition: all 0.3s ease;
      display: none;
    `;
    document.body.appendChild(saveStatusElement);
  }
  return saveStatusElement;
}

function showSaveStatus(type, message) {
  const element = createSaveStatusElement();

  // Clear any existing timeout
  if (saveStatusTimeout) {
    clearTimeout(saveStatusTimeout);
  }

  // Set styles based on status type
  switch (type) {
    case 'saving':
      element.style.backgroundColor = '#2196f3';
      element.style.color = 'white';
      break;
    case 'success':
      element.style.backgroundColor = '#4caf50';
      element.style.color = 'white';
      break;
    case 'error':
      element.style.backgroundColor = '#f44336';
      element.style.color = 'white';
      break;
    case 'retrying':
      element.style.backgroundColor = '#ff9800';
      element.style.color = 'white';
      break;
    default:
      element.style.backgroundColor = '#666';
      element.style.color = 'white';
  }

  element.textContent = message;
  element.style.display = 'block';

  // Auto-hide after delay (except for saving status)
  if (type !== 'saving') {
    const hideDelay = type === 'error' ? 5000 : 3000; // Show errors longer
    saveStatusTimeout = setTimeout(() => {
      element.style.display = 'none';
    }, hideDelay);
  }
}

// Enhanced saveToServer with retry mechanism and better error handling
async function saveToServer(endpoint, retryCount = 0) {
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000; // 1 second

  try {
    const params = getQueryParams();

    // Check if attemptId is valid
    if (!params.attemptId) {
      console.error("Attempt ID is missing. Cannot save data.");
      showSaveStatus('error', 'Missing attempt ID');
      return false;
    }

    // Validate SCORM data before sending
    if (!scormData || typeof scormData !== 'object') {
      console.error("Invalid SCORM data format");
      showSaveStatus('error', 'Invalid data format');
      return false;
    }

    const requestBody = {
      payload: scormData
    };

    console.log("Sending data to server:", endpoint);
    console.log("Request body:", JSON.stringify(requestBody));

    showSaveStatus('saving', 'Saving progress...');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

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

      const errorMessage = `Failed to save data to ${endpoint}: ${response.status} ${response.statusText}`;
      console.error(errorMessage);
      console.error("Error details:", errorDetails);

      // Retry on certain error codes
      if ((response.status >= 500 || response.status === 429) && retryCount < MAX_RETRIES) {
        console.log(`Retrying save operation (attempt ${retryCount + 1}/${MAX_RETRIES}) after ${RETRY_DELAY}ms`);
        showSaveStatus('retrying', `Retrying... (${retryCount + 1}/${MAX_RETRIES})`);

        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1))); // Exponential backoff
        return saveToServer(endpoint, retryCount + 1);
      }

      showSaveStatus('error', `Save failed: ${response.status}`);

      // Log the error to server for monitoring
      sendLogToServer({
        type: 'save_error',
        endpoint: endpoint,
        status: response.status,
        error: errorDetails,
        retryCount: retryCount,
        timestamp: new Date().toISOString()
      });

      return false;
    }

    // Try to parse the response
    try {
      const responseData = await response.json();
      console.log(`Data successfully saved to ${endpoint}:`, responseData);
      showSaveStatus('success', 'Progress saved');
    } catch (e) {
      console.log(`Data saved to ${endpoint}, but could not parse response`);
      showSaveStatus('success', 'Progress saved');
    }

    return true;
  } catch (err) {
    if (err.name === 'AbortError') {
      console.error(`Save request to ${endpoint} timed out`);
      showSaveStatus('error', 'Save timeout');
    } else {
      console.error(`Error saving to ${endpoint}:`, err);
      showSaveStatus('error', 'Save failed');
    }

    // Retry on network errors
    if (retryCount < MAX_RETRIES && (err.name === 'TypeError' || err.name === 'AbortError')) {
      console.log(`Retrying save operation after network error (attempt ${retryCount + 1}/${MAX_RETRIES})`);
      showSaveStatus('retrying', `Retrying... (${retryCount + 1}/${MAX_RETRIES})`);

      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
      return saveToServer(endpoint, retryCount + 1);
    }

    // Log the error to server for monitoring (if this isn't a logging call itself)
    if (!endpoint.includes('/log')) {
      sendLogToServer({
        type: 'save_network_error',
        endpoint: endpoint,
        error: err.message,
        retryCount: retryCount,
        timestamp: new Date().toISOString()
      });
    }

    return false;
  }
}

// Helper to initialize SCORM data from resumeData
let resumeDataFromMessage = null;
let resumeInitializationAttempts = 0;
const MAX_RESUME_INIT_ATTEMPTS = 3;

window.addEventListener('message', function(event) {
  if (event && event.data && event.data.type === 'scormResumeData') {
    resumeDataFromMessage = event.data.data;
    initializeScormDataFromResume();
  }
});

function initializeScormDataFromResume() {
  resumeInitializationAttempts++;

  try {
    // Try to get resumeData from message, this window, or parent
    var resumeData = resumeDataFromMessage || window.scormResumeData || (window.parent && window.parent.scormResumeData);

    if (resumeData) {
      console.log("Initializing SCORM data from resume data:", resumeData);

      // Validate resume data structure
      if (typeof resumeData !== 'object') {
        console.error("Invalid resume data format - expected object, got:", typeof resumeData);
        return false;
      }

      // SCORM 1.2 fields with validation
      if (resumeData.LessonLocation && typeof resumeData.LessonLocation === 'string') {
        scormData["cmi.core.lesson_location"] = resumeData.LessonLocation;
        console.log("Restored lesson location:", resumeData.LessonLocation);
      }

      if (resumeData.SuspendData && typeof resumeData.SuspendData === 'string') {
        scormData["cmi.suspend_data"] = resumeData.SuspendData;
        console.log("Restored suspend data length:", resumeData.SuspendData.length);
      }

      if (resumeData.CompletionStatus && typeof resumeData.CompletionStatus === 'string') {
        scormData["cmi.core.lesson_status"] = resumeData.CompletionStatus;
        scormData["cmi.completion_status"] = resumeData.CompletionStatus;
        console.log("Restored completion status:", resumeData.CompletionStatus);
      }

      if (resumeData.SuccessStatus && typeof resumeData.SuccessStatus === 'string') {
        scormData["cmi.success_status"] = resumeData.SuccessStatus;
        console.log("Restored success status:", resumeData.SuccessStatus);
      }

      if (resumeData.ScoreRaw !== undefined && resumeData.ScoreRaw !== null && !isNaN(resumeData.ScoreRaw)) {
        scormData["cmi.core.score.raw"] = resumeData.ScoreRaw.toString();
        scormData["cmi.score.raw"] = resumeData.ScoreRaw.toString();
        console.log("Restored score:", resumeData.ScoreRaw);
      }

      if (resumeData.TotalTime) {
        try {
          // Convert TimeSpan to SCORM format if needed
          const totalTimeString = formatTimeSpanToSCORM(resumeData.TotalTime);
          scormData["cmi.core.total_time"] = totalTimeString;
          scormData["cmi.total_time"] = totalTimeString;
          console.log("Restored total time:", totalTimeString);
        } catch (timeError) {
          console.warn("Failed to parse total time:", timeError);
        }
      }

      // Set entry mode to resume if we have prior data
      if (resumeData.LessonLocation || resumeData.SuspendData || resumeData.CompletionStatus !== "not attempted") {
        scormData["cmi.core.entry"] = "resume";
        scormData["cmi.entry"] = "resume";
        console.log("Setting entry mode to 'resume'");
      }

      console.log("SCORM data successfully initialized from resumeData");
      return true;
    } else {
      console.log("No resume data found, starting fresh");

      // Retry initialization if we haven't exceeded max attempts
      if (resumeInitializationAttempts < MAX_RESUME_INIT_ATTEMPTS) {
        console.log(`Retrying resume data initialization (attempt ${resumeInitializationAttempts}/${MAX_RESUME_INIT_ATTEMPTS})`);
        setTimeout(initializeScormDataFromResume, 500); // Wait 500ms before retry
      }
      return false;
    }
  } catch (error) {
    console.error("Error initializing SCORM data from resume:", error);

    // Retry initialization if we haven't exceeded max attempts
    if (resumeInitializationAttempts < MAX_RESUME_INIT_ATTEMPTS) {
      console.log(`Retrying resume data initialization after error (attempt ${resumeInitializationAttempts}/${MAX_RESUME_INIT_ATTEMPTS})`);
      setTimeout(initializeScormDataFromResume, 1000); // Wait 1s before retry after error
    } else {
      console.error("Failed to initialize resume data after maximum attempts");
      // Send error log to server
      sendLogToServer({
        type: 'resume_init_error',
        error: error.message,
        attempts: resumeInitializationAttempts,
        timestamp: new Date().toISOString()
      });
    }
    return false;
  }
}

// Helper function to format TimeSpan to SCORM time format
function formatTimeSpanToSCORM(timeSpan) {
  if (!timeSpan) return "00:00:00";

  // TimeSpan from .NET is in format like "00:05:30" or could be object with properties
  if (typeof timeSpan === 'string') {
    return timeSpan;
  } else if (typeof timeSpan === 'object' && timeSpan.TotalSeconds) {
    // Convert total seconds to SCORM 1.2 format (HHHH:MM:SS.SS)
    const totalSeconds = Math.floor(timeSpan.TotalSeconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(4, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return "00:00:00";
}

// Auto-save functionality - save every 30 seconds if there are changes
let lastSavedData = JSON.stringify(scormData);
let autoSaveInterval;

function startAutoSave() {
  if (autoSaveInterval) return; // Already started

  autoSaveInterval = setInterval(async () => {
    const currentData = JSON.stringify(scormData);
    if (currentData !== lastSavedData) {
      console.log("Auto-saving SCORM data...");
      const params = getQueryParams();
      if (params.attemptId) {
        const success = await saveToServer(`/api/scorm/attempts/${params.attemptId}/commit`);
        if (success) {
          lastSavedData = currentData;
          console.log("Auto-save successful");
        } else {
          console.log("Auto-save failed");
        }
      }
    }
  }, 30000); // Save every 30 seconds
}

function stopAutoSave() {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
    autoSaveInterval = null;
  }
}

// Start auto-save when SCORM data is first accessed
let autoSaveStarted = false;

// Call on load (in case resumeData is available immediately)
initializeScormDataFromResume();

// Enhanced resume data initialization with retry and validation
function ensureResumeDataLoaded() {
  let retryCount = 0;
  const maxRetries = 10;

  function tryLoadResumeData() {
    const hasResumeData = window.scormResumeData || window.scormDebugInfo?.isResume;

    if (hasResumeData) {
      console.log("✅ Resume data is available, reinitializing...");
      initializeScormDataFromResume();

      // Validate that data was actually loaded
      const hasActualData = scormData["cmi.core.lesson_location"] ||
                           scormData["cmi.suspend_data"] ||
                           scormData["cmi.core.lesson_status"] !== "not attempted";

      if (hasActualData) {
        console.log("✅ Resume data successfully loaded into scormData");
        return true;
      } else {
        console.warn("⚠️ Resume data available but not loaded into scormData");
      }
    }

    if (retryCount < maxRetries) {
      retryCount++;
      console.log(`🔄 Retrying resume data load (${retryCount}/${maxRetries})`);
      setTimeout(tryLoadResumeData, 500);
    } else {
      console.log("ℹ️ Starting with fresh SCORM data (no resume data or max retries reached)");
    }

    return false;
  }

  // Start the retry process
  setTimeout(tryLoadResumeData, 100);
}

// Start the enhanced resume data loading
ensureResumeDataLoaded();

// SCORM 1.2 API Implementation
window.API = {
  LMSInitialize: function(param) {
    if (!autoSaveStarted) {
      startAutoSave();
      autoSaveStarted = true;
    }
    // Start progress monitoring
    startProgressMonitoring();
    logApiCall("1.2", "LMSInitialize", param, "true");
    return "true";
  },
  
  LMSFinish: function(param) {
    // Stop auto-save and progress monitoring
    stopAutoSave();
    stopProgressMonitoring();
    const params = getQueryParams();
    // Do final save asynchronously in background
    saveToServer(`/api/scorm/attempts/${params.attemptId}/commit`).then(() => {
      return saveToServer(`/api/scorm/attempts/${params.attemptId}/finish`);
    }).then(success => {
      if (success) {
        console.log("LMSFinish: Session finished and data saved successfully");
      } else {
        console.error("LMSFinish: Failed to finish session");
      }
    }).catch(err => {
      console.error("LMSFinish: Error finishing session:", err);
    });
    logApiCall("1.2", "LMSFinish", param, "true");
    return "true";
  },
  
  LMSGetValue: function(element) {
    const value = scormData[element] || "";
    logApiCall("1.2", "LMSGetValue", element, value);
    return value;
  },
  
  LMSSetValue: function(element, value) {
    // Validate inputs
    if (typeof element !== 'string') {
      console.error("LMSSetValue: Invalid element parameter:", element);
      return "false";
    }

    // Store the value
    const oldValue = scormData[element];
    scormData[element] = value;

    // Enhanced logging
    console.log(`📝 LMSSetValue: ${element} = "${value}" (was: "${oldValue}")`);

    // Special handling for important fields
    if (element === 'cmi.core.lesson_status' || element === 'cmi.completion_status') {
      console.log(`🎯 Important: Lesson status changed to "${value}"`);
    }
    if (element === 'cmi.core.lesson_location') {
      console.log(`📍 Important: Location changed to "${value}"`);
    }
    if (element === 'cmi.suspend_data') {
      console.log(`💾 Important: Suspend data updated (${value ? value.length : 0} chars)`);
    }

    logApiCall("1.2", "LMSSetValue", `${element}, ${value}`, "true");

    // Track progress changes for important fields
    if (element.includes('lesson_status') || element.includes('completion_status') ||
        element.includes('lesson_location') || element.includes('location') ||
        element.includes('score') || element.includes('suspend_data')) {
      console.log(`🔄 Triggering progress change for field: ${element}`);
      trackProgressChange();
    }

    return "true";
  },
  
  LMSCommit: function(param) {
    // Save progress asynchronously in background
      const params = getQueryParams();
      console.log("---------------")
      console.log(params)
      console.log("---------------")
    saveToServer(`/api/scorm/attempts/${params.attemptId}/commit`).then(success => {
      if (success) {
        console.log("LMSCommit: Data saved successfully");
      } else {
        console.error("LMSCommit: Failed to save data");
      }
    }).catch(err => {
      console.error("LMSCommit: Error saving data:", err);
    });
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
    if (!autoSaveStarted) {
      startAutoSave();
      autoSaveStarted = true;
    }
    // Start progress monitoring
    startProgressMonitoring();
    logApiCall("2004", "Initialize", param, "true");
    return "true";
  },
  
  Terminate: function(param) {
    // Stop auto-save and progress monitoring
    stopAutoSave();
    stopProgressMonitoring();
    const params = getQueryParams();
    // Do final save asynchronously in background
    saveToServer(`/api/scorm/attempts/${params.attemptId}/commit`).then(() => {
      return saveToServer(`/api/scorm/attempts/${params.attemptId}/finish`);
    }).then(success => {
      if (success) {
        console.log("Terminate: Session finished and data saved successfully");
      } else {
        console.error("Terminate: Failed to finish session");
      }
    }).catch(err => {
      console.error("Terminate: Error finishing session:", err);
    });
    logApiCall("2004", "Terminate", param, "true");
    return "true";
  },
  
  GetValue: function(element) {
    const value = scormData[element] || "";
    logApiCall("2004", "GetValue", element, value);
    return value;
  },
  
  SetValue: function(element, value) {
    // Validate inputs
    if (typeof element !== 'string') {
      console.error("SetValue: Invalid element parameter:", element);
      return "false";
    }

    // Store the value
    const oldValue = scormData[element];
    scormData[element] = value;

    // Enhanced logging
    console.log(`📝 SetValue (2004): ${element} = "${value}" (was: "${oldValue}")`);

    // Special handling for important fields
    if (element === 'cmi.completion_status') {
      console.log(`🎯 Important: Completion status changed to "${value}"`);
    }
    if (element === 'cmi.location') {
      console.log(`📍 Important: Location changed to "${value}"`);
    }
    if (element === 'cmi.suspend_data') {
      console.log(`💾 Important: Suspend data updated (${value ? value.length : 0} chars)`);
    }

    logApiCall("2004", "SetValue", `${element}, ${value}`, "true");

    // Track progress changes for important fields
    if (element.includes('completion_status') || element.includes('success_status') ||
        element.includes('location') || element.includes('score') || element.includes('suspend_data')) {
      console.log(`🔄 Triggering progress change for SCORM 2004 field: ${element}`);
      trackProgressChange();
    }

    return "true";
  },
  
  Commit: function(param) {
    // Save progress asynchronously in background
    const params = getQueryParams();
    saveToServer(`/api/scorm/attempts/${params.attemptId}/commit`).then(success => {
      if (success) {
        console.log("Commit: Data saved successfully");
      } else {
        console.error("Commit: Failed to save data");
      }
    }).catch(err => {
      console.error("Commit: Error saving data:", err);
    });
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

// Function to explicitly resume a SCORM attempt using the API endpoint
async function resumeAttempt(attemptId) {
  if (!attemptId) {
    console.error("Attempt ID is required for resume operation");
    showSaveStatus('error', 'Invalid attempt ID');
    return false;
  }

  try {
    showSaveStatus('saving', 'Resuming attempt...');

    const response = await fetch(`/api/scorm/attempts/${attemptId}/resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      let errorDetails = "";
      try {
        const errorJson = await response.json();
        errorDetails = errorJson.error || 'Unknown error';
      } catch (err) {
        errorDetails = `HTTP ${response.status}`;
      }

      console.error(`Failed to resume attempt ${attemptId}: ${response.status} ${response.statusText}`);
      console.error("Error details:", errorDetails);
      showSaveStatus('error', `Resume failed: ${errorDetails}`);
      return false;
    }

    const resumeResult = await response.json();
    console.log('Resume operation successful:', resumeResult);

    // Update the current page with the new launch URL if needed
    if (resumeResult.launchUrl && resumeResult.launchUrl !== window.location.href) {
      console.log('Resume returned new launch URL:', resumeResult.launchUrl);
      // Optionally redirect to the new URL or update iframe src
    }

    showSaveStatus('success', 'Attempt resumed successfully');
    return resumeResult;
  } catch (err) {
    console.error('Error during resume operation:', err);
    showSaveStatus('error', 'Resume operation failed');
    return false;
  }
}

// Function to check resume status for an attempt
async function checkResumeStatus(attemptId) {
  if (!attemptId) {
    console.error("Attempt ID is required for resume status check");
    return null;
  }

  try {
    const response = await fetch(`/api/scorm/attempts/${attemptId}/progress`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`Failed to check resume status for attempt ${attemptId}: ${response.status}`);
      return null;
    }

    const progressData = await response.json();
    console.log('Resume status check result:', progressData);
    return progressData;
  } catch (err) {
    console.error('Error checking resume status:', err);
    return null;
  }
}

// Diagnostic functions for troubleshooting
function diagnosticReport() {
  const params = getQueryParams();
  const report = {
    timestamp: new Date().toISOString(),
    attemptId: params.attemptId,
    hasAttemptId: !!params.attemptId,
    scormDataKeys: Object.keys(scormData),
    scormDataSample: {
      'cmi.core.lesson_status': scormData['cmi.core.lesson_status'],
      'cmi.core.lesson_location': scormData['cmi.core.lesson_location'],
      'cmi.suspend_data': scormData['cmi.suspend_data'] ? scormData['cmi.suspend_data'].substring(0, 50) + '...' : '',
      'cmi.core.score.raw': scormData['cmi.core.score.raw']
    },
    autoSaveActive: !!autoSaveInterval,
    resumeData: window.scormResumeData,
    debugInfo: window.scormDebugInfo
  };

  console.log("📊 SCORM Diagnostic Report:", report);
  return report;
}

function forceCommit() {
  console.log("🔧 Force committing current SCORM data...");
  const params = getQueryParams();
  if (params.attemptId) {
    return saveToServer(`/api/scorm/attempts/${params.attemptId}/commit`);
  } else {
    console.error("❌ Cannot force commit: No attemptId available");
    return Promise.resolve(false);
  }
}

function testDataFlow() {
  console.log("🧪 Testing SCORM data flow...");

  // Test setting some data
  console.log("1. Setting test data...");
  window.API.LMSSetValue('cmi.core.lesson_location', 'test_location_' + Date.now());
  window.API.LMSSetValue('cmi.suspend_data', 'test_data_' + Date.now());
  window.API.LMSSetValue('cmi.core.lesson_status', 'incomplete');

  // Test committing
  console.log("2. Testing commit...");
  const commitResult = window.API.LMSCommit('');
  console.log("Commit result:", commitResult);

  // Show diagnostic report
  setTimeout(() => {
    console.log("3. Diagnostic report after test:");
    diagnosticReport();
  }, 1000);
}

function debugProgressTracking() {
  console.log("🔧 Progress Tracking Debug Report");
  console.log("================================");

  // Current SCORM data
  console.log("Current SCORM Data:");
  console.log("- lesson_status:", scormData["cmi.core.lesson_status"]);
  console.log("- completion_status:", scormData["cmi.completion_status"]);
  console.log("- lesson_location:", scormData["cmi.core.lesson_location"]);
  console.log("- location:", scormData["cmi.location"]);
  console.log("- score.raw:", scormData["cmi.core.score.raw"]);
  console.log("- suspend_data length:", (scormData["cmi.suspend_data"] || "").length);

  // Calculate current progress
  const currentProgress = updateProgressDisplay();
  console.log("- Calculated progress:", currentProgress + "%");

  // Monitoring status
  console.log("\nMonitoring Status:");
  console.log("- Progress monitoring active:", !!progressMonitorInterval);
  console.log("- Auto-save active:", !!autoSaveInterval);
  console.log("- User interaction detected:", userInteractionDetected);

  // Test progress calculation
  console.log("\nTesting Progress Calculation:");
  const testLocation = "lesson_5";
  const testProgress = calculateProgressFromLocation(testLocation);
  console.log(`- Test location "${testLocation}" → ${testProgress}%`);

  // Force a progress update
  console.log("\nForcing progress update...");
  trackProgressChange();

  return {
    scormData: scormData,
    progress: currentProgress,
    monitoringActive: !!progressMonitorInterval
  };
}

function simulateProgressChange() {
  console.log("🎭 Simulating progress change...");

  // Simulate a lesson location change
  const currentLocation = scormData["cmi.core.lesson_location"] || "";
  const newLocation = "lesson_" + (Math.floor(Math.random() * 10) + 1);

  console.log(`Changing lesson location from "${currentLocation}" to "${newLocation}"`);
  window.API.LMSSetValue("cmi.core.lesson_location", newLocation);

  // Also update score
  const newScore = Math.floor(Math.random() * 100);
  console.log(`Setting score to ${newScore}`);
  window.API.LMSSetValue("cmi.core.score.raw", newScore.toString());

  // Commit the changes
  window.API.LMSCommit("");

  console.log("✅ Simulated progress change complete");
}

// Global functions for external access
window.scormResumeAttempt = resumeAttempt;
window.scormCheckResumeStatus = checkResumeStatus;
window.scormDiagnosticReport = diagnosticReport;
window.scormForceCommit = forceCommit;
window.scormTestDataFlow = testDataFlow;
window.scormDebugProgress = debugProgressTracking;
window.scormSimulateProgress = simulateProgressChange;

// Make APIs available for discovery by SCORM content
function findAPI(win) {
  let findAttempts = 0;
  const maxAttempts = 500; // 500 * 10ms = 5 seconds max wait

  function doFind() {
    if (win.API != null) {
      return win.API;
    }
    if (win.API_1484_11 != null) {
      return win.API_1484_11;
    }
    if (win.parent != null && win.parent != win) {
      return findAPI(win.parent);
    }
    if (win.opener != null) {
      return findAPI(win.opener);
    }
    return null;
  }

  const api = doFind();
  if (api == null && findAttempts < maxAttempts) {
    findAttempts++;
    setTimeout(() => findAPI(win), 10);
  }
  return api;
}

// Expose findAPI function for SCORM content
window.findAPI = findAPI;

// Also expose APIs on parent window if we're in an iframe
if (window.parent && window.parent !== window) {
  try {
    window.parent.API = window.API;
    window.parent.API_1484_11 = window.API_1484_11;
    window.parent.findAPI = findAPI;
  } catch (e) {
    console.warn("Could not expose APIs to parent window:", e.message);
  }
}

// Progress tracking functionality
function updateProgressDisplay() {
  try {
    // Calculate current progress based on SCORM data
    let progressPercentage = 0;

    // Check completion status first
    const completionStatus = scormData["cmi.core.lesson_status"] || scormData["cmi.completion_status"];
    if (completionStatus === "completed" || completionStatus === "passed") {
      progressPercentage = 100;
    } else {
      // Try to calculate from score
      const scoreRaw = parseFloat(scormData["cmi.core.score.raw"] || scormData["cmi.score.raw"] || "0");
      const scoreMax = parseFloat(scormData["cmi.core.score.max"] || scormData["cmi.score.max"] || "100");

      if (scoreRaw > 0 && scoreMax > 0) {
        progressPercentage = (scoreRaw / scoreMax) * 100;
      } else {
        // Enhanced heuristic based on lesson location patterns
        const lessonLocation = scormData["cmi.core.lesson_location"] || scormData["cmi.location"] || "";
        const suspendData = scormData["cmi.suspend_data"] || "";

        if (lessonLocation || suspendData) {
          // Try to extract progress from lesson location patterns
          const locationProgress = calculateProgressFromLocation(lessonLocation);
          const suspendProgress = calculateProgressFromSuspendData(suspendData);

          progressPercentage = Math.max(locationProgress, suspendProgress, 10); // At least 10% if there's progress
        }
      }
    }

    // Ensure progress is between 0 and 100
    progressPercentage = Math.max(0, Math.min(100, progressPercentage));

    // Send progress update to parent window via postMessage
    if (window.parent && window.parent !== window) {
      try {
        window.parent.postMessage({
          type: 'scormProgressUpdate',
          progressPercent: progressPercentage,
          timestamp: new Date().toISOString(),
          source: 'scorm-api-adapter'
        }, '*');
      } catch (e) {
        console.warn("Could not send progress update to parent:", e.message);
      }
    }

      const spans = document.querySelectorAll('.progress-text');
      spans.forEach(span => {
          span.innerHTML = progressPercentage + ' % complete';
      });

      console.log("---- update progress display -----");
      console.log(progressPercentage);

    console.log(`📊 Progress updated: ${progressPercentage}%`);
    return progressPercentage;
  } catch (error) {
    console.error("Error updating progress display:", error);
    return 0;
  }
}

// Helper function to calculate progress from lesson location
function calculateProgressFromLocation(location) {
  if (!location) return 0;

  // Common patterns in lesson locations
  const patterns = [
    // Pattern: "lesson_1", "lesson_2", etc.
    { regex: /lesson[_\s]*(\d+)/i, calculate: (match) => {
      const lessonNum = parseInt(match[1]);
      // Assume 10 lessons max, each worth 10%
      return Math.min(lessonNum * 10, 90);
    }},

    // Pattern: "slide_5", "page_3", etc.
    { regex: /(slide|page|step)[_\s]*(\d+)/i, calculate: (match) => {
      const slideNum = parseInt(match[2]);
      // Assume 20 slides max, each worth 5%
      return Math.min(slideNum * 5, 95);
    }},

    // Pattern: "section1_complete", "module2_intro", etc.
    { regex: /(section|module|chapter)[_\s]*(\d+)/i, calculate: (match) => {
      const sectionNum = parseInt(match[2]);
      // Assume 5 sections max, each worth 20%
      return Math.min(sectionNum * 20, 80);
    }},

    // Pattern: percentage-like "75_percent" or "0.75"
    { regex: /(\d+)[_\s]*percent/i, calculate: (match) => {
      return Math.min(parseInt(match[1]), 100);
    }},

    // Pattern: decimal progress "0.25", "0.5", etc.
    { regex: /^0\.(\d+)$/, calculate: (match) => {
      return Math.min(parseFloat('0.' + match[1]) * 100, 100);
    }}
  ];

  for (const pattern of patterns) {
    const match = location.match(pattern.regex);
    if (match) {
      const progress = pattern.calculate(match);
      console.log(`🎯 Calculated progress from location "${location}": ${progress}%`);
      return progress;
    }
  }

  // Fallback: if location exists but no pattern matches, give some progress
  return 5;
}

// Helper function to calculate progress from suspend data
function calculateProgressFromSuspendData(suspendData) {
  if (!suspendData) return 0;

  try {
    // Try to parse as JSON first
    const data = JSON.parse(suspendData);

    // Look for common progress indicators
    if (data.progress !== undefined) {
      return Math.min(parseFloat(data.progress) || 0, 100);
    }
    if (data.completion !== undefined) {
      return Math.min(parseFloat(data.completion) * 100 || 0, 100);
    }
    if (data.percentage !== undefined) {
      return Math.min(parseFloat(data.percentage) || 0, 100);
    }

  } catch (e) {
    // Not JSON, try to extract progress from string patterns
    const progressMatch = suspendData.match(/progress[:\s]*(\d+)/i);
    if (progressMatch) {
      return Math.min(parseInt(progressMatch[1]), 100);
    }

    const percentMatch = suspendData.match(/(\d+)%/);
    if (percentMatch) {
      return Math.min(parseInt(percentMatch[1]), 100);
    }
  }

  // Fallback: if suspend data exists but no progress found, give minimal progress
  return Math.min(suspendData.length / 10, 15); // Rough heuristic based on data length
}

// Update progress whenever data changes
function trackProgressChange() {
  // Update progress display
  updateProgressDisplay();

  // Send real-time update to server if auto-save is not active
  if (!autoSaveInterval) {
    const params = getQueryParams();
    if (params.attemptId) {
      // Debounced save to avoid too frequent calls
      clearTimeout(window.progressUpdateTimeout);
      window.progressUpdateTimeout = setTimeout(() => {
        saveToServer(`/api/scorm/attempts/${params.attemptId}/commit`);
      }, 2000);
    }
  }
}

// Periodic progress monitoring to catch changes we might miss
let progressMonitorInterval;
let userInteractionDetected = false;

function startProgressMonitoring() {
  if (progressMonitorInterval) return; // Already started

  let lastProgressUpdate = 0;
  let lastDataSnapshot = JSON.stringify(scormData);
  let lastLessonLocation = scormData["cmi.core.lesson_location"] || scormData["cmi.location"] || "";

  // Add user interaction listeners
  addUserInteractionListeners();

  progressMonitorInterval = setInterval(() => {
    const currentDataSnapshot = JSON.stringify(scormData);
    const currentLessonLocation = scormData["cmi.core.lesson_location"] || scormData["cmi.location"] || "";

    // Check if SCORM data has changed
    if (currentDataSnapshot !== lastDataSnapshot) {
      console.log('📊 Detected SCORM data change, updating progress...');
      console.log('Previous data keys:', Object.keys(JSON.parse(lastDataSnapshot)));
      console.log('Current data keys:', Object.keys(scormData));
      trackProgressChange();
      lastDataSnapshot = currentDataSnapshot;
    }

    // Specifically watch for lesson location changes (most common progress indicator)
    if (currentLessonLocation !== lastLessonLocation) {
      console.log(`📍 Lesson location changed: "${lastLessonLocation}" → "${currentLessonLocation}"`);
      trackProgressChange();
      lastLessonLocation = currentLessonLocation;
    }

    // If user interaction was detected, force a progress update
    if (userInteractionDetected) {
      console.log('👆 User interaction detected, forcing progress update...');
      updateProgressDisplay();
      userInteractionDetected = false;
    }

    // Also update progress periodically even if no data change detected
    // (in case the content is updating progress in a way we don't detect)
    const now = Date.now();
    if (now - lastProgressUpdate > 10000) { // Every 10 seconds (more frequent)
      console.log('⏰ Periodic progress update...');
      updateProgressDisplay();
      lastProgressUpdate = now;
    }
  }, 2000); // Check every 2 seconds (more frequent)

  console.log('📊 Progress monitoring started with enhanced detection');
}

function addUserInteractionListeners() {
  // Listen for clicks, which often trigger navigation in SCORM content
  document.addEventListener('click', function(event) {
    console.log('👆 Click detected, will check progress on next cycle');
    userInteractionDetected = true;

    // Also force an immediate check after a short delay
    setTimeout(() => {
      console.log('🔍 Post-click progress check...');
      trackProgressChange();
    }, 500);
  }, true); // Use capture to catch iframe clicks too

  // Listen for keyboard navigation
  document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft' ||
        event.key === 'Enter' || event.key === ' ') {
      console.log('⌨️ Navigation key detected:', event.key);
      userInteractionDetected = true;

      setTimeout(() => {
        console.log('🔍 Post-keypress progress check...');
        trackProgressChange();
      }, 500);
    }
  }, true);

  // Listen for iframe load events (page changes)
  const iframe = document.getElementById('scorm-content');
  if (iframe) {
    iframe.addEventListener('load', function() {
      console.log('🔄 Iframe loaded, checking progress...');
      setTimeout(() => {
        trackProgressChange();
        // Try to add listeners to iframe content
        addIframeInteractionListeners(iframe);
      }, 1000); // Wait a bit for the page to initialize
    });

    // Also add listeners initially if iframe is already loaded
    setTimeout(() => {
      addIframeInteractionListeners(iframe);
    }, 2000);
  }
}

function addIframeInteractionListeners(iframe) {
  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    if (iframeDoc) {
      // Add click listener to iframe content
      iframeDoc.addEventListener('click', function(event) {
        console.log('👆 Click detected in iframe content');
        userInteractionDetected = true;

        // Check for next/previous button clicks
        const target = event.target;
        const targetText = target.textContent?.toLowerCase() || '';
        const targetClass = target.className?.toLowerCase() || '';
        const targetId = target.id?.toLowerCase() || '';

        if (targetText.includes('next') || targetText.includes('continue') ||
            targetClass.includes('next') || targetClass.includes('continue') ||
            targetId.includes('next') || targetId.includes('continue')) {
          console.log('🔄 Next/Continue button clicked, forcing progress check');
          setTimeout(() => {
            console.log('🔍 Post-navigation progress check...');
            trackProgressChange();
          }, 1000); // Longer delay for page transitions
        }

        setTimeout(() => {
          trackProgressChange();
        }, 500);
      }, true);

      // Add other interaction listeners to iframe
      iframeDoc.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowRight' || event.key === 'Enter' || event.key === ' ') {
          console.log('⌨️ Navigation key in iframe:', event.key);
          userInteractionDetected = true;
          setTimeout(() => trackProgressChange(), 500);
        }
      }, true);

      console.log('✅ Successfully added interaction listeners to iframe content');
    } else {
      console.log('⚠️ Cannot access iframe content (cross-origin?)');
    }
  } catch (e) {
    console.log('⚠️ Cannot add iframe listeners (cross-origin):', e.message);

    // Fallback: monitor iframe src changes
    let lastIframeSrc = iframe.src;
    const srcMonitor = setInterval(() => {
      if (iframe.src !== lastIframeSrc) {
        console.log('🔄 Iframe src changed, checking progress...');
        lastIframeSrc = iframe.src;
        setTimeout(() => trackProgressChange(), 1000);
      }
    }, 1000);

    // Store interval for cleanup
    iframe._srcMonitor = srcMonitor;
  }
}

function stopProgressMonitoring() {
  if (progressMonitorInterval) {
    clearInterval(progressMonitorInterval);
    progressMonitorInterval = null;
    console.log('📊 Progress monitoring stopped');
  }
}

// Log when the SCORM APIs are ready
console.log("SCORM API adapters initialized for development mode");
console.log("APIs available: window.API, window.API_1484_11, window.findAPI()");
console.log("Query parameters:", getQueryParams());
console.log("Resume functions available: window.scormResumeAttempt(), window.scormCheckResumeStatus()");

// Add API discovery debugging
console.log("API Discovery Test:");
console.log("- window.API exists:", typeof window.API !== 'undefined');
console.log("- window.API_1484_11 exists:", typeof window.API_1484_11 !== 'undefined');
console.log("- Current scormData:", scormData);

// Initialize progress display and start monitoring for content that doesn't call Initialize
updateProgressDisplay();

// Start progress monitoring after a short delay if no API calls have been made
// This helps with content that doesn't properly call Initialize
setTimeout(() => {
  if (!progressMonitorInterval) {
    console.log('📊 Auto-starting progress monitoring (no Initialize call detected)');
    startProgressMonitoring();
  }
}, 3000);

