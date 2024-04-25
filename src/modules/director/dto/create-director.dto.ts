import { IsPhoneNumber, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateDirectorDto {
    @IsString({ message: 'El nombre es inválido' })
    @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    @MaxLength(50, { message: 'El nombre debe tener como máximo 50 caracteres' })
    readonly name: string;

    @IsString({ message: 'El Tipo de Telefono es inválido' })
    @IsUUID('4', { message: 'El tipo de telefono es inválido' })
    readonly typePhoneId: string;

    @IsString({ message: 'El numero de telefono es inválido' })
    @IsPhoneNumber('CO', { message: 'El número de teléfono es inválido' })
    readonly phone: string;

    @IsString({ message: 'El tipo de identificafcacion es inválido' })
    @IsUUID('4', { message: 'El tipo de identificación es inválido' })
    readonly typeDocumentId: string;

    @IsString({ message: 'El documento es inválido' })
    @MinLength(10, { message: 'El documento debe tener 10 caracteres' })
    @MaxLength(10, { message: 'El documento debe tener 10 caracteres' })
    readonly document: string;
}
