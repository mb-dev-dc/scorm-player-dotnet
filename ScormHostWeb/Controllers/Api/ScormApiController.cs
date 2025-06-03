using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ScormHost.Web.Controllers.Api
{
    [ApiController]
    [Route("api/scorm")]
    [Authorize]
    public class ScormApiController : ControllerBase
    {
        [HttpPost("attempts/{attemptId}/commit")]
        public IActionResult Commit(Guid attemptId, [FromBody] object data)
        {
            // Save SCORM runtime data for attempt
            return Ok(new { attemptId, saved = true });
        }

        [HttpPost("attempts/{attemptId}/finish")]
        public IActionResult Finish(Guid attemptId)
        {
            // Mark attempt as finished
            return Ok(new { attemptId, status = "finished" });
        }
    }
}
