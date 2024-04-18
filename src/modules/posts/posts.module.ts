import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { FunctionsService } from 'src/common/functions';

@Module({
	imports: [PrismaModule],
	controllers: [PostsController],
	providers: [PostsService, FunctionsService],
})
export class PostsModule {}
