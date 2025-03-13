import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { PrismaModule } from "./prisma"
import { UsersModule } from "./users"
import { AuthModule } from "./auth"
import { EnvModule } from "./dynamic-modules"
import { CategoriesModule } from "./categories"
import { ProductsModule } from "./products"
import { RedisModule } from "./redis"
import { SystemConfigModule } from "./system-config"
import { GraphQLModule } from "@nestjs/graphql"
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo"
import { join } from "path"
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default"
import { BlankVariancesModule } from "./blank-variances/blank-variances.module"
// import { TestModule } from './test/test.module';

@Module({
    imports: [
        EnvModule.forRoot(),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), "src/schema.gql"),
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
        // TestModule,
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
