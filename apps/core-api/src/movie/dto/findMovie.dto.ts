import { IsString, MaxLength } from "class-validator";

export class FindMovieDto {
    @IsString()
    @MaxLength(500)
    input!: string;
}