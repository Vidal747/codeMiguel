import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TypePhoneService } from './typePhone.service';
import { createTypePhoneDto } from './dto/create-typePhone.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@ApiTags('typePhone')
@Controller('typePhone')
export class TypePhoneController {
	constructor(private readonly TypePhoneService: TypePhoneService) {}

	@Post()
	create(@Body() createTypePhoneDto: createTypePhoneDto) {
		return this.TypePhoneService.create(createTypePhoneDto);
	}

	@Get()
	findAll(@Query() paginationDto: PaginationDto) {
		return this.TypePhoneService.findAll(paginationDto);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.TypePhoneService.findOne(id);
	}

	@Put(':id')
	update(@Param('id') id: string, @Body() createTypePhoneDto: createTypePhoneDto) {
		return this.TypePhoneService.update(id, createTypePhoneDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.TypePhoneService.remove(id);
	}
}
