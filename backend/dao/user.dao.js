const User = require("../models/user.model");

exports.findAllUsers = async () => {
  return await User.find();
};

exports.findUserByUsername = async (username) => {
  return await User.findOne({ username });
};

exports.createUser = async (userData) => {
  const newUser = new User(userData);
  return await newUser.save();
};

exports.updateUserByUsername = async (username, updateData) => {
  return await User.findOneAndUpdate(
    { username },
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

exports.deleteUserByUsername = async (username) => {
  return await User.findOneAndDelete({ username });
};
