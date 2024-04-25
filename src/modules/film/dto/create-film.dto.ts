import { IsNumber, IsPositive, IsString } from "class-validator";

export class CreateFilmDto {

    @IsNumber()
    @IsPositive()
    readonly number: number;
    
    @IsString({ message: 'El Tipo de Telefono es inválido' })
    readonly movieId: string;

    @IsString({ message: 'El Tipo de Telefono es inválido' })
    readonly filmStateId: string;
}
