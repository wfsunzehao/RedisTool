using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace redis.WebAPi.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "dbo");

            migrationBuilder.CreateTable(
                name: "BenchmarkFinalData",
                schema: "dbo",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CacheName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TotalDuration = table.Column<double>(type: "float", nullable: false),
                    TimeUnit = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GetsRPS = table.Column<double>(type: "float", nullable: false),
                    GetsAverageLatency = table.Column<double>(type: "float", nullable: false),
                    GetsP50 = table.Column<double>(type: "float", nullable: false),
                    GetsP99 = table.Column<double>(type: "float", nullable: false),
                    GetsP99_90 = table.Column<double>(type: "float", nullable: false),
                    GetsP99_99 = table.Column<double>(type: "float", nullable: false),
                    CompressedHistogram = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TimeStamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BenchmarkFinalData", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "BenchmarkQueue",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    pw = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Region = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Clients = table.Column<int>(type: "int", nullable: false),
                    Threads = table.Column<int>(type: "int", nullable: false),
                    Size = table.Column<int>(type: "int", nullable: false),
                    Requests = table.Column<int>(type: "int", nullable: false),
                    Pipeline = table.Column<int>(type: "int", nullable: false),
                    Times = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    TimeStamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BenchmarkQueue", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BenchmarkRequest",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    pw = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Region = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Clients = table.Column<int>(type: "int", nullable: false),
                    Threads = table.Column<int>(type: "int", nullable: false),
                    Size = table.Column<int>(type: "int", nullable: false),
                    Requests = table.Column<int>(type: "int", nullable: false),
                    Pipeline = table.Column<int>(type: "int", nullable: false),
                    Times = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    TimeStamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BenchmarkRequest", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BenchmarkResultData",
                schema: "dbo",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CacheName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TotalDuration = table.Column<double>(type: "float", nullable: false),
                    TimeUnit = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GetsRPS = table.Column<double>(type: "float", nullable: false),
                    GetsAverageLatency = table.Column<double>(type: "float", nullable: false),
                    GetsP50 = table.Column<double>(type: "float", nullable: false),
                    GetsP99 = table.Column<double>(type: "float", nullable: false),
                    GetsP99_90 = table.Column<double>(type: "float", nullable: false),
                    GetsP99_99 = table.Column<double>(type: "float", nullable: false),
                    CompressedHistogram = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TimeStamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BenchmarkResultData", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Salt = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_Username",
                table: "Users",
                column: "Username",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BenchmarkFinalData",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "BenchmarkQueue",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "BenchmarkRequest",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "BenchmarkResultData",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
