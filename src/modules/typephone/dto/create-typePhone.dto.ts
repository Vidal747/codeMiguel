import { IsString, MaxLength, MinLength } from 'class-validator';
export class createTypePhoneDto {
	@IsString({ message: 'El nombre del tipo es inválido' })
	@MinLength(3, { message: 'El nom nombre del tipobre debe tener al menos 3 caracteres' })
	@MaxLength(50, { message: 'El  nombre del tipo debe tener como máximo 50 caracteres' })
	readonly name: string;
}
