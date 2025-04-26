import { IsNotEmpty } from "class-validator";

export class UpdateUserDto {
    @IsNotEmpty({ message: "Firstname is required" })
    firstname: string;

    @IsNotEmpty({ message: "Lastname is required" })
    lastname: string;
}

export class UpdateImageDto {
    @IsNotEmpty({ message: "url is required" })
    url: string;
}

export const selectUserWithoutPassword = {
    id: true,
    email: true,
    firstname: true,
    lastname: true,
    isAdmin: true,
    isActive: true,
    image: true,
}
