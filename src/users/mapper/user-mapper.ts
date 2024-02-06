import { PaginateUsersDto } from '../dto/paginate-users.dto';
import { User } from '../entities/user.entity';

export class UserMapper {
  public static toDto(user: User): PaginateUsersDto {
    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      roles: user.roles?.map((role) => role.description),
    };
  }
}
