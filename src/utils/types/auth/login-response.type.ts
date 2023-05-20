import { User } from '../../../modules/users/entities/user.entity';

export type LoginResponseType = Readonly<{
  token: string;
  user: User;
}>;
