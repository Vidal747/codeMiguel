import { Module } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { PartnerController } from './partner.controller';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { FunctionsService } from 'src/common/functions/functions.service';

@Module({
	imports: [PrismaModule],
	providers: [PartnerService, FunctionsService],
	controllers: [PartnerController],
})
export class PartnerModule {}
