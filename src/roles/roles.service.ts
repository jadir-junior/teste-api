import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { DeleteResult, Repository } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    return await this.roleRepository.save(createRoleDto);
  }

  findAll(options: IPaginationOptions): Promise<Pagination<Role>> {
    return paginate<Role>(this.roleRepository, options);
  }

  async findOne(id: string): Promise<Role> {
    return await this.roleRepository.findOne({ where: { id } });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const toUpdate = await this.roleRepository.findOne({ where: { id } });

    const updated = { ...toUpdate, ...updateRoleDto };

    return await this.roleRepository.save(updated);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.roleRepository.delete(id);
  }
}
