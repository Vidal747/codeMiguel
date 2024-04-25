import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FunctionsService } from 'src/common/functions';
import { Messages } from 'src/common/enums';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class MovieService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly functions: FunctionsService,
  ) { }
  async create(createMovieDto: CreateMovieDto) {
    try {
      const {name,duration,genreId,directorId } =  createMovieDto;
    
      const actualMovie= await this.prisma.movie.findUnique({
        where: {
          name,
        },
      });
      if (actualMovie) {
        this.functions.generateResponseApi({
          status: HttpStatus.CONFLICT,
          message: `${Messages.ERROR_CREATING} "Ya existe una Cinta con este Numero".`,
        });
      }
      const movieData = await this.prisma.movie.create({
        data: {
         name,
         duration, 
         genreId,
         directorId
        },
      });
      this.functions.generateResponseApi({
        ok: true,
        status: HttpStatus.CREATED,
        message: Messages.SUCCESSFULLY_CREATED,
        data: [movieData],
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else this.functions.generateResponseApi({});
    }
  }

 async findAll(paginationDto: PaginationDto) {
    const { limit = 5, offset = 0 } = paginationDto;
    try {
      const movie = await this.prisma.movie.findMany({
        select: {
          id: true,
          name:true,
          duration:true, 
          genreId:true,
          directorId:true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          name: 'asc',
        },
        take: limit,
        skip: offset,
      });

      if (!movie || !movie.length) {
        this.functions.generateResponseApi({
          status: HttpStatus.NOT_FOUND,
          message: Messages.NO_DATA_FOUND,
        });
      }

      this.functions.generateResponseApi({
        ok: true,
        status: HttpStatus.OK,
        data: movie,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else this.functions.generateResponseApi({});
    }
  }

  async findOne(id: string) {
    try {
      const movie = await this.prisma.movie.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          name:true,
          duration:true, 
          genreId:true,
          directorId:true,
          createdAt: true,
          updatedAt: true,
        },
       
      });

      if (!movie) {
        this.functions.generateResponseApi({
          status: HttpStatus.NOT_FOUND,
          message: Messages.NO_DATA_FOUND,
        });
      }

      this.functions.generateResponseApi({
        ok: true,
        status: HttpStatus.OK,
        data: [movie],
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else this.functions.generateResponseApi({});
    }
  }

   async update(id: string, createMovieDto: CreateMovieDto) {
    try {
      const {name,duration,genreId,directorId } =  createMovieDto;
   

      const [movieExists, actualMovie] = await this.prisma.$transaction([
        this.prisma.movie.findUnique({
          where: {
            id,
          },
        }),
        this.prisma.movie.findUnique({
          where: {
            name,
            AND: {
              id: {
                not: id,
              },
            },
          },
        }),
      ]);

      if (!movieExists) {
        this.functions.generateResponseApi({
          status: HttpStatus.NOT_FOUND,
          message: `${Messages.ERROR_UPDATING} "No se encontró la Peliciula".`,
        });
      }

      if (actualMovie) {
        this.functions.generateResponseApi({
          status: HttpStatus.CONFLICT,
          message: `${Messages.ERROR_CREATING} "Ya existe una Peliciula con este Nombre".`,
        });
      }

      const movieData = await this.prisma.movie.update({
        where: {
          id,
        },
        data: {
          name,
          duration, 
          genreId,
          directorId
        },
      });

      this.functions.generateResponseApi({
        ok: true,
        status: HttpStatus.OK,
        message: Messages.SUCCESSFULLY_UPDATED,
        data: [movieData],
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else this.functions.generateResponseApi({});
    }
  }

  async remove(id: string) {
		try {
			const movieExists = await this.prisma.movie.findUnique({
				where: {
					id,
				},
			});

			if (!movieExists) {
				this.functions.generateResponseApi({
					status: HttpStatus.NOT_FOUND,
					message: `${Messages.ERROR_DELETING} "No se encontró la Pelicula".`,
				});
			}

			await this.prisma.movie.delete({
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
