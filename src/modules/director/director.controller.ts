import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { DirectorService } from './director.service';
import { CreateDirectorDto } from './dto/create-director.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Director')
@Controller('director')
export class DirectorController {
  constructor(private readonly directorService: DirectorService) { }

  @Post()
  create(@Body() createActorDto: CreateDirectorDto) {
    return this.directorService.create(createActorDto);
  }

  @Get()
  findAll(@Query() PaginationDto) {
    return this.directorService.findAll(PaginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.directorService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() createActorDto: CreateDirectorDto) {
    return this.directorService.update(id, createActorDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.directorService.remove(id);
  }
}
