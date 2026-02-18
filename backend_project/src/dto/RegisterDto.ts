import { IsString, MinLength, IsEmail } from 'class-validator';

export class RegisterDto {
    @IsString()
    firstName!: string;

    @IsString()
    lastName!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(4)
    password!: string;
}
