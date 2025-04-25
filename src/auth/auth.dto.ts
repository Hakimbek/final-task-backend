import { IsEmail, IsNotEmpty } from "class-validator";

export class SignUpDTO {
    @IsEmail({}, { message: "Provide valid email" })
    @IsNotEmpty({ message: "Email is required" })
    email: string;

    @IsNotEmpty({ message: "Firstname is required" })
    firstname: string;

    @IsNotEmpty({ message: "Lastname is required" })
    lastname: string;

    @IsNotEmpty({ message: "Password is required" })
    password: string;
}

export class LoginDTO {
    @IsEmail({}, { message: "Provide valid email" })
    @IsNotEmpty({ message: "Email is required" })
    email: string;

    @IsNotEmpty({ message: "Password is required" })
    password: string;
}
