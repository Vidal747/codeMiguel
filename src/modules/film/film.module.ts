import { Module } from '@nestjs/common';
import { FilmService } from './film.service';
import { FilmController } from './film.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { FunctionsService } from 'src/common/functions';

@Module({
  imports: [PrismaModule],
  controllers: [FilmController],
  providers: [FilmService,FunctionsService],
})
export class FilmModule {}
