export default class UsersRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAll = async () => {
    let result = await this.dao.getAll();
    return result;
  };

  getOne = async (id, email) => {
    let result = await this.dao.getOne(id, email);
    return result;
  };

  updateUser = async (email, value) => {
    let result = await this.dao.updateUser(email, value);
    return result;
  };

  updateUserById = async (id, value) => {
    let result = await this.dao.updateUserById(id, value);
    return result;
  };

  createUser = async (obj) => {
    let result = await this.dao.createUser(obj);
    return result;
  };

  changePassword = async (email, newPass) => {
    let result = await this.dao.changePassword(email, newPass);
    return result;
  };

  deleteUser = async (id, email) => {
    let result = await this.dao.deleteUser(id, email);
    return result;
  };

  changeRoleByAdmin = async (id, role) => {
    let result = await this.dao.changeRoleByAdmin(id, role);
    return result;
  };
}
