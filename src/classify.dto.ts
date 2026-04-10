import { IsNotEmpty, IsString, Matches } from "class-validator";

export class NameDto {
    @IsNotEmpty()
    @Matches(/^[a-zA-Z]+$/, {
        message: `Name must be string`
    })
    name: string;
}