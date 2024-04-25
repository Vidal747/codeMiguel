import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FunctionsService } from 'src/common/functions';
import { Messages } from 'src/common/enums';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class FilmService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly functions: FunctionsService,
  ) { }

 async create(createFilmDto: CreateFilmDto) {
    try {
      const {number,filmStateId,movieId } =  createFilmDto;
    
      const actualFilm = await this.prisma.film.findUnique({
        where: {
          number,
        },
      });
      if (actualFilm) {
        this.functions.generateResponseApi({
          status: HttpStatus.CONFLICT,
          message: `${Messages.ERROR_CREATING} "Ya existe una Cinta con este Numero".`,
        });
      }
      const filmData = await this.prisma.film.create({
        data: {
          number,
          filmStateId,
          movieId,
        },
      });
      this.functions.generateResponseApi({
        ok: true,
        status: HttpStatus.CREATED,
        message: Messages.SUCCESSFULLY_CREATED,
        data: [filmData],
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else this.functions.generateResponseApi({});
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 5, offset = 0 } = paginationDto;
    try {
      const film = await this.prisma.film.findMany({
        select: {
          id: true,
          number:true,
          movieId:true,
          filmStateId:true,      
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          number: 'asc',
        },
        take: limit,
        skip: offset,
      });

      if (!film || !film.length) {
        this.functions.generateResponseApi({
          status: HttpStatus.NOT_FOUND,
          message: Messages.NO_DATA_FOUND,
        });
      }

      this.functions.generateResponseApi({
        ok: true,
        status: HttpStatus.OK,
        data: film,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else this.functions.generateResponseApi({});
    }
  }


  async findOne(id: string) {
    try {
      const film = await this.prisma.film.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          number:true,
          movieId:true,
          filmStateId:true,      
          createdAt: true,
          updatedAt: true,
        },
       
      });

      if (!film) {
        this.functions.generateResponseApi({
          status: HttpStatus.NOT_FOUND,
          message: Messages.NO_DATA_FOUND,
        });
      }

      this.functions.generateResponseApi({
        ok: true,
        status: HttpStatus.OK,
        data: [film],
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else this.functions.generateResponseApi({});
    }
  }

  async update(id: string, createFilmDto: CreateFilmDto) {
    try {
      const {number,filmStateId,movieId  } =
      createFilmDto;

      const [filmExists, actualfilm] = await this.prisma.$transaction([
        this.prisma.film.findUnique({
          where: {
            id,
          },
        }),
        this.prisma.film.findUnique({
          where: {
            number,
            AND: {
              id: {
                not: id,
              },
            },
          },
        }),
      ]);

      if (!filmExists) {
        this.functions.generateResponseApi({
          status: HttpStatus.NOT_FOUND,
          message: `${Messages.ERROR_UPDATING} "No se encontró la Cinta".`,
        });
      }

      if (actualfilm) {
        this.functions.generateResponseApi({
          status: HttpStatus.CONFLICT,
          message: `${Messages.ERROR_CREATING} "Ya existe una Cinta con este Documento".`,
        });
      }

      const filmData = await this.prisma.film.update({
        where: {
          id,
        },
        data: {
          number,
          filmStateId,
          movieId,
        },
      });

      this.functions.generateResponseApi({
        ok: true,
        status: HttpStatus.OK,
        message: Messages.SUCCESSFULLY_UPDATED,
        data: [filmData],
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else this.functions.generateResponseApi({});
    }
  }

  async remove(id: string) {
		try {
			const filmExists = await this.prisma.film.findUnique({
				where: {
					id,
				},
			});

			if (!filmExists) {
				this.functions.generateResponseApi({
					status: HttpStatus.NOT_FOUND,
					message: `${Messages.ERROR_DELETING} "No se encontró la Cinta".`,
				});
			}

			await this.prisma.film.delete({
				where: {
					id,
				},
			});

			this.functions.generateResponseApi({
				ok: true,
				status: HttpStatus.OK,
				message: Messages.SUCCESSFULLY_DELETED,
			});
		} catch (error) {
			if (error instanceof HttpException) throw error;
			else this.functions.generateResponseApi({});
		}
	}
}
