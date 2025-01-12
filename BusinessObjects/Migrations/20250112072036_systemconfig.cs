using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObjects.Migrations
{
    /// <inheritdoc />
    public partial class systemconfig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BlankProductsInStock_Areas_AreaId",
                table: "BlankProductsInStock");

            migrationBuilder.DropForeignKey(
                name: "FK_BlankProductsInStock_ProductVariances_ProductVarianceId",
                table: "BlankProductsInStock");

            migrationBuilder.DropPrimaryKey(
                name: "PK_BlankProductsInStock",
                table: "BlankProductsInStock");

            migrationBuilder.RenameTable(
                name: "BlankProductsInStock",
                newName: "BlankProductsInStocks");

            migrationBuilder.RenameIndex(
                name: "IX_BlankProductsInStock_ProductVarianceId",
                table: "BlankProductsInStocks",
                newName: "IX_BlankProductsInStocks_ProductVarianceId");

            migrationBuilder.RenameIndex(
                name: "IX_BlankProductsInStock_AreaId",
                table: "BlankProductsInStocks",
                newName: "IX_BlankProductsInStocks_AreaId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_BlankProductsInStocks",
                table: "BlankProductsInStocks",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "SystemConfigs",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Bank = table.Column<string>(type: "jsonb", nullable: true),
                    Color = table.Column<string>(type: "jsonb", nullable: true),
                    Size = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SystemConfigs", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_BlankProductsInStocks_Areas_AreaId",
                table: "BlankProductsInStocks",
                column: "AreaId",
                principalTable: "Areas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_BlankProductsInStocks_ProductVariances_ProductVarianceId",
                table: "BlankProductsInStocks",
                column: "ProductVarianceId",
                principalTable: "ProductVariances",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BlankProductsInStocks_Areas_AreaId",
                table: "BlankProductsInStocks");

            migrationBuilder.DropForeignKey(
                name: "FK_BlankProductsInStocks_ProductVariances_ProductVarianceId",
                table: "BlankProductsInStocks");

            migrationBuilder.DropTable(
                name: "SystemConfigs");

            migrationBuilder.DropPrimaryKey(
                name: "PK_BlankProductsInStocks",
                table: "BlankProductsInStocks");

            migrationBuilder.RenameTable(
                name: "BlankProductsInStocks",
                newName: "BlankProductsInStock");

            migrationBuilder.RenameIndex(
                name: "IX_BlankProductsInStocks_ProductVarianceId",
                table: "BlankProductsInStock",
                newName: "IX_BlankProductsInStock_ProductVarianceId");

            migrationBuilder.RenameIndex(
                name: "IX_BlankProductsInStocks_AreaId",
                table: "BlankProductsInStock",
                newName: "IX_BlankProductsInStock_AreaId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_BlankProductsInStock",
                table: "BlankProductsInStock",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_BlankProductsInStock_Areas_AreaId",
                table: "BlankProductsInStock",
                column: "AreaId",
                principalTable: "Areas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_BlankProductsInStock_ProductVariances_ProductVarianceId",
                table: "BlankProductsInStock",
                column: "ProductVarianceId",
                principalTable: "ProductVariances",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
