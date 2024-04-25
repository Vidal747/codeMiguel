import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { FunctionsService } from 'src/common/functions';

@Module({
  imports: [PrismaModule],
  controllers: [MovieController],
  providers: [MovieService,FunctionsService],
})
export class MovieModule {}
