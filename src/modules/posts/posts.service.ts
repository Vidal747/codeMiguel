import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FunctionsService } from 'src/common/functions';
import { Messages } from 'src/common/enums';

@Injectable()
export class PostsService {
	constructor(
		private prisma: PrismaService,
		private functions: FunctionsService,
	) {}

	async create(createPostDto: CreatePostDto) {
		try {
			const { authorId, title, content, published } = createPostDto;
			
			const authorExists = await this.prisma.user.findUnique({
				where: {
					id: authorId,
				},
			});

			if (!authorExists) {
				this.functions.generateResponseApi({
					status: HttpStatus.NOT_FOUND,
					message: `${Messages.ERROR_CREATING} "El autor no existe".`,
				});
			};

			const postData = await this.prisma.post.create({
				data: {
					authorId,
					title,
					content,
					published,
				},
			});

			this.functions.generateResponseApi({
				ok: true,
				status: HttpStatus.CREATED,
				message: Messages.SECCESSFULLY_CREATED,
				data: [postData],
			});
			
		} catch (error) {
			if (error instanceof HttpException) throw error;
			else this.functions.generateResponseApi({});
		}
	}

	findAll() {
		return `This action returns all posts`;
	}

	findOne(id: number) {
		return `This action returns a #${id} post`;
	}

	update(id: number, updatePostDto: UpdatePostDto) {
		return `This action updates a #${id} post`;
	}

	remove(id: number) {
		return `This action removes a #${id} post`;
	}
}
