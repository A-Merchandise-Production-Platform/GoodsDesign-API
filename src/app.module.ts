import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default"
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo"
import { Module } from "@nestjs/common"
import { GraphQLModule } from "@nestjs/graphql"
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
import { SystemConfigModule } from "./system-config"
import { UsersModule } from "./users"

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
        SystemConfigModule,
        BlankVariancesModule,
        CustomerOrdersModule
        // TestModule,
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
