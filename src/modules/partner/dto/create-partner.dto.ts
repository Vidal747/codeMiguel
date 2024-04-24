import { Matches, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';
export class CreatePartnerDto {


  @IsString({ message: 'El nombre es inválido' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El nombre debe tener como máximo 50 caracteres' })
  readonly name: string;

  @IsString({ message: 'El La credencial es inválido' })
  @MinLength(3, { message: 'La credencial debe tener al menos 3 caracteres' })
  @MaxLength(20, { message: 'La credencial debe tener como máximo 20 caracteres' })
  readonly credential: string;


  @IsString({ message: 'El Tipo de Telefono es inválido' })
  @Matches(/^(1|2|3)$/, {
    message: 'El tipo de Telefono no es válido .',
  })
  readonly typePhoneId: string;

  @IsString({ message: 'El numero de telefono es inválido' })
  @IsPhoneNumber('CO', { message: 'El número de teléfono es inválido' })
  readonly phone: string;

  @IsString({ message: 'El tipo de identificafcacion es inválido' })
  @Matches(/^(1|2|3|4|5)$/, {
    message: 'El tipo de identificación no es válido .',
  })
  readonly typeDocumentId: string;

  @IsString({ message: 'El documento es inválido' })
  @MinLength(10, { message: 'El documento debe tener 10 caracteres' })
  @MaxLength(10, { message: 'El documento debe tener 10 caracteres' })
  readonly document: string;

  @IsString({ message: 'La direccion es inválida' })
  @MinLength(10, { message: 'La direccion debe tener al menos 10 caracteres' })
  @MaxLength(50, { message: 'La direccion debe tener como máximo 100 caracteres' })
  readonly address: string;

}
