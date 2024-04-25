import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateActorDto } from './dto/create-actor.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FunctionsService } from 'src/common/functions';
import { Messages } from 'src/common/enums';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ActorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly functions: FunctionsService,
  ) { }
  async create(createActorDto: CreateActorDto) {
    try {
      const { typeDocumentId, document, name, phone, typePhoneId } =
        createActorDto;
      const actualActor = await this.prisma.actor.findUnique({
        where: {
          document,
        },
      });
      if (actualActor) {
        this.functions.generateResponseApi({
          status: HttpStatus.CONFLICT,
          message: `${Messages.ERROR_CREATING} "Ya existe un actor con este Documento".`,
        });
      }
      const actorData = await this.prisma.actor.create({
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
      const actor = await this.prisma.actor.findMany({
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

      if (!actor || !actor.length) {
        this.functions.generateResponseApi({
          status: HttpStatus.NOT_FOUND,
          message: Messages.NO_DATA_FOUND,
        });
      }

      this.functions.generateResponseApi({
        ok: true,
        status: HttpStatus.OK,
        data: actor,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else this.functions.generateResponseApi({});
    }
  }

  async findOne(id: string) {
    try {
      const actor = await this.prisma.actor.findUnique({
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

      if (!actor) {
        this.functions.generateResponseApi({
          status: HttpStatus.NOT_FOUND,
          message: Messages.NO_DATA_FOUND,
        });
      }

      this.functions.generateResponseApi({
        ok: true,
        status: HttpStatus.OK,
        data: [actor],
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else this.functions.generateResponseApi({});
    }
  }


  async update(id: string, createActorDto: CreateActorDto) {
    try {
      const { name, phone, typePhoneId, document, typeDocumentId } =
        createActorDto;

      const [actorExists, actualActor] = await this.prisma.$transaction([
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

      if (!actorExists) {
        this.functions.generateResponseApi({
          status: HttpStatus.NOT_FOUND,
          message: `${Messages.ERROR_UPDATING} "No se encontró el Actor".`,
        });
      }

      if (actualActor) {
        this.functions.generateResponseApi({
          status: HttpStatus.CONFLICT,
          message: `${Messages.ERROR_CREATING} "Ya existe un Actor con este Documento".`,
        });
      }

      const actorData = await this.prisma.actor.update({
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
        data: [actorData],
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else this.functions.generateResponseApi({});
    }
  }

  async remove(id: string) {
		try {
			const actorExists = await this.prisma.actor.findUnique({
				where: {
					id,
				},
			});

			if (!actorExists) {
				this.functions.generateResponseApi({
					status: HttpStatus.NOT_FOUND,
					message: `${Messages.ERROR_DELETING} "No se encontró el actor".`,
				});
			}

			await this.prisma.actor.delete({
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
