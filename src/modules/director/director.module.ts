import { Module } from '@nestjs/common';
import { DirectorService } from './director.service';
import { DirectorController } from './director.controller';
import { FunctionsService } from 'src/common/functions';
import { PrismaModule } from '../prisma/prisma.module';


@Module({
  imports: [PrismaModule],
  controllers: [DirectorController],
  providers: [DirectorService,FunctionsService],
})
export class DirectorModule {}
