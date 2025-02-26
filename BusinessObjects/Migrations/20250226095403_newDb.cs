using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObjects.Migrations
{
    /// <inheritdoc />
    public partial class newDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DesignComponentPositions_DesignPosition_DesignPositionId",
                table: "DesignComponentPositions");

            migrationBuilder.DropForeignKey(
                name: "FK_DesignPosition_ProductDesigns_ProductDesignId",
                table: "DesignPosition");

            migrationBuilder.DropForeignKey(
                name: "FK_DesignPosition_ProductPositionTypes_ProductPositionTypeId",
                table: "DesignPosition");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductDesigns_BlankVariances_BlankVarianceId",
                table: "ProductDesigns");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductDesigns_Users_UserId",
                table: "ProductDesigns");

            migrationBuilder.DropIndex(
                name: "IX_DesignComponentPositions_DesignPositionId",
                table: "DesignComponentPositions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DesignPosition",
                table: "DesignPosition");

            migrationBuilder.DropIndex(
                name: "IX_DesignPosition_ProductDesignId",
                table: "DesignPosition");

            migrationBuilder.DropColumn(
                name: "ProductVarianceId",
                table: "ProductDesigns");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "DesignPosition");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "DesignPosition");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "DesignPosition");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "DesignPosition");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                table: "DesignPosition");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "DesignPosition");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "DesignPosition");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "DesignPosition");

            migrationBuilder.RenameTable(
                name: "DesignPosition",
                newName: "DesignPositions");

            migrationBuilder.RenameIndex(
                name: "IX_DesignPosition_ProductPositionTypeId",
                table: "DesignPositions",
                newName: "IX_DesignPositions_ProductPositionTypeId");

            migrationBuilder.AddColumn<int>(
                name: "Address_DistrictID",
                table: "Factories",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Address_ProvinceID",
                table: "Factories",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Address_Street",
                table: "Factories",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Address_WardCode",
                table: "Factories",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DesignPositionProductDesignId",
                table: "DesignComponentPositions",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "DesignPositionProductPositionTypeId",
                table: "DesignComponentPositions",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "DesignJSON",
                table: "DesignPositions",
                type: "jsonb",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DesignPositions",
                table: "DesignPositions",
                columns: new[] { "ProductDesignId", "ProductPositionTypeId" });

            migrationBuilder.CreateIndex(
                name: "IX_DesignComponentPositions_DesignPositionProductDesignId_Desi~",
                table: "DesignComponentPositions",
                columns: new[] { "DesignPositionProductDesignId", "DesignPositionProductPositionTypeId" });

            migrationBuilder.AddForeignKey(
                name: "FK_DesignComponentPositions_DesignPositions_DesignPositionProd~",
                table: "DesignComponentPositions",
                columns: new[] { "DesignPositionProductDesignId", "DesignPositionProductPositionTypeId" },
                principalTable: "DesignPositions",
                principalColumns: new[] { "ProductDesignId", "ProductPositionTypeId" },
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DesignPositions_ProductDesigns_ProductDesignId",
                table: "DesignPositions",
                column: "ProductDesignId",
                principalTable: "ProductDesigns",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DesignPositions_ProductPositionTypes_ProductPositionTypeId",
                table: "DesignPositions",
                column: "ProductPositionTypeId",
                principalTable: "ProductPositionTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductDesigns_BlankVariances_BlankVarianceId",
                table: "ProductDesigns",
                column: "BlankVarianceId",
                principalTable: "BlankVariances",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductDesigns_Users_UserId",
                table: "ProductDesigns",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DesignComponentPositions_DesignPositions_DesignPositionProd~",
                table: "DesignComponentPositions");

            migrationBuilder.DropForeignKey(
                name: "FK_DesignPositions_ProductDesigns_ProductDesignId",
                table: "DesignPositions");

            migrationBuilder.DropForeignKey(
                name: "FK_DesignPositions_ProductPositionTypes_ProductPositionTypeId",
                table: "DesignPositions");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductDesigns_BlankVariances_BlankVarianceId",
                table: "ProductDesigns");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductDesigns_Users_UserId",
                table: "ProductDesigns");

            migrationBuilder.DropIndex(
                name: "IX_DesignComponentPositions_DesignPositionProductDesignId_Desi~",
                table: "DesignComponentPositions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DesignPositions",
                table: "DesignPositions");

            migrationBuilder.DropColumn(
                name: "Address_DistrictID",
                table: "Factories");

            migrationBuilder.DropColumn(
                name: "Address_ProvinceID",
                table: "Factories");

            migrationBuilder.DropColumn(
                name: "Address_Street",
                table: "Factories");

            migrationBuilder.DropColumn(
                name: "Address_WardCode",
                table: "Factories");

            migrationBuilder.DropColumn(
                name: "DesignPositionProductDesignId",
                table: "DesignComponentPositions");

            migrationBuilder.DropColumn(
                name: "DesignPositionProductPositionTypeId",
                table: "DesignComponentPositions");

            migrationBuilder.DropColumn(
                name: "DesignJSON",
                table: "DesignPositions");

            migrationBuilder.RenameTable(
                name: "DesignPositions",
                newName: "DesignPosition");

            migrationBuilder.RenameIndex(
                name: "IX_DesignPositions_ProductPositionTypeId",
                table: "DesignPosition",
                newName: "IX_DesignPosition_ProductPositionTypeId");

            migrationBuilder.AddColumn<Guid>(
                name: "ProductVarianceId",
                table: "ProductDesigns",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "Id",
                table: "DesignPosition",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "DesignPosition",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedBy",
                table: "DesignPosition",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "DesignPosition",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DeletedBy",
                table: "DesignPosition",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "DesignPosition",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "DesignPosition",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "UpdatedBy",
                table: "DesignPosition",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_DesignPosition",
                table: "DesignPosition",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_DesignComponentPositions_DesignPositionId",
                table: "DesignComponentPositions",
                column: "DesignPositionId");

            migrationBuilder.CreateIndex(
                name: "IX_DesignPosition_ProductDesignId",
                table: "DesignPosition",
                column: "ProductDesignId");

            migrationBuilder.AddForeignKey(
                name: "FK_DesignComponentPositions_DesignPosition_DesignPositionId",
                table: "DesignComponentPositions",
                column: "DesignPositionId",
                principalTable: "DesignPosition",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DesignPosition_ProductDesigns_ProductDesignId",
                table: "DesignPosition",
                column: "ProductDesignId",
                principalTable: "ProductDesigns",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DesignPosition_ProductPositionTypes_ProductPositionTypeId",
                table: "DesignPosition",
                column: "ProductPositionTypeId",
                principalTable: "ProductPositionTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductDesigns_BlankVariances_BlankVarianceId",
                table: "ProductDesigns",
                column: "BlankVarianceId",
                principalTable: "BlankVariances",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductDesigns_Users_UserId",
                table: "ProductDesigns",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
