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

                // Access like this:
                var lessonStatus = jObjectPayload["payload"]?["core"]?["lesson_status"]?.ToString();
                var rawScore = jObjectPayload["payload"]?["core"]?["score"]?["raw"]?.ToString();

                var success = await _runtimeService.CommitAttemptAsync(attemptId, jObjectPayload);

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
