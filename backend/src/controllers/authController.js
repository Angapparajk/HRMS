const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Organisation, User } = require('../models');
const { createLog } = require('../middlewares/logMiddleware');

// Register Organisation
const register = async (req, res) => {
  try {
    const { orgName, adminName, email, password } = req.body;

    // Validation
    if (!orgName || !adminName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create organisation
    const organisation = await Organisation.create({ name: orgName });

    // Create admin user
    const user = await User.create({
      organisationId: organisation.id,
      name: adminName,
      email,
      passwordHash,
      role: 'admin'
    });

    // Create log
    await createLog(organisation.id, user.id, 'organisation_created', {
      organisationName: orgName,
      adminEmail: email
    });

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user.id,
        orgId: organisation.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      message: 'Organisation registered successfully',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          organisationId: organisation.id,
          organisationName: organisation.name
        }
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering organisation',
      error: error.message
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({
      where: { email },
      include: [{ model: Organisation, as: 'organisation' }]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Create log
    await createLog(user.organisationId, user.id, 'login', {
      email: user.email
    });

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user.id,
        orgId: user.organisationId,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          organisationId: user.organisationId,
          organisationName: user.organisation.name
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
};

module.exports = { register, login };
