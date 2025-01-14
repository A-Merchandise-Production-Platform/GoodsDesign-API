using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObjects.Migrations
{
    /// <inheritdoc />
    public partial class order_entities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CustomerOrderDetails",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CustomerOrderId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProductDesignId = table.Column<Guid>(type: "uuid", nullable: true),
                    UnitPrice = table.Column<decimal>(type: "numeric", nullable: false),
                    TotalPrice = table.Column<decimal>(type: "numeric", nullable: true),
                    Quantity = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
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
                    table.PrimaryKey("PK_CustomerOrderDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CustomerOrderDetails_CustomerOrders_CustomerOrderId",
                        column: x => x.CustomerOrderId,
                        principalTable: "CustomerOrders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CustomerOrderDetails_ProductDesigns_ProductDesignId",
                        column: x => x.ProductDesignId,
                        principalTable: "ProductDesigns",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "FactoryOrders",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    FactoryId = table.Column<Guid>(type: "uuid", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    EstimatedCompletionDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TotalItems = table.Column<int>(type: "integer", nullable: false),
                    TotalProductionCost = table.Column<decimal>(type: "numeric", nullable: false),
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
                    table.PrimaryKey("PK_FactoryOrders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FactoryOrders_Factories_FactoryId",
                        column: x => x.FactoryId,
                        principalTable: "Factories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FactoryOrderDetails",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    FactoryOrderId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProductDesignId = table.Column<Guid>(type: "uuid", nullable: false),
                    CustomerOrderDetailId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProductionCost = table.Column<decimal>(type: "numeric", nullable: false),
                    Quantity = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
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
                    table.PrimaryKey("PK_FactoryOrderDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FactoryOrderDetails_CustomerOrderDetails_CustomerOrderDetai~",
                        column: x => x.CustomerOrderDetailId,
                        principalTable: "CustomerOrderDetails",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FactoryOrderDetails_FactoryOrders_FactoryOrderId",
                        column: x => x.FactoryOrderId,
                        principalTable: "FactoryOrders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FactoryOrderDetails_ProductDesigns_ProductDesignId",
                        column: x => x.ProductDesignId,
                        principalTable: "ProductDesigns",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CustomerOrderDetails_CustomerOrderId",
                table: "CustomerOrderDetails",
                column: "CustomerOrderId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerOrderDetails_ProductDesignId",
                table: "CustomerOrderDetails",
                column: "ProductDesignId");

            migrationBuilder.CreateIndex(
                name: "IX_FactoryOrderDetails_CustomerOrderDetailId",
                table: "FactoryOrderDetails",
                column: "CustomerOrderDetailId");

            migrationBuilder.CreateIndex(
                name: "IX_FactoryOrderDetails_FactoryOrderId",
                table: "FactoryOrderDetails",
                column: "FactoryOrderId");

            migrationBuilder.CreateIndex(
                name: "IX_FactoryOrderDetails_ProductDesignId",
                table: "FactoryOrderDetails",
                column: "ProductDesignId");

            migrationBuilder.CreateIndex(
                name: "IX_FactoryOrders_FactoryId",
                table: "FactoryOrders",
                column: "FactoryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FactoryOrderDetails");

            migrationBuilder.DropTable(
                name: "CustomerOrderDetails");

            migrationBuilder.DropTable(
                name: "FactoryOrders");
        }
    }
}
