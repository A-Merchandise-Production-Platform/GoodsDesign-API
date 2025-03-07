// src/main.ts

import { HttpAdapterHost, NestFactory, Reflector } from "@nestjs/core"
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common"
import { AppModule } from "./app.module"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import { PrismaClientExceptionFilter } from "./prisma-client-exception"
import { envConfig } from "./dynamic-modules"

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.enableCors({
        origin: ["http://localhost:3000"],
        credentials: true
    })
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

    const config = new DocumentBuilder()
        .setTitle("GoodsDesign API")
        .setDescription("The GoodsDesign API description")
        .setVersion("1")
        .addBearerAuth(
            {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
                description: "Enter JWT token",
                in: "header"
            },
            "access-token"
        )
        .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup("api", app, document, {
        swaggerOptions: {
            persistAuthorization: true
        }
    })

    const { httpAdapter } = app.get(HttpAdapterHost)
    app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter))

    await app.listen(envConfig().port)
}
bootstrap()
