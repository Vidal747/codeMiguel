import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FunctionsService } from 'src/common/functions';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { createTypePhoneDto } from './dto/create-typePhone.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Messages } from 'src/common/enums';

@Injectable()
export class TypePhoneService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly functions: FunctionsService,
    ) { }

    async create(createTypePhoneDto: createTypePhoneDto) {
        try {
            const { name } = createTypePhoneDto;
            const actualTypePhone = await this.prisma.typePhone.findUnique({
                where: {
                    name
                },
            });
            if (actualTypePhone) {
                this.functions.generateResponseApi({
                    status: HttpStatus.CONFLICT,
                    message: `${Messages.ERROR_CREATING} "Ya existe este tipo de telefono".`,
                });
            };
            const typePhoneData = await this.prisma.typePhone.create({
                data: {
                    name,
                   
                },
            });
            this.functions.generateResponseApi({
                ok: true,
                status: HttpStatus.CREATED,
                message: Messages.SUCCESSFULLY_CREATED,
                data: [typePhoneData],
            });
        } catch (error) {
            if (error instanceof HttpException) throw error;
            else this.functions.generateResponseApi({});
        }
    }


    async findAll(paginationDto: PaginationDto) {
        const { limit = 5, offset = 0 } = paginationDto;
        try {

            const typePhone = await this.prisma.typePhone.findMany({
                select: {
                    id: true,                  
                    name: true,                  

                },
                orderBy: {
                    name: 'asc',
                },
                take: limit,
                skip: offset,
            });

            if (!typePhone || !typePhone.length) {
                this.functions.generateResponseApi({
                    status: HttpStatus.NOT_FOUND,
                    message: Messages.NO_DATA_FOUND,
                });
            }

            this.functions.generateResponseApi({
                ok: true,
                status: HttpStatus.OK,
                data: typePhone,
            });

        } catch (error) {
            if (error instanceof HttpException) throw error;
            else this.functions.generateResponseApi({});
        }
    }

    async findOne(id: string) {
        try {
            const typePhone = await this.prisma.typePhone.findUnique({
                where: {
                    id
                },
                select: {
                    id: true,
                   
                    name: true,
                   
                }
            });

            if (!typePhone) {
                this.functions.generateResponseApi({
                    status: HttpStatus.NOT_FOUND,
                    message: Messages.NO_DATA_FOUND,
                });
            }

            this.functions.generateResponseApi({
                ok: true,
                status: HttpStatus.OK,
                data: [typePhone],
            });

        } catch (error) {
            if (error instanceof HttpException) throw error;
            else this.functions.generateResponseApi({});
        }
    }

    async update(id: string, CreateTypePhoneDto: createTypePhoneDto) {
        try {
            const { name} = CreateTypePhoneDto;

            const [typePhoneExists, createTypePhoneDto] = await this.prisma.$transaction([
                this.prisma.partner.findUnique({
                    where: {
                        id,
                    },
                }),
                this.prisma.typePhone.findUnique({
                    where: {
                        name,
                        AND: {
                            id: {
                                not: id,
                            }
                        },
                    },
                }),
            ]);

            if (!typePhoneExists) {
                this.functions.generateResponseApi({
                    status: HttpStatus.NOT_FOUND,
                    message: `${Messages.ERROR_UPDATING} "No se encontró el socio".`,
                });
            };

            if (createTypePhoneDto) {
                this.functions.generateResponseApi({
                    status: HttpStatus.CONFLICT,
                    message: `${Messages.ERROR_CREATING} "Ya existe un Socio con esta credencial".`,
                });
            };

            const typePhoneData = await this.prisma.partner.update({
                where: {
                    id,
                },
                data: {
                    name,
                    
                },
            });

            this.functions.generateResponseApi({
                ok: true,
                status: HttpStatus.OK,
                message: Messages.SUCCESSFULLY_UPDATED,
                data: [typePhoneData],
            });

        } catch (error) {
            if (error instanceof HttpException) throw error;
            else this.functions.generateResponseApi({});
        }
    }

    async remove(id: string) {
        try {
            const typePhoneExists = await this.prisma.typePhone.findUnique({
                where: {
                    id,
                },
                
            });

            if (!typePhoneExists) {
                this.functions.generateResponseApi({
                    status: HttpStatus.NOT_FOUND,
                    message: `${Messages.ERROR_DELETING} "No se encontró el Socio".`,
                });
            };

            await this.prisma.typePhone.delete({
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
