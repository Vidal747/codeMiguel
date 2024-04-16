import { Module } from '@nestjs/common';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { FunctionsService } from 'src/common/functions';

@Module({
	imports: [PrismaModule],
	controllers: [UsersController],
	providers: [UsersService, FunctionsService],
})
export class UsersModule {}
