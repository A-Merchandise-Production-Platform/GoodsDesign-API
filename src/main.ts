// src/main.ts

import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common"
import { HttpAdapterHost, NestFactory, Reflector } from "@nestjs/core"
import { AppModule } from "./app.module"
import { envConfig } from "./dynamic-modules"
import { PrismaClientExceptionFilter } from "./prisma-client-exception"
import { graphqlUploadExpress } from 'graphql-upload-ts'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    
    // Configure CORS with specific options
    app.enableCors({
        origin: true, // This allows all origins and will reflect the request origin
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: [
            'Origin',
            'X-Requested-With',
            'Content-Type',
            'Accept',
            'Authorization',
            'Access-Control-Allow-Origin'
        ],
        preflightContinue: false,
        optionsSuccessStatus: 204
    });

    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, }))
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

    const { httpAdapter } = app.get(HttpAdapterHost)
    app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter))

    // Enable file uploads for GraphQL
    app.use(
        graphqlUploadExpress({
          maxFileSize: +envConfig().upload.maxFileSize, //50mb
          maxFiles: +envConfig().upload.maxFiles,
          overrideSendResponse: false,
        }),
    )

    await app.listen(envConfig().port)
    console.log(`Admin UI is available at: http://localhost:${envConfig().port}/admin`)
    console.log(`GraphQL Playground is available at: http://localhost:${envConfig().port}/graphql`)
}

bootstrap()
