import { IsNumber, IsPositive, IsString, MaxLength, MinLength,  } from "class-validator";

export class CreateMovieDto {

    @IsString({ message: 'El nombre es inválido' })
	@MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
	@MaxLength(50, { message: 'El nombre debe tener como máximo 50 caracteres' })
	readonly name: string;

    @IsNumber()
    @IsPositive()
    readonly duration: number;

	@IsString({ message: 'El La Director es inválido' })
	readonly directorId: string;

	@IsString({ message: 'El Genero es inválido' })
	readonly genreId: string;

}
