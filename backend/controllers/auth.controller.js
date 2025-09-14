const bcrypt = require("bcrypt");
const authService = require("../services/auth.service");
const User = require("../models/user.model");
const logger = require("../utils/logger");

exports.login = async (req, res) => {
  logger.info(
    `POST /api/auth/login - Attempting login for user: ${req.body.username}`
  );

  try {
    const username = req.body.username;
    const password = req.body.password;

    const result = await User.findOne(
      { username: username },
      { username: 1, password: 1, email: 1, roles: 1 }
    );

    if (!result) {
      logger.warn(`POST /api/auth/login - User not found: ${username}`);
      return res
        .status(400)
        .json({ status: false, data: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, result.password);

    if (result && result.username === username && isMatch) {
      const token = authService.generateAccessToken(result);
      logger.info(`POST /api/auth/login - User logged in: ${username}`);
      res.status(200).json({ status: true, data: token });
    } else {
      logger.warn(
        `POST /api/auth/login - Incorrect password for user: ${username}`
      );
      res.status(400).json({ status: false, data: "Invalid credentials" });
    }
  } catch (err) {
    logger.error(
      `POST /api/auth/login - Error logging in user ${req.body.username}: ${err.message}`
    );
    res.status(500).json({ status: false, data: err });
  }
};

exports.register = async (req, res) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    logger.info(`POST /api/auth/register - Registering user: ${username}`);

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        logger.warn(`POST /api/auth/register - Email already in use: ${email}`);
        return res.status(409).json({
          status: false,
          data: "Email already registered, try another one",
        });
      }
      if (existingUser.username === username) {
        logger.warn(
          `POST /api/auth/register - Username already taken: ${username}`
        );
        return res.status(409).json({
          status: false,
          data: "Username already taken, try another one",
        });
      }
    }
    const SaltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, SaltOrRounds);

    const newUser = new User({
      username: req.body.username,
      password: hashedPassword,
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      address: req.body.address,
      phone: req.body.phone,
    });

    const result = await newUser.save();

    if (!result) {
      logger.warn("POST /api/auth/register - Failed to save user");
      return res
        .status(400)
        .json({ status: false, data: "User registration failed" });
    }

    logger.info(`POST /api/auth/register - User registered: ${username}`);
    res.status(201).json({ status: true, data: result });
  } catch (err) {
    logger.error(`POST /api/auth/register - Error: ${err.message}`);
    res.status(500).json({ status: false, data: err.message });
  }
};
