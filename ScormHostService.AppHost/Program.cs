var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Projects.ScormHostWeb>("scormhostweb");

builder.Build().Run();
