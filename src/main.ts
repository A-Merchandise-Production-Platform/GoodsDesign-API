// src/main.ts

import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common"
import { HttpAdapterHost, NestFactory, Reflector } from "@nestjs/core"
import { AppModule } from "./app.module"
import { envConfig } from "./dynamic-modules"
import { PrismaClientExceptionFilter } from "./prisma-client-exception"

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.enableCors({
        origin: ["http://localhost:3000"],
        credentials: true
    })
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

    const { httpAdapter } = app.get(HttpAdapterHost)
    app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter))

    await app.listen(envConfig().port)
    console.log(`Application is running on: http://localhost:${envConfig().port}`)
    console.log(`Admin UI is available at: http://localhost:${envConfig().port}/admin`)
}

bootstrap()
