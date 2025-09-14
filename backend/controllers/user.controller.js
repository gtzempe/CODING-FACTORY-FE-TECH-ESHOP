// const User = require("../models/user.model");
// const bcrypt = require("bcrypt");
const userDAO = require("../dao/user.dao");
const logger = require("../utils/logger");
const userService = require("../services/user.service");
const userDTOmapper = require("../dto/user.dto");

exports.findAll = async (req, res) => {
  logger.info(`GET /api/users - Fetching all users by: ${req.user.username}`);

  try {
    const result = await userService.findAllUsers();
    logger.info(`GET /api/users - Users retrieved successfully`);
    res.status(200).json({ status: true, data: result });
  } catch (err) {
    logger.error(`GET /api/users - Failed: ${err.message}`);
    res.status(400).json({ status: false, data: err.message });
  }
};

exports.findOne = async (req, res) => {
  const username = req.params.username;
  logger.info(`GET /api/users/${username} - Fetching user`);

  try {
    const result = await userService.findUserByUsername(username);
    if (result) {
      logger.info(`GET /api/users/${username} - User found successfully`);
      res.status(200).json({ status: true, data: result });
    } else {
      res.status(404).json({ status: false, data: null });
      logger.warn(`GET /api/users/${username} - User not found`);
    }
  } catch (err) {
    res.status(500).json({ status: false, data: err });
    logger.error(`GET /api/users - Failed to retrieve users: ${err.message}`);
  }
};

exports.create = async (req, res) => {
  logger.info(`POST /api/users - Creating new user: ${req.body.username}`);

  try {
    const result = await userService.createUser(req.body);

    if (!result) {
      logger.warn(`POST /api/users - Creation failed`);
      return res
        .status(400)
        .json({ status: false, data: "User creation failed" });
    }

    logger.info(`POST /api/users - User created successfully`);
    res.status(201).json({ status: true, data: result });
  } catch (err) {
    logger.error(`POST /api/users - Error: ${err.message}`);
    res.status(500).json({ status: false, data: err.message });
  }
};

exports.update = async (req, res) => {
  const username = req.params.username;
  logger.info(`PUT /api/users/${username} - Updating user`);

  const userDTO = userDTOmapper.toUserUpdateDTO(req.body);

  try {
    const result = await userService.updateUser(username, userDTO);

    if (!result) {
      logger.warn(`PUT /api/users/${username} - User not found`);
      return res.status(404).json({ status: false, data: "User not found" });
    }

    logger.info(`PUT /api/users/${username} - User updated successfully`);
    res.status(200).json({ status: true, data: result });
  } catch (err) {
    logger.error(`PUT /api/users/${username} - Failed: ${err.message}`);
    res.status(400).json({ status: false, data: err.message });
  }
};

exports.delete = async (req, res) => {
  const username = req.params.username;
  logger.info(`DELETE /api/users/${username} - Deleting user`);

  try {
    const result = await userService.deleteUser(username);

    if (!result) {
      logger.warn(`DELETE /api/users/${username} - User not found`);
      return res.status(404).json({ status: false, data: "User not found" });
    }

    logger.info(`DELETE /api/users/${username} - User deleted successfully`);
    res.status(200).json({ status: true, data: result });
  } catch (err) {
    logger.error(`DELETE /api/users/${username} - Failed: ${err.message}`);
    res.status(400).json({ status: false, data: err.message });
  }
};

exports.findMe = async (req, res) => {
  const username = req.user.username;
  logger.info(`GET /api/users/me - Fetching current user: ${username}`);

  try {
    const result = await userService.findUserByUsername(username);
    if (!result) {
      logger.warn(`GET /api/users/me - User not found`);
      return res.status(404).json({ status: false, data: "User not found" });
    }

    res.status(200).json({ status: true, data: result });
    logger.info(`GET /api/users/me - Success`);
  } catch (err) {
    logger.error(`GET /api/users/me - Failed: ${err.message}`);
    res.status(500).json({ status: false, data: err.message });
  }
};

exports.updateMe = async (req, res) => {
  const username = req.user.username;
  logger.info(`PUT /api/users/me - Updating user: ${username}`);

  const userDTO = userDTOmapper.toUserUpdateDTO(req.body);

  try {
    const result = await userService.updateUser(username, userDTO);
    if (!result) {
      logger.warn(`PUT /api/users/me - User not found`);
      return res.status(404).json({ status: false, data: "User not found" });
    }

    res.status(200).json({ status: true, data: result });
    logger.info(`PUT /api/users/me - Success`);
  } catch (err) {
    logger.error(`PUT /api/users/me - Failed: ${err.message}`);
    res.status(400).json({ status: false, data: err.message });
  }
};

exports.deleteMe = async (req, res) => {
  const username = req.user.username;
  logger.info(`DELETE /api/users/me - Deleting user: ${username}`);

  try {
    const result = await userService.deleteUser(username);
    if (!result) {
      logger.warn(`DELETE /api/users/me - User not found`);
      return res.status(404).json({ status: false, data: "User not found" });
    }

    res.status(200).json({ status: true, data: result });
    logger.info(`DELETE /api/users/me - Success`);
  } catch (err) {
    logger.error(`DELETE /api/users/me - Failed: ${err.message}`);
    res.status(400).json({ status: false, data: err.message });
  }
};
