using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObjects.Migrations
{
    /// <inheritdoc />
    public partial class editPayment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PaymentTransactions_CustomerOrders_CustomerOrderId",
                table: "PaymentTransactions");

            migrationBuilder.DropIndex(
                name: "IX_PaymentTransactions_CustomerOrderId",
                table: "PaymentTransactions");

            migrationBuilder.DropColumn(
                name: "CreatedDate",
                table: "PaymentTransactions");

            migrationBuilder.DropColumn(
                name: "CustomerOrderId",
                table: "PaymentTransactions");

            migrationBuilder.AlterColumn<long>(
                name: "PaymentGatewayTransactionId",
                table: "PaymentTransactions",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<int>(
                name: "OrderCode",
                table: "Payments",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OrderCode",
                table: "Payments");

            migrationBuilder.AlterColumn<string>(
                name: "PaymentGatewayTransactionId",
                table: "PaymentTransactions",
                type: "text",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "PaymentTransactions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "CustomerOrderId",
                table: "PaymentTransactions",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_PaymentTransactions_CustomerOrderId",
                table: "PaymentTransactions",
                column: "CustomerOrderId");

            migrationBuilder.AddForeignKey(
                name: "FK_PaymentTransactions_CustomerOrders_CustomerOrderId",
                table: "PaymentTransactions",
                column: "CustomerOrderId",
                principalTable: "CustomerOrders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
