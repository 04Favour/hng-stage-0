import { IsNotEmpty, IsString } from 'class-validator';

export class NameDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;
}