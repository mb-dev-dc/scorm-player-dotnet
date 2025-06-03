using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ScormHostWeb.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialScormSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Courses",
                columns: table => new
                {
                    CourseId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Version = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    PackagePath = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    LaunchScoId = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Courses", x => x.CourseId);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SCOs",
                columns: table => new
                {
                    ScoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CourseId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Identifier = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    LaunchFile = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SCOs", x => x.ScoId);
                    table.ForeignKey(
                        name: "FK_SCOs_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "CourseId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Attempts",
                columns: table => new
                {
                    AttemptId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CourseId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AttemptNumber = table.Column<int>(type: "int", nullable: false),
                    StartedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastAccessedOn = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CompletedOn = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CompletionStatus = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false, defaultValue: "not attempted"),
                    SuccessStatus = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false, defaultValue: "unknown"),
                    ScoreScaled = table.Column<double>(type: "float", nullable: true),
                    ScoreRaw = table.Column<int>(type: "int", nullable: true),
                    ScoreMax = table.Column<int>(type: "int", nullable: true),
                    ScoreMin = table.Column<int>(type: "int", nullable: true),
                    LessonLocation = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    SuspendData = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LaunchData = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LessonMode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    TotalTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    AttemptStateJson = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Attempts", x => x.AttemptId);
                    table.ForeignKey(
                        name: "FK_Attempts_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "CourseId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Attempts_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Attempts_CourseId",
                table: "Attempts",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_Attempts_UserId_CourseId_CompletedOn",
                table: "Attempts",
                columns: new[] { "UserId", "CourseId", "CompletedOn" });

            migrationBuilder.CreateIndex(
                name: "IX_Attempts_UserId_CourseId_StartedOn",
                table: "Attempts",
                columns: new[] { "UserId", "CourseId", "StartedOn" });

            migrationBuilder.CreateIndex(
                name: "IX_SCOs_CourseId",
                table: "SCOs",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Attempts");

            migrationBuilder.DropTable(
                name: "SCOs");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Courses");
        }
    }
}
