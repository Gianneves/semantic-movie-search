import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMovieDto {
    @IsNotEmpty()
    @IsString()
    original_title!: string;


    @IsNotEmpty()
    @IsString()
    overview!: string;

    @IsNotEmpty()
    @IsNumber()
    popularity!: number;

    @IsNotEmpty()
    @IsString()
    release_date!: string;

    @IsNotEmpty({ each: true })
    @IsArray()
    genres!: string[]


    @IsArray()
    @IsNumber({}, { each: true })
    embedding!: number[];

}