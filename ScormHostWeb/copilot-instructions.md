SCORM Hosting Service – Technical Specification
 Architecture Overview
 The SCORM Hosting Service is a modular web application built on ASP.NET Core 8. It combines the
 strengths of MVC (Model-View-Controller) for user interface and content delivery, with Minimal APIs for
 lightweight, high-performance RESTful integration. The service acts as a mini-LMS focused on playing
 SCORM content and tracking progress, designed to integrate with a parent LMS via secure APIs. Key
 architectural features include:
  
Support for SCORM 1.2 and SCORM 2004: The system can load and play both SCORM 1.2 and
 SCORM 2004 packages. It provides a JavaScript runtime API (
 1
 API for SCORM 1.2 and 
API_1484_11 for SCORM 2004) so that content can communicate with the LMS as per SCORM
 specifications
 2
 3
 4
 Both SCORM versions’ runtime methods (the 8 core API functions such as
 Initialize/Terminate or LMSInitialize/LMSFinish, GetValue, SetValue, Commit, etc.) are fully
 implemented .
 Modular Layered Design: The application is divided into layers for UI, API, Business Logic, and
 Data. This separation follows enterprise best practices for maintainability and testability. For
 example, the SCORM runtime logic (handling API calls, data model) is in a dedicated service layer,
 decoupled from controllers. The data access layer handles persistence (e.g. via Entity Framework
 Core).
 MVC for UI: An ASP.NET MVC front-end serves the SCORM player interface and any administrative
 pages (e.g. for uploading packages or viewing reports). The MVC UI delivers HTML pages (Razor
 views) that embed the SCORM content (usually in an iframe) and the SCORM JavaScript API adapter.
 Minimal APIs for Integration: All external integration points (for the parent LMS or other services)
 are exposed as RESTful endpoints using ASP.NET Core Minimal API routes. These endpoints are
 prefixed with 
/api and return JSON. Minimal APIs are used for their lightweight overhead and
 straightforward configuration, ideal for high-performance needs and microservice integration.
 Stateless JWT Authentication: JWT (JSON Web Token) Bearer authentication secures all API
 endpoints and content routes. The system trusts a JWT issued by the parent LMS (or its own identity
 provider) to authenticate users and authorize access to courses. Each API call and content launch
 requires a valid JWT in the 
Authorization header. No sensitive data is transmitted without
 verification. JWT claims (such as user ID, roles, and course permissions) are used by the service to
 validate requests.
 SCORM Data Persistence: The service tracks learner progress in a database. This includes
 bookmarking (resume data), suspend data (course state blobs), scores, completion status, session
 time, and other SCORM cmi data model elements. Every time the SCORM content reports progress
 (via the SCORM API calls), the data is captured and persisted to ensure state can be resumed and
 reported accurately.
 Secure Content Delivery: SCORM course files (HTML, JS, videos, etc.) are stored securely on the
 server (or cloud storage) and served through authenticated endpoints. Direct access to content files
 is prevented – users must go through the authorized player. This ensures that only authenticated
 learners with valid tokens can load the SCORM content. The content may be served via an MVC
 1
controller or protected static file middleware that checks auth tokens, preventing deep-linking or
 asset theft.

Rich HTML5 Support: The player imposes no artificial limitations on the SCORM content. It supports
 any HTML5 features included in courses – embedded videos, interactive quizzes, complex JavaScript
 animations, WebGL, etc. Because the SCORM content runs in the user’s browser (in an iframe or new
 window) with full HTML5 capabilities, courses can leverage modern web APIs for an engaging
 experience. The SCORM API adapter is designed not to interfere with other content scripts; it only
 intercepts SCORM-specific calls (e.g. 
LMSSetValue or 
GetValue ) and communicates with the
 backend as needed.
 Scalability and Performance: The system is designed for horizontal scalability. It is stateless
 between requests – all important state is stored in the database – so multiple instances can run
 behind a load balancer. We use asynchronous programming and non-blocking I/O for high
 throughput. The architecture supports cloud deployment and containerization for easy scaling.
 Additionally, features like output caching (for static content), connection pooling for the database,
 and efficient data models are used to ensure the application can serve many concurrent users.
 Concurrency Handling: The design accounts for multi-user and multi-session scenarios. If a user
 attempts to launch the same course in multiple windows or devices concurrently, the system can
 handle it gracefully (for example, by preventing a second simultaneous session for the same SCORM
 attempt to avoid data conflicts
 5
 ). Database updates on SCORM data use optimistic concurrency or
 upsert logic to prevent race conditions (ensuring that, for example, two nearly simultaneous 
Commit calls don’t corrupt the data).
 Error Handling and Robustness: The application follows best practices for error handling. It
 includes global exception handling middleware to catch and log errors on the server side, returning
 friendly error messages or proper HTTP error codes to the API clients. The SCORM JavaScript API
 adapter implements the SCORM error protocol (e.g. it provides meaningful responses for 
GetLastError() and related calls), so content can gracefully handle issues. All API responses
 include appropriate error codes and messages if something fails (e.g. 401 for unauthorized, 400 for
 bad requests, 500 for server errors), and the service logs errors with context for debugging. We also
 implement retry logic or transaction scopes for critical operations like saving progress to ensure
 reliability.
 Security Best Practices: The service is built with security in mind. Besides JWT auth, it enforces
 HTTPS, uses secure cookie settings (if any cookies are used), and sets appropriate CORS policies and 
