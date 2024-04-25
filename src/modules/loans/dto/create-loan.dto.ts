import { IsNumber, IsString} from "class-validator";

export class CreateLoanDto {
 

	@IsString({ message: 'El La credencial es inválido' })
	readonly partnerId: string;

	@IsNumber()
	readonly succession: number;

	@IsString({ message: 'El Tipo de Telefono es inválido' })
	readonly filmId: string;

	@IsString({ message: 'El tipo de identificafcacion es inválido' })
	readonly loanStateId: string;

	
}

