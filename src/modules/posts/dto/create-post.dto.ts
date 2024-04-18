import { IsBoolean, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreatePostDto {
    @IsUUID('4', {message: 'El autor id es inválido'})
    authorId: string;

    @IsString({message: 'El título es inválido'})
    @MinLength(3, {message: 'El título debe tener al menos 3 caracteres'})
    @MaxLength(50, {message: 'El título debe tener como máximo 50 caracteres'})
    title: string;

    @IsString({message: 'El contenido es inválido'})
    @MinLength(3, {message: 'El contenido debe tener al menos 3 caracteres'})
    @MaxLength(500, {message: 'El contenido debe tener como máximo 500 caracteres'})
    content: string;

    @IsBoolean({message: 'El estado de publicación es inválido'})
    published: boolean;
}
