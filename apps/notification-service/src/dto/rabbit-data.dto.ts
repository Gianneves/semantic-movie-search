import { IsNotEmpty, IsString } from 'class-validator';

export class RabbitDataDto {
  @IsString()
  @IsNotEmpty()
  requesterId!: string;

  @IsString()
  @IsNotEmpty()
  requesterName!: string;

  @IsString()
  @IsNotEmpty()
  addresseeId!: string;

  @IsString()
  @IsNotEmpty()
  addresseeName!: string;

  @IsString()
  @IsNotEmpty()
  addresseeEmail!: string;
}
