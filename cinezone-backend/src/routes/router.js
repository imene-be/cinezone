const routes = require('../config/routes.json');
const upload = require('../middlewares/upload');
const validators = require('../middlewares/validators');

/**
 * Génère un handler de route
 */
const createHandler = (config, services) => async (req, res, next) => {
  try {
    const [serviceName, method] = config.handler.split('.');
    const args = [];

    if (config.useUser) args.push(req.user.id);
    if (config.useParams) config.useParams.forEach(p => args.push(req.params[p]));
    if (config.useBody) {
      if (Array.isArray(config.useBody)) {
        config.useBody.forEach(f => args.push(req.body[f]));
      } else {
        args.push(req.body);
      }
    }
    if (config.useQuery) args.push(req.query);
    // allow passing the parsed uploaded file to service handlers when configured
    if (config.useFile) args.push(req.file);

    const result = await services[serviceName][method](...args);
    res.status(config.statusCode || 200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Récupère les middlewares de validation pour une route
 */
const getValidationMiddlewares = (validationName) => {
  if (!validationName || !validators[validationName]) {
    return [];
  }
  return validators[validationName];
};

// Générer toutes les routes
module.exports = (router, services, middlewares) => {
  const { protect, isAdmin } = middlewares;

  routes.public.forEach(r => {
    const middle = [];
    if (r.useUpload) middle.push(upload.single(r.uploadField || 'file'));
    middle.push(...getValidationMiddlewares(r.validation));
    router[r.method.toLowerCase()](r.path, ...middle, createHandler(r, services));
  });

  routes.protected.forEach(r => {
    const middle = [protect];
    if (r.useUpload) middle.push(upload.single(r.uploadField || 'file'));
    middle.push(...getValidationMiddlewares(r.validation));
    router[r.method.toLowerCase()](r.path, ...middle, createHandler(r, services));
  });

  routes.admin.forEach(r => {
    const middle = [protect, isAdmin];
    if (r.useUpload) middle.push(upload.single(r.uploadField || 'file'));
    middle.push(...getValidationMiddlewares(r.validation));
    router[r.method.toLowerCase()](r.path, ...middle, createHandler(r, services));
  });

  return router;
};
