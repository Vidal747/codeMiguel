import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { FilmService } from './film.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';;
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Film')
@Controller('film')
export class FilmController {
  constructor(private readonly filmService: FilmService) {}

  @Post()
  create(@Body() createFilmDto: CreateFilmDto) {
    return this.filmService.create(createFilmDto);
  }

  @Get()
  findAll(@Query() PaginationDto) {
    return this.filmService.findAll(PaginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filmService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() CreateFilmDto: CreateFilmDto) {
    return this.filmService.update(id, CreateFilmDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filmService.remove(id);
  }
}
