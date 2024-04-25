import { Module } from '@nestjs/common';
import { LoanService } from './loan.service';
import { LoanController } from './loan.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { FunctionsService } from 'src/common/functions';

@Module({
  imports: [PrismaModule],
  controllers: [LoanController],
  providers: [LoanService,FunctionsService],
})
export class LoanModule {}
