import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateReviewDto {

    @IsNotEmpty()
    @IsNumber()
    rating!: number;

    @IsString()
    review!: string;

    @IsString()
    movie!: string;
}