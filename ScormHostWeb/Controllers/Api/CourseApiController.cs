using Microsoft.AspNetCore.Mvc;
using ScormHost.Web.Services;

namespace ScormHost.Web.Controllers.Api
{
    [ApiController]
    [Route("api/courses")]
    public class CourseApiController : ControllerBase
    {
        private readonly ScormPackageService _packageService;
        private readonly ScormRuntimeService _runtimeService;
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<CourseApiController> _logger;

        public CourseApiController(
            ScormPackageService packageService,
            ScormRuntimeService runtimeService,
            IWebHostEnvironment environment,
            ILogger<CourseApiController> logger)
        {
            _packageService = packageService;
            _runtimeService = runtimeService;
            _environment = environment;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var courses = await _packageService.GetAll();
            return Ok(courses);
        }

        [HttpPost("upload")]
        [RequestSizeLimit(100 * 1024 * 1024)]
        public async Task<IActionResult> Upload([FromForm] IFormFile scormPackage, [FromForm] string title)
        {
            if (scormPackage == null || scormPackage.Length == 0)
                return BadRequest(new { message = "Please select a SCORM package file." });

            if (string.IsNullOrWhiteSpace(title))
                return BadRequest(new { message = "Please provide a course title." });

            if (!scormPackage.FileName.EndsWith(".zip", StringComparison.OrdinalIgnoreCase))
                return BadRequest(new { message = "Only ZIP files are supported." });

            var result = await _packageService.Upload(scormPackage, title, _environment.WebRootPath);

            if (!result.IsSuccess)
                return BadRequest(new { message = result.Message });

            return Ok(result.Data);
        }

        [HttpDelete("{courseId:guid}")]
        public async Task<IActionResult> Delete(Guid courseId)
        {
            try
            {
                await _packageService.Delete(courseId, _environment.WebRootPath);
                return Ok(new { message = "Course deleted successfully." });
            }
            catch (ArgumentNullException)
            {
                return NotFound(new { message = "Course not found." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting course {CourseId}", courseId);
                return StatusCode(500, new { message = "An error occurred while deleting the course." });
            }
        }

        [HttpPost("{courseId:guid}/launch")]
        public async Task<IActionResult> Launch(Guid courseId, [FromBody] LaunchRequest request)
        {
            if (request?.UserId == Guid.Empty || request?.UserId == null)
                return BadRequest(new { message = "A valid userId is required." });

            var launchInfo = await _runtimeService.LaunchCourseAsync(request.UserId, courseId);

            if (launchInfo == null)
                return NotFound(new { message = "Course not found." });

            return Ok(launchInfo);
        }
    }

    public class LaunchRequest
    {
        public Guid UserId { get; set; }
    }
}
