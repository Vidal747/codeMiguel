import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FunctionsService } from 'src/common/functions';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Messages } from 'src/common/enums';

@Injectable()
export class LoanService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly functions: FunctionsService,
  ) { }
  async create(createLoanDto: CreateLoanDto) {
    try {
      const {succession,partnerId,filmId,loanStateId } =  createLoanDto;
    
      const actualMovie= await this.prisma.loan.findUnique({
        where: {
          succession,
        },
      });
      if (actualMovie) {
        this.functions.generateResponseApi({
          status: HttpStatus.CONFLICT,
          message: `${Messages.ERROR_CREATING} "Ya existe un prestamo con este Numero".`,
        });
      }
      const loanData = await this.prisma.loan.create({
        data: {
          succession,
          partnerId, 
          filmId,
          loanStateId
        },
      });
      this.functions.generateResponseApi({
        ok: true,
        status: HttpStatus.CREATED,
        message: Messages.SUCCESSFULLY_CREATED,
        data: [loanData],
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else this.functions.generateResponseApi({});
    }
  }

  async findAll(paginationDto: PaginationDto) {
     const { limit = 5, offset = 0 } = paginationDto;
    try {
      const loan = await this.prisma.loan.findMany({
        select: {
          id: true,
          succession:true,
          partnerId: true,
          filmId:true,
          loanStateId:true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          succession: 'asc',
        },
        take: limit,
        skip: offset,
      });

      if (!loan || !loan.length) {
        this.functions.generateResponseApi({
          status: HttpStatus.NOT_FOUND,
          message: Messages.NO_DATA_FOUND,
        });
      }

      this.functions.generateResponseApi({
        ok: true,
        status: HttpStatus.OK,
        data: loan,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else this.functions.generateResponseApi({});
    }
  }

 async findOne(id: string) {
    try {
      const loan = await this.prisma.loan.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          succession:true,
          partnerId: true,
          filmId:true,
          loanStateId:true,
          createdAt: true,
          updatedAt: true,
        },
       
      });

      if (!loan) {
        this.functions.generateResponseApi({
          status: HttpStatus.NOT_FOUND,
          message: Messages.NO_DATA_FOUND,
        });
      }

      this.functions.generateResponseApi({
        ok: true,
        status: HttpStatus.OK,
        data: [loan],
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else this.functions.generateResponseApi({});
    }
  }

 async update(id: string, CreateLoanDto: CreateLoanDto) {
    try {
      const {succession,partnerId,filmId,loanStateId } =  CreateLoanDto;
   

      const loanExists= await this.prisma.loan.findUnique({
        where: {
          succession,
        },
      });
       

      if (!loanExists) {
        this.functions.generateResponseApi({
          status: HttpStatus.NOT_FOUND,
          message: `${Messages.ERROR_UPDATING} "No se encontró la El prestamo".`,
        });
      }

      
      const loanData = await this.prisma.loan.update({
        where: {
          succession,
        },
        data: {
          partnerId, 
          filmId,
          loanStateId
        },
      });

      this.functions.generateResponseApi({
        ok: true,
        status: HttpStatus.OK,
        message: Messages.SUCCESSFULLY_UPDATED,
        data: [loanData],
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else this.functions.generateResponseApi({});
    }
  }

  async remove(id: string) {
		try {
			const loanExists = await this.prisma.loan.findUnique({
				where: {
					id,
				},
			});

			if (!loanExists) {
				this.functions.generateResponseApi({
					status: HttpStatus.NOT_FOUND,
					message: `${Messages.ERROR_DELETING} "No se encontró el prestamo".`,
				});
			}

			await this.prisma.loan.delete({
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
