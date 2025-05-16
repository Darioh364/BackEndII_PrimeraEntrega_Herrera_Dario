import UserDao from '../dao/UserDao.js';
import UserDto from '../dto/UserDto.js';



export default class UserRepository {
    // Obtener un usuario por email y devolverlo como un DTO
    async getUserByEmail(email) {
        const user = await UserDao.getByEmail(email);
        if (user) {
            return new UserDto(user); // Retornar como DTO
        }
        return null;
    }

    // Crear un nuevo usuario y devolverlo como un DTO
    async createUser(userData) {
        const user = await UserDao.create(userData);
        const plainUser = JSON.parse(JSON.stringify(user));

        return new UserDto(plainUser);
    }

    // Obtener un usuario por ID y devolverlo como un DTO
    async getUserById(id) {
        const user = await UserDao.getById(id);
        if (user) {
            return new UserDto(user); // Devolver como DTO
        }
        return null;
    }

    // Actualizar la contraseña de un usuario y devolver el resultado como DTO
    async updateUserPassword(id, newPassword) {
        const updatedUser = await UserDao.updatePassword(id, newPassword);
        if (updatedUser) {
            return new UserDto(updatedUser); // Devolver el usuario actualizado como DTO
        }
        return null;
    }
}
