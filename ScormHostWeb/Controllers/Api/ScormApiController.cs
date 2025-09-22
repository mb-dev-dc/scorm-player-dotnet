using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using ScormHost.Web.Services;
using System;
using System.Threading.Tasks;

namespace ScormHost.Web.Controllers.Api
{
    [ApiController]
    [Route("api/scorm")]
    //[Authorize(Policy = "ApiAccess")] // Use a policy that can be configured for API access
    public class ScormApiController : ControllerBase
    {
        private readonly ScormRuntimeService _runtimeService;
        private readonly ILogger<ScormApiController> _logger;

        public ScormApiController(ScormRuntimeService runtimeService, ILogger<ScormApiController> logger)
        {
            _runtimeService = runtimeService;
            _logger = logger;
        }

        [HttpPost("attempts/{attemptId}/commit")]
        public async Task<IActionResult> Commit(Guid attemptId, [FromBody] object payload)
        {
            try
            {
                if (attemptId == Guid.Empty)
                {
                    _logger.LogWarning("Invalid attempt ID provided.");
                    return BadRequest(new { error = "Invalid attempt ID" });
                }

                if (payload == null)
                {
                    _logger.LogWarning("Missing or invalid payload for attempt {AttemptId}", attemptId);
                    return BadRequest(new { error = "Invalid payload format" });
                }

                // Robust conversion to JObject for .NET 9+ model binding
                JObject jObjectPayload;
                if (payload is JObject jObj)
                {
                    jObjectPayload = jObj;
                }
                else if (payload is System.Text.Json.JsonElement jsonElement)
                {
                    jObjectPayload = JObject.Parse(jsonElement.GetRawText());
                }
                else
                {
                    jObjectPayload = JObject.FromObject(payload);
                }

                _logger.LogDebug("Committing data for attempt {AttemptId}. Payload: {Payload}",
                    attemptId, jObjectPayload.ToString());

                // Extract the actual payload object if wrapped
                var actualPayload = jObjectPayload["payload"] as JObject ?? jObjectPayload;

                var success = await _runtimeService.CommitAttemptAsync(attemptId, actualPayload);

                if (!success)
                {
                    _logger.LogWarning("Failed to commit data for attempt {AttemptId} - attempt not found", attemptId);
                    return NotFound(new { error = "Attempt not found" });
                }

                return Ok(new { attemptId, saved = true });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error committing data for attempt {AttemptId}", attemptId);
                return StatusCode(500, new { error = "Failed to save SCORM data" });
            }
        }


        [HttpGet("attempts/{attemptId}/progress")]
        public async Task<IActionResult> GetProgress(Guid attemptId)
        {
            try
            {
                // For getting progress, we need to extract courseId and userId from the attempt
                // This is a simplified approach - in production you might want to validate user access
                var attempt = await _runtimeService.GetAttemptAsync(attemptId);
                if (attempt == null)
                {
                    return NotFound(new { error = "Attempt not found" });
                }

                var progress = await _runtimeService.GetProgressAsync(attempt.UserId, attempt.CourseId);
                return Ok(progress);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting progress for attempt {AttemptId}", attemptId);
                return StatusCode(500, new { error = "Failed to get progress" });
            }
        }

        [HttpPost("attempts/{attemptId}/finish")]
        public async Task<IActionResult> Finish(Guid attemptId, [FromBody] JObject payload = null)
        {
            try
            {
                _logger.LogDebug("Finishing attempt {AttemptId}", attemptId);

                // If data is provided, commit it first
                if (payload != null && payload != null)
                {
                    _logger.LogDebug("Commit data provided with finish request for {AttemptId}", attemptId);
                    await _runtimeService.CommitAttemptAsync(attemptId, payload);
                }

                // Mark the attempt as completed
                var success = await _runtimeService.FinishAttemptAsync(attemptId);

                if (!success)
                {
                    _logger.LogWarning("Failed to finish attempt {AttemptId} - attempt not found", attemptId);
                    return NotFound(new { error = "Attempt not found" });
                }

                return Ok(new { attemptId, status = "finished" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error finishing attempt {AttemptId}", attemptId);
                return StatusCode(500, new { error = "Failed to finish SCORM attempt" });
            }
        }

        [HttpPost("attempts/{attemptId}/resume")]
        public async Task<IActionResult> Resume(Guid attemptId)
        {
            try
            {
                if (attemptId == Guid.Empty)
                {
                    _logger.LogWarning("Invalid attempt ID provided for resume.");
                    return BadRequest(new { error = "Invalid attempt ID" });
                }

                var attempt = await _runtimeService.GetAttemptAsync(attemptId);
                if (attempt == null)
                {
                    _logger.LogWarning("Attempt {AttemptId} not found for resume", attemptId);
                    return NotFound(new { error = "Attempt not found" });
                }

                if (attempt.CompletedOn.HasValue)
                {
                    _logger.LogWarning("Cannot resume completed attempt {AttemptId}", attemptId);
                    return BadRequest(new { error = "Cannot resume a completed attempt" });
                }

                // Get the launch info which includes resume data
                var launchInfo = await _runtimeService.LaunchCourseAsync(attempt.UserId, attempt.CourseId);
                if (launchInfo == null)
                {
                    _logger.LogError("Failed to generate launch info for resume of attempt {AttemptId}", attemptId);
                    return StatusCode(500, new { error = "Failed to resume attempt" });
                }

                _logger.LogDebug("Resuming attempt {AttemptId} for user {UserId} on course {CourseId}",
                    attemptId, attempt.UserId, attempt.CourseId);

                return Ok(new
                {
                    attemptId = launchInfo.AttemptId,
                    launchUrl = launchInfo.LaunchUrl,
                    resumeData = launchInfo.ResumeData,
                    courseTitle = launchInfo.CourseTitle,
                    status = "resumed"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error resuming attempt {AttemptId}", attemptId);
                return StatusCode(500, new { error = "Failed to resume SCORM attempt" });
            }
        }

        [HttpPost("log")]
        public async Task<IActionResult> Log([FromBody] object logEntry)
        {
            try
            {
                // Robust conversion to JObject for .NET 9+ model binding
                JObject jObjectLog;
                if (logEntry is JObject jObj)
                {
                    jObjectLog = jObj;
                }
                else if (logEntry is System.Text.Json.JsonElement jsonElement)
                {
                    jObjectLog = JObject.Parse(jsonElement.GetRawText());
                }
                else
                {
                    jObjectLog = JObject.FromObject(logEntry);
                }

                var logText = $"{DateTime.UtcNow:O} | {jObjectLog?.ToString(Newtonsoft.Json.Formatting.None)}\n";
                var logFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "App_Data", "scorm-api-log.txt");
                var logDir = Path.GetDirectoryName(logFilePath);
                if (!Directory.Exists(logDir))
                {
                    Directory.CreateDirectory(logDir);
                }
                await System.IO.File.AppendAllTextAsync(logFilePath, logText);
                return Ok(new { saved = true });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to write SCORM API log entry");
                return StatusCode(500, new { error = "Failed to write log", details = ex.Message });
            }
        }

        //public class PayloadWrapper
        //{
        //    public JObject payload { get; set; }

        //    public PayloadWrapper() { }

        //    public bool IsValid()
        //    {
        //        return payload != null;
        //    }
        //}
    }
}
