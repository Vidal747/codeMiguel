import { IsEmail, IsPhoneNumber, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsEmail({}, {message: 'El correo electrónico es inválido'})
    readonly email: string;

    @IsPhoneNumber('CO', {message: 'El número de teléfono es inválido'})
    readonly phone: string;

    @IsString({message: 'El nombre es inválido'})
    @MinLength(3, {message: 'El nombre debe tener al menos 3 caracteres'})
    @MaxLength(50, {message: 'El nombre debe tener como máximo 50 caracteres'})
    readonly name: string;

	@IsString({ message: 'La contraseña debe ser un texto' })
	@MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
	@MaxLength(50, { message: 'La contraseña debe tener como máximo 50 caracteres' })
	@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,50}$/, {
		message: 'La contraseña debe contener al menos una letra minúscula, una mayúscula, un número y un caracter especial.',
	})
	readonly password: string;
}