SameSite cookie policies to allow integration in an iframe safely. For example, if a session cookie or
 auth cookie is ever issued (for the MVC UI), it will be marked 
cross-site embedding
 6
 SameSite=None; Secure to allow
 The APIs define CORS rules so that only the trusted parent LMS origin can
 call them from a browser context, preventing unauthorized JavaScript on other sites from accessing
 the endpoints. All input is validated and data access is restricted to the authorized user’s scope.
 In summary, the SCORM Hosting Service is a self-contained SCORM player service, architected with
 enterprise-grade patterns. It can be deployed independently and interfaced with via REST, making it a
 SCORM microservice that a larger LMS can leverage for SCORM content delivery.
 Project Structure and Folder Layout
 The codebase is organized into a clear folder structure to separate concerns. Below is an overview of the
 main solution structure and key folders/files:
 2
ScormHostService.sln                        // Solution file containing all 
projects
 ├── ScormHost.Web/                          // ASP.NET Core 8 Web App (entry 
point, MVC + APIs)
 │   ├── Program.cs                          // Application bootstrap (configures 
services, middleware, routes)
 │   ├── Startup.cs (optional)               // Alternative startup configuration 
(if using Startup pattern)
 │   ├── Controllers/                        // MVC Controllers for UI and any 
server-rendered pages
 │   │   ├── ScormController.cs              // Controller for launching/playing 
SCORM content (UI)
 │   │   ├── CourseController.cs             // (Optional) Controller for course 
management (upload, list)
 │   │   └── AccountController.cs            // (Optional) Controller for 
authentication (if needed for issuing JWTs)
 │   ├── Pages/ or Views/                    // Razor views for MVC controllers 
(if using Views instead of Pages)
 │   │   └── Scorm/Launch.cshtml             // View that contains the SCORM 
player iframe and JS adapter
 │   ├── wwwroot/                            // Static web content (images, css, 
js). (SCORM content may be served from outside this or via dynamic routes for 
security)
 │   │   └── scripts/scorm-api-adapter.js    // The combined JavaScript SCORM API 
adapter for 1.2 & 2004
 │   ├── MinimalApis/                        // (Optional) Organization for 
minimal API route mappings
 │   │   └── ScormApiEndpoints.cs            // Class grouping minimal API 
endpoint definitions for clarity
 │   ├── Services/                           // C# services (business logic and 
helpers)
 │   │   ├── ScormRuntimeService.cs          // Core logic for SCORM API 
processing (initialize, get/set values, commit)
 │   │   ├── ScormPackageService.cs          // Manages importing SCORM packages, 
extracting manifest, etc.
 │   │   └── AuthService.cs                  // (Optional) Handles JWT generation 
or user validation (if separate auth logic)
 │   ├── Data/                               // Data access layer
 │   │   ├── ScormDbContext.cs               // Entity Framework Core DbContext 
(if using EF for persistence)
 │   │   └── Models/                         // Database model classes (entities)
 │   │       ├── ScormCourse.cs              // Entity for a SCORM course/package 
metadata
 │   │       ├── ScormSco.cs                 // Entity for an individual SCO 
(Sharable Content Object) if needed
 │   │       ├── ScormAttempt.cs             // Entity for a user’s attempt/
 3
progress on a course (tracks suspend data, score, etc.)
 │   │       └── ScormInteraction.cs         // (Optional) Entity for detailed 
interactions or quiz responses (SCORM 2004)
 │   ├── Middleware/                         // Custom middleware components
 │   │   └── JwtAuthenticationMiddleware.cs  // (Optional) Custom JWT validation 
or context enrichment
 │   ├── Config/                             // Configuration files 
(appsettings.json, etc.)
 │   └── ScormHost.Web.csproj                // Project file for the web 
application
 ├── ScormHost.Core/                         // Class library for core domain 
logic (alternatively, integrate into Web)
 │   ├── Models/                             // Domain models (could mirror 
Entities or contain DTOs)
 │   ├── DTOs/                               // Data transfer objects for API 
input/output
 │   ├── Enums/                              // Definitions of SCORM enums (e.g., 
lesson status values)
 │   └── ScormHost.Core.csproj
 ├── ScormHost.Tests/                        // Test project (unit tests for 
services, etc.)
 │   └── ScormRuntimeServiceTests.cs         // Example test class for SCORM 
runtime logic
 └── ScormHost.Deployment/                   // (Optional) Infrastructure as 
code, CI/CD pipeline definitions, Dockerfiles
    ├── Dockerfile                          // Dockerfile for containerizing the 
application
    └── azure-pipelines.yml                 // CI/CD pipeline config (if using 
Azure DevOps, for example)
