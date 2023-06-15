import { generateProducts } from '../utils.js';
import enumErrors from '../customError/enum.js';
import CustomError from '../customError/customError.js';

const generateProductsFaker = async (req, res, next) => {
  try {
    const products = generateProducts();

    if (products.length === 0) {
      req.logger.error('Fallo al generar los productos');
      CustomError.createError({
        name: 'Error en traer los productos',
        cause: 'No se pudo traer la informacion de la base de datos',
        message: 'Fallo al generar los productos',
        code: enumErrors.DATABASE_ERROR
      });
    };

    res.json({ status: 'Success!', payload: products });
  }
  catch (err) {
    next(err);
  }
};

export default {
  generateProductsFaker
}
