import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default"
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo"
import { Module } from "@nestjs/common"
import { GraphQLModule } from "@nestjs/graphql"
import { ServeStaticModule } from "@nestjs/serve-static"
import GraphQLJSON from "graphql-type-json"
import { join } from "path"
import { AddressesModule } from "./addresses/addresses.module"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { AuthModule } from "./auth"
import { CartItemsModule } from "./cart-items/cart-items.module"
import { CategoriesModule } from "./categories"
import { CronModule } from "./cron/cron.module"
import { CustomerOrdersModule } from "./customer-orders/customer-orders.module"
import { DesignPositionModule } from "./design-position/design-position.module"
import { EnvModule } from "./dynamic-modules"
import { FactoryModule } from "./factory/factory.module"
import { FileModule } from "./file/file.module"
import { MailModule } from "./mail/mail.module"
import { PaymentGatewayModule } from "./payment-gateway/payment-gateway.module"
import { PrismaModule } from "./prisma"
import { ProductDesignModule } from "./product-design/product-design.module"
import { ProductPositionTypeModule } from "./product-position-type/product-position-type.module"
import { ProductsModule } from "./products"
import { RedisModule } from "./redis"
import { ShippingModule } from "./shipping/shipping.module"
import { SystemConfigBankModule } from "./system-config-bank/system-config-bank.module"
import { SystemConfigVariantModule } from "./system-config-variant/system-config-variant.module"
import { UsersModule } from "./users"
import { StaffTasksModule } from "./staff-tasks/staff-tasks.module"
import { NotificationsModule } from "./notifications/notifications.module"
import { FactoryOrdersModule } from "./factory-orders/factory-orders.module"
import { DashboardModule } from './dashboard/dashboard.module'
import { FactoryProductsModule } from "./factory-products/factory-products.module"

@Module({
    imports: [
        EnvModule.forRoot(),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), "src/schema.gql"),
            csrfPrevention: false,
            resolvers: { JSON: GraphQLJSON },
            playground: false,
            plugins: [
                ApolloServerPluginLandingPageLocalDefault({
                    embed: true
                })
            ],
            sortSchema: true
        }),
        PrismaModule,
        UsersModule,
        AuthModule,
        CategoriesModule,
        ProductsModule,
        RedisModule,
        SystemConfigBankModule,
        ProductPositionTypeModule,
        ProductDesignModule,
        DesignPositionModule,
        CartItemsModule,
        FactoryModule,
        ShippingModule,
        FileModule,
        MailModule,
        CustomerOrdersModule,
        ServeStaticModule.forRoot({
            rootPath: join(process.cwd(), "node_modules", "@socket.io", "admin-ui", "ui", "dist"),
            serveRoot: "/admin"
        }),
        AddressesModule,
        PaymentGatewayModule,
        SystemConfigVariantModule,
        CronModule,
        NotificationsModule,
        FactoryOrdersModule,
        StaffTasksModule,
        DashboardModule,
        // FactoryProductsModule
        // TestModule,
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
