const Category = require('../models/categoryModel');
const { Op } = require('sequelize');

const slugify = (text) => {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

exports.getAllCategories = async () => {
  return await Category.findAll({
    order: [['name', 'ASC']]
  });
};

exports.getCategoryById = async (categoryId) => {
  const category = await Category.findByPk(categoryId);

  if (!category) {
    throw new Error('Catégorie non trouvée');
  }

  return category;
};

exports.createCategory = async (categoryData) => {
  const { name, description } = categoryData;
  const slug = slugify(name);

  const existing = await Category.findOne({ where: { slug } });
  if (existing) {
    throw new Error('Cette catégorie existe déjà');
  }

  return await Category.create({ name, slug, description });
};

exports.updateCategory = async (categoryId, categoryData) => {
  const category = await Category.findByPk(categoryId);

  if (!category) {
    throw new Error('Catégorie non trouvée');
  }

  const { name, description } = categoryData;
  const updateData = { description };

  if (name) {
    const slug = slugify(name);
    const existing = await Category.findOne({ 
      where: { 
        slug,
        id: { [Op.ne]: categoryId }
      }
    });

    if (existing) {
      throw new Error('Cette catégorie existe déjà');
    }

    updateData.name = name;
    updateData.slug = slug;
  }

  await category.update(updateData);

  return category;
};

exports.deleteCategory = async (categoryId) => {
  const category = await Category.findByPk(categoryId);

  if (!category) {
    throw new Error('Catégorie non trouvée');
  }

  await category.destroy();

  return { message: 'Catégorie supprimée avec succès' };
};