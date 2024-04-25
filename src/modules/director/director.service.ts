import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FunctionsService } from 'src/common/functions';
import { Messages } from 'src/common/enums';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateDirectorDto } from './dto/create-director.dto';

@Injectable()
export class DirectorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly functions: FunctionsService,
  ) { }
  async create(createDirectorDto: CreateDirectorDto) {
    try {
      const { typeDocumentId, document, name, phone, typePhoneId } =
      createDirectorDto;
      const actualDirector = await this.prisma.director.findUnique({
        where: {
          document,
        },
      });
      if (actualDirector) {
        this.functions.generateResponseApi({
          status: HttpStatus.CONFLICT,
          message: `${Messages.ERROR_CREATING} "Ya existe un Director con este Documento".`,
        });
      }
      const actorData = await this.prisma.director.create({
        data: {
          name,
          typeDocumentId,
          document,
          typePhoneId,
          phone,
        },
      });
      this.functions.generateResponseApi({
        ok: true,
        status: HttpStatus.CREATED,
        message: Messages.SUCCESSFULLY_CREATED,
        data: [actorData],
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else this.functions.generateResponseApi({});
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 5, offset = 0 } = paginationDto;
    try {
      const director = await this.prisma.director.findMany({
        select: {
          id: true,
          name: true,
          typeDocumentId: true,
          document: true,
          typePhoneId: true,
          phone: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          name: 'asc',
        },
        take: limit,
        skip: offset,
      });

      if (!director || !director.length) {
        this.functions.generateResponseApi({
          status: HttpStatus.NOT_FOUND,
          message: Messages.NO_DATA_FOUND,
        });
      }

      this.functions.generateResponseApi({
        ok: true,
        status: HttpStatus.OK,
        data: director,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else this.functions.generateResponseApi({});
    }
  }

  async findOne(id: string) {
    try {
      const director = await this.prisma.director.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          typeDocumentId: true,
          document: true,
          typePhoneId: true,
          phone: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!director) {
        this.functions.generateResponseApi({
          status: HttpStatus.NOT_FOUND,
          message: Messages.NO_DATA_FOUND,
        });
      }

      this.functions.generateResponseApi({
        ok: true,
        status: HttpStatus.OK,
        data: [director],
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else this.functions.generateResponseApi({});
    }
  }


  async update(id: string, createDirectorDto: CreateDirectorDto) {
    try {
      const { name, phone, typePhoneId, document, typeDocumentId } =
      createDirectorDto;

      const [directorExists, actualDirector] = await this.prisma.$transaction([
        this.prisma.actor.findUnique({
          where: {
            id,
          },
        }),
        this.prisma.actor.findUnique({
          where: {
            document,
            AND: {
              id: {
                not: id,
              },
            },
          },
        }),
      ]);

      if (!directorExists) {
        this.functions.generateResponseApi({
          status: HttpStatus.NOT_FOUND,
          message: `${Messages.ERROR_UPDATING} "No se encontró el Director".`,
        });
      }

      if (actualDirector) {
        this.functions.generateResponseApi({
          status: HttpStatus.CONFLICT,
          message: `${Messages.ERROR_CREATING} "Ya existe un Director con este Documento".`,
        });
      }

      const directorData = await this.prisma.director.update({
        where: {
          id,
        },
        data: {
          name,
          typePhoneId,
          phone,
          typeDocumentId,
          document,
        },
      });

      this.functions.generateResponseApi({
        ok: true,
        status: HttpStatus.OK,
        message: Messages.SUCCESSFULLY_UPDATED,
        data: [directorData],
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else this.functions.generateResponseApi({});
    }
  }

  async remove(id: string) {
		try {
			const directorExists = await this.prisma.actor.findUnique({
				where: {
					id,
				},
			});

			if (!directorExists) {
				this.functions.generateResponseApi({
					status: HttpStatus.NOT_FOUND,
					message: `${Messages.ERROR_DELETING} "No se encontró el director".`,
				});
			}

			await this.prisma.director.delete({
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
