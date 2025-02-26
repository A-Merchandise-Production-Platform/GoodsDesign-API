using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObjects.Migrations
{
    /// <inheritdoc />
    public partial class modifyDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CartItems_Products_ProductId",
                table: "CartItems");

            migrationBuilder.DropColumn(
                name: "Address",
                table: "Users");

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

            migrationBuilder.RenameColumn(
                name: "ShippingPrice",
                table: "CustomerOrders",
                newName: "TotalProductPrice");

            migrationBuilder.RenameColumn(
                name: "ProductId",
                table: "CartItems",
                newName: "ProductDesignId");

            migrationBuilder.RenameIndex(
                name: "IX_CartItems_ProductId",
                table: "CartItems",
                newName: "IX_CartItems_ProductDesignId");

            migrationBuilder.AddColumn<string>(
                name: "Addresses",
                table: "Users",
                type: "jsonb",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Factories",
                type: "jsonb",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Note",
                table: "CustomerOrders",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "TotalShippingPrice",
                table: "CustomerOrders",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_CartItems_ProductDesigns_ProductDesignId",
                table: "CartItems",
                column: "ProductDesignId",
                principalTable: "ProductDesigns",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CartItems_ProductDesigns_ProductDesignId",
                table: "CartItems");

            migrationBuilder.DropColumn(
                name: "Addresses",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Address",
                table: "Factories");

            migrationBuilder.DropColumn(
                name: "Note",
                table: "CustomerOrders");

            migrationBuilder.DropColumn(
                name: "TotalShippingPrice",
                table: "CustomerOrders");

            migrationBuilder.RenameColumn(
                name: "TotalProductPrice",
                table: "CustomerOrders",
                newName: "ShippingPrice");

            migrationBuilder.RenameColumn(
                name: "ProductDesignId",
                table: "CartItems",
                newName: "ProductId");

            migrationBuilder.RenameIndex(
                name: "IX_CartItems_ProductDesignId",
                table: "CartItems",
                newName: "IX_CartItems_ProductId");

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Users",
                type: "jsonb",
                nullable: true);

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

            migrationBuilder.AddForeignKey(
                name: "FK_CartItems_Products_ProductId",
                table: "CartItems",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
