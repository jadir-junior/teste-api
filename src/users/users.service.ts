import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Role } from 'src/roles/entities/role.entity';
import { PaginateUsersDto } from './dto/paginate-users.dto';
import { UserMapper } from './mapper/user-mapper';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const roles = await this.roleRepository.find({
      where: { description: In(createUserDto.roles) },
    });

    const user = { ...createUserDto, ...{ roles } };

    return await this.userRepository.save(user);
  }

  async findAll(
    options: IPaginationOptions,
  ): Promise<Pagination<PaginateUsersDto>> {
    const pagination = await paginate<User>(this.userRepository, options, {
      relations: { roles: true },
    });

    return {
      ...pagination,
      ...{ items: pagination.items.map((item) => UserMapper.toDto(item)) },
    };
  }

  async findOne(id: string): Promise<UserDto> {
    return await this.userRepository.findOne({
      where: { id },
      relations: { roles: true },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const toUpdate = await this.userRepository.findOne({ where: { id } });

    const updated = { ...toUpdate, ...updateUserDto };

    // return await this.userRepository.save(updated);
    return await new Promise((resolve) => resolve('fake'));
  }

  async remove(id: string) {
    return await this.userRepository.delete(id);
  }
}
