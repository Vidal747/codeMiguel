import { Module } from '@nestjs/common';
import { ActorService } from './actor.service';
import { ActorController } from './actor.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { FunctionsService } from 'src/common/functions';

@Module({
  imports: [PrismaModule],
  providers: [ActorService,FunctionsService],
  controllers: [ActorController],
})
export class ActorModule {}
