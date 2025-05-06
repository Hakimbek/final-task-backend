import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { In, Repository } from "typeorm";
import { selectUserWithoutPassword } from "./user.dto";
import { S3Service } from "../s3/s3.service";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly s3Service: S3Service,
    ) {}

    getAllUsers = (): Promise<User[]> => this.userRepository.find({
        select: selectUserWithoutPassword
    });

    findById = async (id: string): Promise<User> => {
        const user = await this.userRepository.findOne({
            where: { id },
            select: selectUserWithoutPassword,
            relations: ["templates"]
        })

        if (!user) throw new NotFoundException("User not found");

        return user;
    }

    findByEmail = async (email: string): Promise<User> => {
        const user = await this.userRepository.findOne({ where: { email } });

        if (!user) throw new NotFoundException("User not found");

        return user;
    }

    create = async (
        email: string,
        firstname: string,
        lastname: string,
        password: string
    ): Promise<User> => {
        const createdUser = this.userRepository.create({ email, firstname, lastname, password });

        return await this.userRepository.save(createdUser);
    }

    uploadImage = async (
        url: string,
        id: string
    ): Promise<{ message: string }> => {
        const user = await this.findById(id);

        if (user?.image) {
            await this.s3Service.deleteImageFromUrl(user.image);
        }

        user.image = url;

        await this.userRepository.save(user);

        return { message: "Image uploaded" };
    }

    updateById = async (
        id: string,
        firstname: string,
        lastname: string
    ): Promise<{ message: string }> => {
        const user = await this.findById(id);

        user.firstname = firstname;
        user.lastname = lastname;

        await this.userRepository.save(user);

        return { message: "User successfully updated" };
    }

    deleteById = async (
        id: string
    ): Promise<{ message: string }> => {
        const result = await this.userRepository.delete(id);

        if (result.affected === 0) throw new NotFoundException("User not found or already deleted");

        return { message: "User successfully deleted" };
    }

    deleteByIds = async (
        ids: string[]
    ): Promise<{ message: string }> => {
        await this.checkIds(ids);
        await this.userRepository.delete(ids);

        return { message: "Users successfully deleted" };
    }

    changeStatusByIds = async (
        ids: string[],
        isActive: boolean
    ): Promise<{ message: string }> => {
        await this.checkIds(ids);
        const updatePromises = ids.map(id => this.userRepository.update(id, { isActive }));
        await Promise.all(updatePromises);

        return { message: "Status successfully changed" };
    }

    changeRoleByIds = async (
        ids: string[],
        isAdmin: boolean
    ): Promise<{ message: string }> => {
        await this.checkIds(ids);
        const updatePromises = ids.map(id => this.userRepository.update(id, { isAdmin }));
        await Promise.all(updatePromises);

        return { message: "Status successfully changed" };
    }

    checkIds = async (
        ids: string[]
    ): Promise<void> => {
        const existingUsers = await this.userRepository.findBy({ id: In(ids) });
        const existingIds = existingUsers.map(user => user.id);
        const invalidIds = ids.filter(id => !existingIds.includes(id));

        if (invalidIds.length > 0) throw new BadRequestException("Invalid or non-existent IDs");
    }
}
