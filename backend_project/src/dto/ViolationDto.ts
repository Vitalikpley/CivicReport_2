import { IsString, MinLength, IsDateString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ViolationDto {
    @IsString()
    @MinLength(1)
    description!: string;

    @IsString()
    @MinLength(1)
    category!: string;

    @IsString()
    photoUrl!: string;

    @IsDateString()
    dateTime!: string;

    @IsNumber()
    latitude!: number;

    @IsNumber()
    longitude!: number;
}

export class SyncViolationDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ViolationDto)
    violations!: ViolationDto[];
}
