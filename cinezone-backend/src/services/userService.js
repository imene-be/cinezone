const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

exports.register = async (userData) => {
  const { email, password, firstName, lastName, role } = userData;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('Cet email est déjà utilisé');
  }

  let userRole = 'user'; 

  if (role) {
    const normalizedRole = role.toLowerCase();
    if (normalizedRole === 'admin' || normalizedRole === 'user') {
      userRole = normalizedRole;
    }
  }

  const user = await User.create({
    email,
    password,
    firstName,
    lastName,
    role: userRole
  });

  const token = generateToken(user.id);

  return { user, token };
};


exports.login = async (email, password) => {
  const user = await User.findOne({ where: { email } });

  if (!user || !(await user.comparePassword(password))) {
    throw new Error('Email ou mot de passe incorrect');
  }

  if (!user.isActive) {
    throw new Error('Compte désactivé');
  }

  const token = generateToken(user.id);

  return { user, token };
};

exports.getProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] }
  });

  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }

  return user;
};

exports.updateProfile = async (userId, updateData) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }

  const { firstName, lastName, email } = updateData;

  if (email && email !== user.email) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Cet email est déjà utilisé');
    }
  }

  await user.update({ firstName, lastName, email });

  // Return object shape consistent with other auth endpoints (contains `user`)
  return { user };
};

exports.updatePassword = async (userId, passwordData) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('Utilisateur non trouvé');

  const { currentPassword, newPassword } = passwordData;
  if (!currentPassword || !newPassword) throw new Error('Données manquantes');

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new Error('Mot de passe actuel incorrect');

  if (newPassword.length < 6) throw new Error('Le mot de passe doit contenir au moins 6 caractères');

  user.password = newPassword;
  await user.save();

  return { message: 'Mot de passe mis à jour avec succès' };
};

exports.getAllUsers = async (query = {}) => {
  const { page = 1, limit = 20, search = '' } = query;
  const offset = (page - 1) * limit;

  const where = {};
  if (search) {
    where[Op.or] = [
      { firstName: { [Op.like]: `%${search}%` } },
      { lastName: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } }
    ];
  }

  const { count, rows } = await User.findAndCountAll({
    where,
    attributes: { exclude: ['password'] },
    limit: parseInt(limit),
    offset,
    order: [['createdAt', 'DESC']]
  });

  return {
    users: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(count / limit)
    }
  };
};

exports.deleteUser = async (userId) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }

  await user.destroy();

  return { message: 'Utilisateur supprimé avec succès' };
};
