import { PartialType } from '@nestjs/swagger';
import { createTypePhoneDto } from './create-typePhone.dto';

export class UpdateTypePhoneDto extends PartialType(createTypePhoneDto) {}
