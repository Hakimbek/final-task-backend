import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { In, Repository } from 'typeorm';
import { selectUserWithoutPassword } from "./user.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    getAllUsers = async () => await this.userRepository.find({
        select: selectUserWithoutPassword
    });

    findById = async (id: string) => {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['templates']
        })

        if (!user) throw new NotFoundException(`User with id ${id} not found`);

        return user;
    }

    findByEmail = async (email: string) => {
        const user = await this.userRepository.findOne({ where: { email } });

        if (!user) throw new NotFoundException(`User with email ${email} not found`);

        return user;
    }

    create = async (email: string, firstname: string, lastname: string, password: string) => {
        try {
            const createdUser = this.userRepository.create({ email, firstname, lastname, password });
            await this.userRepository.save(createdUser);
        } catch {
            throw new ConflictException('Email already in use');
        }
    }

    uploadImage = async (url: string, id: string) => {
        const user = await this.findById(id);

        user.image = url;

        await this.userRepository.save(user);

        return 'User is updated successfully';
    }

    updateById = async (id: string, firstname: string, lastname: string) => {
        try {
            const user = await this.findById(id);

            user.firstname = firstname;
            user.lastname = lastname;

            await this.userRepository.save(user);

            return 'User is updated successfully';
        } catch (error) {
            throw new InternalServerErrorException('Failed to update user');
        }
    }

    deleteById = async (id: string) => {
        const result = await this.userRepository.delete(id);

        if (result.affected === 0) throw new NotFoundException('User not found or already deleted');

        return `User with ID ${id} deleted successfully`;
    }

    deleteByIds = async (ids: string[]) => {
        await this.checkIds(ids);
        await this.userRepository.delete(ids);

        return await this.getAllUsers();
    }

    changeStatusByIds = async (ids: string[], isActive: boolean) => {
        await this.checkIds(ids);
        const updatePromises = ids.map(id => this.userRepository.update(id, { isActive }));
        await Promise.all(updatePromises);

        return await this.getAllUsers();
    }

    changeRoleByIds = async (ids: string[], isAdmin: boolean) => {
        await this.checkIds(ids);
        const updatePromises = ids.map(id => this.userRepository.update(id, { isAdmin }));
        await Promise.all(updatePromises);

        return await this.getAllUsers();
    }

    checkIds = async (ids: string[]) => {
        const existingUsers = await this.userRepository.findBy({ id: In(ids) });
        const existingIds = existingUsers.map(user => user.id);
        const invalidIds = ids.filter(id => !existingIds.includes(id));

        if (invalidIds.length > 0) throw new BadRequestException(`Invalid or non-existent IDs: ${invalidIds.join(', ')}`);
    }
}
