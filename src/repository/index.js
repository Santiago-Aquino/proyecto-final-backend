import { Users }  from '../dao/factory.js';
import UsersRepository from './users.repository.js';

export const userService = new UsersRepository(Users);