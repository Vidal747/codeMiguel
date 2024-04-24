import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FunctionsService } from 'src/common/functions';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { LoanStates, Messages } from 'src/common/enums';

@Injectable()
export class PartnerService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly functions: FunctionsService,
	) {}

	async create(createPartnerDto: CreatePartnerDto) {
		try {
			const { name, credential, phone, typePhoneId, document, typeDocumentId, address } =
				createPartnerDto;
			const actualPartner = await this.prisma.partner.findUnique({
				where: {
					credential,
				},
			});
			if (actualPartner) {
				this.functions.generateResponseApi({
					status: HttpStatus.CONFLICT,
					message: `${Messages.ERROR_CREATING} "Ya existe un socio con este carnet".`,
				});
			}
			const partnerData = await this.prisma.partner.create({
				data: {
					name,
					credential,
					typePhoneId,
					phone,
					typeDocumentId,
					document,
					address,
				},
			});
			this.functions.generateResponseApi({
				ok: true,
				status: HttpStatus.CREATED,
				message: Messages.SUCCESSFULLY_CREATED,
				data: [partnerData],
			});
		} catch (error) {
			if (error instanceof HttpException) throw error;
			else this.functions.generateResponseApi({});
		}
	}

	async findAll(paginationDto: PaginationDto) {
		const { limit = 5, offset = 0 } = paginationDto;
		try {
			const users = await this.prisma.partner.findMany({
				select: {
					id: true,
					credential: true,
					name: true,
					typePhoneId: true,
					phone: true,
					typeDocumentId: true,
					document: true,
					address: true,
					createdAt: true,
					updatedAt: true,
				},
				orderBy: {
					name: 'asc',
				},
				take: limit,
				skip: offset,
			});

			if (!users || !users.length) {
				this.functions.generateResponseApi({
					status: HttpStatus.NOT_FOUND,
					message: Messages.NO_DATA_FOUND,
				});
			}

			this.functions.generateResponseApi({
				ok: true,
				status: HttpStatus.OK,
				data: users,
			});
		} catch (error) {
			if (error instanceof HttpException) throw error;
			else this.functions.generateResponseApi({});
		}
	}

	async findOne(id: string) {
		try {
			const partner = await this.prisma.partner.findUnique({
				where: {
					id,
				},
				select: {
					id: true,
					credential: true,
					name: true,
					typePhoneId: true,
					phone: true,
					typeDocumentId: true,
					document: true,
					address: true,
					createdAt: true,
					updatedAt: true,
				},
			});

			if (!partner) {
				this.functions.generateResponseApi({
					status: HttpStatus.NOT_FOUND,
					message: Messages.NO_DATA_FOUND,
				});
			}

			this.functions.generateResponseApi({
				ok: true,
				status: HttpStatus.OK,
				data: [partner],
			});
		} catch (error) {
			if (error instanceof HttpException) throw error;
			else this.functions.generateResponseApi({});
		}
	}

	async update(id: string, createPartnerDto: CreatePartnerDto) {
		try {
			const { name, credential, phone, typePhoneId, document, typeDocumentId, address } =
				createPartnerDto;

			const [partnerExists, actualPartner] = await this.prisma.$transaction([
				this.prisma.partner.findUnique({
					where: {
						id,
					},
				}),
				this.prisma.partner.findUnique({
					where: {
						credential,
						AND: {
							id: {
								not: id,
							},
						},
					},
				}),
			]);

			if (!partnerExists) {
				this.functions.generateResponseApi({
					status: HttpStatus.NOT_FOUND,
					message: `${Messages.ERROR_UPDATING} "No se encontró el socio".`,
				});
			}

			if (actualPartner) {
				this.functions.generateResponseApi({
					status: HttpStatus.CONFLICT,
					message: `${Messages.ERROR_CREATING} "Ya existe un Socio con esta credencial".`,
				});
			}

			const partnerData = await this.prisma.partner.update({
				where: {
					id,
				},
				data: {
					name,
					credential,
					typePhoneId,
					phone,
					typeDocumentId,
					document,
					address,
				},
			});

			this.functions.generateResponseApi({
				ok: true,
				status: HttpStatus.OK,
				message: Messages.SUCCESSFULLY_UPDATED,
				data: [partnerData],
			});
		} catch (error) {
			if (error instanceof HttpException) throw error;
			else this.functions.generateResponseApi({});
		}
	}

	async remove(id: string) {
		try {
			const partnerExists = await this.prisma.partner.findUnique({
				where: {
					id,
				},
				include: {
					favoriteActors: true,
					favoriteGenres: true,
					waitingLists: true,
					loans: {
						where: {
							loanState: {
								name: {
									not: LoanStates.RETURNED,
								},
							},
						},
					},
				},
			});

			if (!partnerExists) {
				this.functions.generateResponseApi({
					status: HttpStatus.NOT_FOUND,
					message: `${Messages.ERROR_DELETING} "No se encontró el Socio".`,
				});
			}

			// Prueba para validar si tiene prestamos
			// if (partnerExists.loans.length > 0) {
			// 	this.functions.generateResponseApi({
			// 		status: HttpStatus.CONFLICT,
			// 		message: `${Messages.ERROR_DELETING} "El socio tiene préstamos pendientes".`,
			// 	});
			// }
			// 

			await this.prisma.partner.delete({
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
