import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PartnerService } from './partner.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@ApiTags('partner')
@Controller('partner')
export class PartnerController {
	constructor(private readonly PartnerService: PartnerService) {}

	@Post()
	create(@Body() createPartnerDto: CreatePartnerDto) {
		return this.PartnerService.create(createPartnerDto);
	}

	@Get()
	findAll(@Query() paginationDto: PaginationDto) {
		return this.PartnerService.findAll(paginationDto);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.PartnerService.findOne(id);
	}

	@Put(':id')
	update(@Param('id') id: string, @Body() updateUserDto: CreatePartnerDto) {
		return this.PartnerService.update(id, updateUserDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.PartnerService.remove(id);
	}
}


