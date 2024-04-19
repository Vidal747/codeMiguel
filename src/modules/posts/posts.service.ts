import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FunctionsService } from 'src/common/functions';
import { Messages } from 'src/common/enums';
import { error } from 'console';

@Injectable()
export class PostsService {
	constructor(
		private prisma: PrismaService,
		private functions: FunctionsService,
	) { }

	async create(createPostDto: CreatePostDto) {
		try {
			const { authorId, title, content, published } = createPostDto;

			const authorExists = await this.prisma.user.findUnique({
				where: {
					id: authorId,
				},
			});

			if (!authorExists) {
				return this.functions.generateResponseApi({
					status: HttpStatus.NOT_FOUND,
					message: `${Messages.ERROR_CREATING} "El autor no existe".`,
				});
			}

			const postData = await this.prisma.post.create({
				data: {
					authorId,
					title,
					content,
					published,
				},
			});

			return this.functions.generateResponseApi({
				ok: true,
				status: HttpStatus.CREATED,
				message: Messages.SECCESSFULLY_CREATED,
				data: [postData],
			});

		} catch (error) {
			if (error instanceof HttpException) throw error;
			else return this.functions.generateResponseApi({});
		}
	}

	async findAll() {

		try {
			const post = await this.prisma.post.findMany({
				select: {
					id: true,
					authorId: true,
					title: true,
					content: true,
					published: true,
					createdAt: true,
				}

			})

			if (!post || !post.length) {
				this.functions.generateResponseApi({
					status: HttpStatus.NOT_FOUND,
					message: Messages.NO_DATA_FOUND,
				});
			}
			this.functions.generateResponseApi({
				ok: true,
				status: HttpStatus.OK,
				data: post,

			})
		} catch (error) {
			if (error instanceof HttpException) throw error;
			else this.functions.generateResponseApi({});
		}

	}

	async findOne(id: string) {
		try {

			const post = await this.prisma.post.findMany({
				where: {
					id
				},
				select: {
					id: true,
					title: true,
					content: true,
					published: true,
					createdAt: true,
				}

			})
			if (!post || !post.length) {
				this.functions.generateResponseApi({
					status: HttpStatus.NOT_FOUND,
					message: Messages.NO_DATA_FOUND,
				});
			}
			this.functions.generateResponseApi({
				ok: true,
				status: HttpStatus.OK,
				data: post,
			});
		} catch (error) {
			if (error instanceof HttpException) throw error;
			else this.functions.generateResponseApi({});
		}

	}

	async update(id: string, updatePostDto: UpdatePostDto) {
		try {
			const { title, content, published } = updatePostDto;

			const postExist = await this.prisma.post.findUnique({
					where: {
						id,
					}
				})

			if (!postExist) {
				this.functions.generateResponseApi({
					status: HttpStatus.NOT_FOUND,
					message: `${Messages.ERROR_UPDATING} "No se encontró el post".`,
				});
			};
			const postData = await this.prisma.post.update({
				where: {
					id,
				},
				data: {
					title,
					content,
					published,

				},
			});


			this.functions.generateResponseApi({
				ok: true,
				status: HttpStatus.OK,
				message: Messages.SECCESSFULLY_UPDATED,
				data: [postData],
			});

		} catch (error) {
			if (error instanceof HttpException) throw error;
			else this.functions.generateResponseApi({});
		}
	}

	async remove(id: string) {
		try {
			const postExists = await this.prisma.post.findUnique({
				where: {
					id,
				},

			});

			if (!postExists) {
				this.functions.generateResponseApi({
					status: HttpStatus.NOT_FOUND,
					message: `${Messages.ERROR_DELETING} "No se encontró el usuario".`,
				});
			};

			await this.prisma.post.delete({
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
