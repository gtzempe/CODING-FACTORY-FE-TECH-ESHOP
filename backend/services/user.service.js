const userDAO = require("../dao/user.dao");
const userDTO = require("../dto/user.dto");
const { createUserDTO } = require("../dto/user.dto");

exports.findAllUsers = async () => {
  const users = await userDAO.findAllUsers();
  return userDTO.toUserListDTO(users);
};

exports.findUserByUsername = async (username) => {
  return await userDAO.findUserByUsername(username);
};

exports.createUser = async (data) => {
  const userData = await createUserDTO(data);
  const savedUser = await userDAO.createUser(userData);
  return savedUser;
};

exports.updateUser = async (username, userDTO) => {
  return await userDAO.updateUserByUsername(username, userDTO);
};

exports.deleteUser = async (username) => {
  return await userDAO.deleteUserByUsername(username);
};
