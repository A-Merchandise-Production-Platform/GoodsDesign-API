// src/main.ts

import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common"
import { HttpAdapterHost, NestFactory, Reflector } from "@nestjs/core"
import { AppModule } from "./app.module"
import { envConfig } from "./dynamic-modules"
import { PrismaClientExceptionFilter } from "./prisma-client-exception"
import { graphqlUploadExpress } from 'graphql-upload-ts'

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
      cors: {
        origin: ["https://goodsdesign.uydev.id.vn"]
      }
    })
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, }))
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

    const { httpAdapter } = app.get(HttpAdapterHost)
    app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter))

    // Enable file uploads for GraphQL
    app.use(
        graphqlUploadExpress({
          maxFileSize: +envConfig().upload.maxFileSize, //50mb
          maxFiles: +envConfig().upload.maxFiles,
          overrideSendResponse: false, // This is necessary for nest.js/koa.js
        }),
    )

    await app.listen(envConfig().port)
    console.log(`Admin UI is available at: http://localhost:${envConfig().port}/admin`)
    console.log(`GraphQL Playground is available at: http://localhost:${envConfig().port}/graphql`)
}

bootstrap()
