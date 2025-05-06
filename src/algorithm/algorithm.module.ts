import { Module } from '@nestjs/common';
import { AlgorithmService } from './algorithm.service';
import { PrismaModule } from 'src/prisma/prisma.module';
@Module({
    imports: [PrismaModule],
    providers: [AlgorithmService],
    exports: [AlgorithmService]
})
export class AlgorithmModule {}
