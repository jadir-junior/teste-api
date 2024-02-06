import { Role } from 'src/roles/entities/role.entity';

export class UserDto {
  public id: string;
  public firstname: string;
  public lastname: string;
  public email: string;
  public roles: Role[];
  public createdAt: Date;
  public updatedAt: Date;
}
