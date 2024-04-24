import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TypePhoneService } from './typePhone.service';
import { FunctionsService } from 'src/common/functions';
import { TypePhoneController } from './typePhone.controller';

@Module({
	imports: [PrismaModule],
	providers: [TypePhoneService, FunctionsService],
	controllers: [TypePhoneController],
})
export class TypePhoneModule {}
