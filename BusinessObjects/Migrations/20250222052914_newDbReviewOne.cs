using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObjects.Migrations
{
    /// <inheritdoc />
    public partial class newDbReviewOne : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FactoryProducts_Products_ProductId",
                table: "FactoryProducts");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductDesigns_ProductVariances_ProductVarianceId",
                table: "ProductDesigns");

            migrationBuilder.DropTable(
                name: "BlankProductsInStocks");

            migrationBuilder.DropTable(
                name: "Areas");

            migrationBuilder.DropTable(
                name: "ProductVariances");

            migrationBuilder.DropIndex(
                name: "IX_ProductDesigns_ProductVarianceId",
                table: "ProductDesigns");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FactoryProducts",
                table: "FactoryProducts");

            migrationBuilder.AddColumn<string>(
                name: "RefreshToken",
                table: "Users",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "RefreshTokenExpiryTime",
                table: "Users",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Value",
                table: "SystemConfigs",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "jsonb",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Bank",
                table: "SystemConfigs",
                type: "jsonb",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Color",
                table: "SystemConfigs",
                type: "jsonb",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "BlankVarianceId",
                table: "ProductDesigns",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AlterColumn<Guid>(
                name: "ProductId",
                table: "FactoryProducts",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddColumn<Guid>(
                name: "BlankVarianceId",
                table: "FactoryProducts",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_FactoryProducts",
                table: "FactoryProducts",
                columns: new[] { "FactoryId", "BlankVarianceId" });

            migrationBuilder.CreateTable(
                name: "BlankVariances",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProductId = table.Column<Guid>(type: "uuid", nullable: false),
                    Information = table.Column<string>(type: "jsonb", nullable: false),
                    BlankPrice = table.Column<string>(type: "text", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DeletedBy = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlankVariances", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BlankVariances_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProductDesigns_BlankVarianceId",
                table: "ProductDesigns",
                column: "BlankVarianceId");

            migrationBuilder.CreateIndex(
                name: "IX_FactoryProducts_BlankVarianceId",
                table: "FactoryProducts",
                column: "BlankVarianceId");

            migrationBuilder.CreateIndex(
                name: "IX_BlankVariances_ProductId",
                table: "BlankVariances",
                column: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_FactoryProducts_BlankVariances_BlankVarianceId",
                table: "FactoryProducts",
                column: "BlankVarianceId",
                principalTable: "BlankVariances",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FactoryProducts_Products_ProductId",
                table: "FactoryProducts",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductDesigns_BlankVariances_BlankVarianceId",
                table: "ProductDesigns",
                column: "BlankVarianceId",
                principalTable: "BlankVariances",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FactoryProducts_BlankVariances_BlankVarianceId",
                table: "FactoryProducts");

            migrationBuilder.DropForeignKey(
                name: "FK_FactoryProducts_Products_ProductId",
                table: "FactoryProducts");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductDesigns_BlankVariances_BlankVarianceId",
                table: "ProductDesigns");

            migrationBuilder.DropTable(
                name: "BlankVariances");

            migrationBuilder.DropIndex(
                name: "IX_ProductDesigns_BlankVarianceId",
                table: "ProductDesigns");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FactoryProducts",
                table: "FactoryProducts");

            migrationBuilder.DropIndex(
                name: "IX_FactoryProducts_BlankVarianceId",
                table: "FactoryProducts");

            migrationBuilder.DropColumn(
                name: "RefreshToken",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "RefreshTokenExpiryTime",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Bank",
                table: "SystemConfigs");

            migrationBuilder.DropColumn(
                name: "Color",
                table: "SystemConfigs");

            migrationBuilder.DropColumn(
                name: "BlankVarianceId",
                table: "ProductDesigns");

            migrationBuilder.DropColumn(
                name: "BlankVarianceId",
                table: "FactoryProducts");

            migrationBuilder.AlterColumn<string>(
                name: "Value",
                table: "SystemConfigs",
                type: "jsonb",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "ProductId",
                table: "FactoryProducts",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_FactoryProducts",
                table: "FactoryProducts",
                columns: new[] { "FactoryId", "ProductId" });

            migrationBuilder.CreateTable(
                name: "Areas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DeletedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Position = table.Column<string>(type: "text", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Areas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProductVariances",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProductId = table.Column<Guid>(type: "uuid", nullable: false),
                    BlankPrice = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DeletedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    Information = table.Column<string>(type: "jsonb", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductVariances", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductVariances_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "BlankProductsInStocks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AreaId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProductVarianceId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DeletedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    QuantityInStock = table.Column<int>(type: "integer", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlankProductsInStocks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BlankProductsInStocks_Areas_AreaId",
                        column: x => x.AreaId,
                        principalTable: "Areas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BlankProductsInStocks_ProductVariances_ProductVarianceId",
                        column: x => x.ProductVarianceId,
                        principalTable: "ProductVariances",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProductDesigns_ProductVarianceId",
                table: "ProductDesigns",
                column: "ProductVarianceId");

            migrationBuilder.CreateIndex(
                name: "IX_BlankProductsInStocks_AreaId",
                table: "BlankProductsInStocks",
                column: "AreaId");

            migrationBuilder.CreateIndex(
                name: "IX_BlankProductsInStocks_ProductVarianceId",
                table: "BlankProductsInStocks",
                column: "ProductVarianceId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductVariances_ProductId",
                table: "ProductVariances",
                column: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_FactoryProducts_Products_ProductId",
                table: "FactoryProducts",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductDesigns_ProductVariances_ProductVarianceId",
                table: "ProductDesigns",
                column: "ProductVarianceId",
                principalTable: "ProductVariances",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
