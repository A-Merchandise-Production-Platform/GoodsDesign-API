using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObjects.Migrations
{
    /// <inheritdoc />
    public partial class factory_field : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "FactoryProducts",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedBy",
                table: "FactoryProducts",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "FactoryProducts",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DeletedBy",
                table: "FactoryProducts",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "Id",
                table: "FactoryProducts",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "FactoryProducts",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "FactoryProducts",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "UpdatedBy",
                table: "FactoryProducts",
                type: "uuid",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Information",
                table: "Factories",
                type: "jsonb",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Factories",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "FactoryProducts");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "FactoryProducts");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "FactoryProducts");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                table: "FactoryProducts");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "FactoryProducts");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "FactoryProducts");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "FactoryProducts");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "FactoryProducts");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Factories");

            migrationBuilder.AlterColumn<string>(
                name: "Information",
                table: "Factories",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "jsonb");
        }
    }
}
