using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObjects.Migrations
{
    /// <inheritdoc />
    public partial class fixdb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop the column "Information"
            migrationBuilder.DropColumn(
                name: "Information",
                table: "Factories");

            // Re-add the column "Information" with type jsonb
            migrationBuilder.AddColumn<string>(
                name: "Information",
                table: "Factories",
                type: "jsonb",
                nullable: true);

           
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Revert: Drop the "Information" column
            migrationBuilder.DropColumn(
                name: "Information",
                table: "Factories");

            // Revert: Add back "Information" with string type
            migrationBuilder.AddColumn<string>(
                name: "Information",
                table: "Factories",
                type: "text", // Change this to match the previous type
                nullable: true);

        }
    }
}
