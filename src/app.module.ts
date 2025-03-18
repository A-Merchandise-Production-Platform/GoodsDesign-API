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
import { CategoriesModule } from "./categories"
import { CustomerOrdersModule } from "./customer-orders/customer-orders.module"
import { EnvModule } from "./dynamic-modules"
import { PrismaModule } from "./prisma"
import { ProductsModule } from "./products"
import { RedisModule } from "./redis"
import { NotificationsModule } from "./socket/notifications/notifications.module"
import { SocketModule } from "./socket/socket.module"
import { UsersModule } from "./users"
import { ServeStaticModule } from "@nestjs/serve-static"

@Module({
    imports: [
        EnvModule.forRoot(),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), "src/schema.gql"),
            resolvers: { JSON: GraphQLJSON },
            playground: false,
            plugins: [ApolloServerPluginLandingPageLocalDefault()],
            sortSchema: true,
        }),
        PrismaModule,
        UsersModule,
        AuthModule,
        CategoriesModule,
        ProductsModule,
        RedisModule,
        BlankVariancesModule,
        CustomerOrdersModule,
        NotificationsModule,
        SocketModule,
        ServeStaticModule.forRoot({
            rootPath: join(process.cwd(), "node_modules", "@socket.io", "admin-ui", "ui", "dist"),
            serveRoot: '/admin'
        }),
        ScheduleModule.forRoot()
        // TestModule,
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
