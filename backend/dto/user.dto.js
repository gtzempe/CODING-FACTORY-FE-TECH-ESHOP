const bcrypt = require("bcrypt");

exports.toUserListDTO = (users) => {
  return users.map((user) => exports.toUserDTO(user));
};

exports.toUserDTO = (user) => ({
  username: user.username,
  name: user.name,
  surname: user.surname,
  email: user.email,
  address: user.address,
  phone: user.phone,
  roles: user.roles,
  products: user.products,
});

exports.createUserDTO = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  return {
    username: data.username,
    password: hashedPassword,
    name: data.name,
    surname: data.surname,
    email: data.email,
    address: data.address,
    phone: data.phone,
  };
};

exports.toUserUpdateDTO = (body) => {
  return {
    name: body.name,
    surname: body.surname,
    email: body.email,
    address: body.address,
    phone: body.phone,
  };
};
