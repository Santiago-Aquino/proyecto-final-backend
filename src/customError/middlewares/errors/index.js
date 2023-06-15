// middleware que va en el app.js
import enumErrors from '../../enum.js';

export default (error, req, res, next) => {

  switch (error.code) {
    case enumErrors.INVALID_TYPES_ERROR:
      res.status(400).json({ status: 'Error', error: error.message });
      break;

    case enumErrors.DATABASE_ERROR:
      res.status(500).json({ status: 'Error', error: error.message });
      break;

    case enumErrors.ROUTING_ERROR:
      res.status(500).json({ status: 'Error', error: error.message });
      break;

    default: res.json({ status: 'Error', error: 'Error desconocido' });
  }
}