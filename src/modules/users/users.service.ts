import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FunctionsService } from 'src/common/functions';
import { Messages } from 'src/common/enums';
import { compare, hash } from 'bcrypt';

@Injectable()
export class UsersService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly functions: FunctionsService,
	) {}

	async create(createUserDto: CreateUserDto) {
		try {
			const { email, phone, name, password } = createUserDto;
			
			const actualUser = await this.prisma.user.findUnique({
				where: {
					email,
				},
			});

			if (actualUser) {
				this.functions.generateResponseApi({
					status: HttpStatus.CONFLICT,
					message: `${Messages.ERROR_CREATING} "Ya existe un usuario con este correo".`,
				});
			};

			// const passwordMatches = await compare(password, actualUser.password);
			const hashedPassword = await hash(password, 10);

			const userData = await this.prisma.user.create({
				data: {
					email,
					phone,
					name,
					password: hashedPassword,
				},
			});

			this.functions.generateResponseApi({
				ok: true,
				status: HttpStatus.CREATED,
				message: Messages.SECCESSFULLY_CREATED,
				data: [userData],
			});
			
		} catch (error) {
			if (error instanceof HttpException) throw error;
			else this.functions.generateResponseApi({});
		}
	}

	async findAll() {
		try {
			// traer la cantidad de registros junto con los registros, luego aprender a paginar una busqueda 
			const users = await this.prisma.user.findMany({
				select: {
					id: true,
					email: true,
					phone: true,
					name: true,
					posts: {
						select: {
							id: true,
							title: true,
							content: true,
							published: true,
							createdAt: true,							
						}
					},
					createdAt: true,
					updatedAt: true,
				},
				orderBy: {
					name: 'asc',
				}
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
			const users = await this.prisma.user.findUnique({
				where: {
					id
				},
				select: {
					id: true,
					email: true,
					phone: true,
					name: true,
					password: false,
					posts: true,
					createdAt: true,
					updatedAt: true,
				}
			});

			if (!users) {
				this.functions.generateResponseApi({
					status: HttpStatus.NOT_FOUND,
					message: Messages.NO_DATA_FOUND,
				});				
			}

			this.functions.generateResponseApi({
				ok: true,
				status: HttpStatus.OK,
				data: [users],
			});
			
		} catch (error) {
			if (error instanceof HttpException) throw error;
			else this.functions.generateResponseApi({});
		}
	}

	async update(id: string, updateUserDto: UpdateUserDto) {
		try {
			const { email, phone, name, password } = updateUserDto;
			
			const [userExists, actualUser] = await this.prisma.$transaction([
				this.prisma.user.findUnique({
					where: {
						id,
					},
				}),
				this.prisma.user.findUnique({
					where: {
						email,
						AND: {
							id: {
								not: id,
							}
						},
					},
				}),
			]);

			if (!userExists) {
				this.functions.generateResponseApi({
					status: HttpStatus.NOT_FOUND,
					message: `${Messages.ERROR_UPDATING} "No se encontró el usuario".`,
				});
			};

			if (actualUser) {
				this.functions.generateResponseApi({
					status: HttpStatus.CONFLICT,
					message: `${Messages.ERROR_CREATING} "Ya existe un usuario con este correo".`,
				});
			};

			const hashedPassword = await hash(password, 10);

			const userData = await this.prisma.user.update({
				where: {
					id,
				},
				data: {
					email,
					phone,
					name,
					password: hashedPassword,
				}
			});

			this.functions.generateResponseApi({
				ok: true,
				status: HttpStatus.OK,
				message: Messages.SECCESSFULLY_UPDATED,
				data: [userData],
			});
			
		} catch (error) {
			if (error instanceof HttpException) throw error;
			else this.functions.generateResponseApi({});
		}
	}

	async remove(id: string) {
		try {			
			const userExists = await this.prisma.user.findUnique({
				where: {
					id,
				},
				include: {
					posts: true
				}
			});

			if (!userExists) {
				this.functions.generateResponseApi({
					status: HttpStatus.NOT_FOUND,
					message: `${Messages.ERROR_DELETING} "No se encontró el usuario".`,
				});
			};

			await this.prisma.user.delete({
				where: {
					id,
				},
			});

			this.functions.generateResponseApi({
				ok: true,
				status: HttpStatus.OK,
				message: Messages.SECCESSFULLY_DELETED,
			});
			
		} catch (error) {
			if (error instanceof HttpException) throw error;
			else this.functions.generateResponseApi({});
		}
	}
}
