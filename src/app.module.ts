import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default"
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo"
import { Module } from "@nestjs/common"
import { GraphQLModule } from "@nestjs/graphql"
import { ScheduleModule } from "@nestjs/schedule"
import GraphQLJSON from "graphql-type-json"
import { join } from "path"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { AuthModule } from "./auth"
import { BlankVariancesModule } from "./blank-variances/blank-variances.module"
import { CartItemsModule } from "./cart-items/cart-items.module"
import { CategoriesModule } from "./categories"
import { EnvModule } from "./dynamic-modules"
import { PrismaModule } from "./prisma"
import { ProductsModule } from "./products"
import { RedisModule } from "./redis"
import { NotificationsModule } from "./socket/notifications/notifications.module"
import { SocketModule } from "./socket/socket.module"
import { UsersModule } from "./users"
import { ServeStaticModule } from "@nestjs/serve-static"
import { SystemConfigSizeModule } from "./system-config-size/system-config-size.module"
import { SystemConfigColorModule } from "./system-config-color/system-config-color.module"
import { SystemConfigBankModule } from "./system-config-bank/system-config-bank.module"
import { ProductPositionTypeModule } from "./product-position-type/product-position-type.module"
import { ProductDesignModule } from "./product-design/product-design.module"
import { DesignPositionModule } from "./design-position/design-position.module"
import { FactoryModule } from "./factory/factory.module"

@Module({
    imports: [
        EnvModule.forRoot(),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), "src/schema.gql"),
            resolvers: { JSON: GraphQLJSON },
            playground: false,
            plugins: [ApolloServerPluginLandingPageLocalDefault()],
            sortSchema: true
        }),
        PrismaModule,
        UsersModule,
        AuthModule,
        CategoriesModule,
        ProductsModule,
        RedisModule,
        BlankVariancesModule,
        NotificationsModule,
        SocketModule,
        SystemConfigSizeModule,
        SystemConfigColorModule,
        SystemConfigBankModule,
        ProductPositionTypeModule,
        ProductDesignModule,
        DesignPositionModule,
        CartItemsModule,
        FactoryModule,
        ServeStaticModule.forRoot({
            rootPath: join(process.cwd(), "node_modules", "@socket.io", "admin-ui", "ui", "dist"),
            serveRoot: "/admin"
        }),
        ScheduleModule.forRoot()
        // TestModule,
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
