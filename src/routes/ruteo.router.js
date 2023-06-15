import { Router } from "express";

export default class Routers {
  constructor() {
    this.router = Router();
    this.init();
  }

  getRouter() {
    return this.router;
  };

  init() { }

  get(path, ...callbacks) {
    this.router.get(path, this.appycallbacks(callbacks));
  };

  appycallbacks(callbacks) {
    return callbacks.map((callback) => async (...params) => {
      try {
        await callback.apply(this, params);
        // params req, res, next()
      }
      catch (err) {
        throw new Error(err);
      }
    })
  };

  generateCustomResponses = (req, res, next) => {
    res.sendSuccess = payload => res.send({ status: 'Success', payload });
    res.sendServerError = error => res.status(500).send({ status: 'Error', error });
    res.sendUserError = error => res.status(400).send({ status: 'Error', error });
    next();
  };

  handlePolices = policies => (req, res, next) => {
    if (policies[0] === 'PUBLIC') return next();
    const authoHeaders = req.headers.autorization;
    if (!authoHeaders) res.status(401).send({ status: 'Error', error: 'No esta autorizado' });
    const token = authoHeaders.split(' ')[1];

    let user = jwt.verify(token, 'coderSecret');

    if (!policies.includes(user.role.toUpperCase ()))
    res.status(403).send({ status: 'Error', error: 'No esta autorizado' });
  }

  get(path, policies, ...callbacks) {
    this.router.get(path, this.handlePolices(policies), this.generateCustomResponses, this.appycallbacks(callbacks));
  };

  post(path, policies, ...callbacks) {
    this.router.post(path, this.handlePolices(policies), this.generateCustomResponses, this.appycallbacks(callbacks));
  };

  put(path, ...callbacks) {
    this.router.put(path, this.generateCustomResponses, this.appycallbacks(callbacks));
  };

  delete(path, ...callbacks) {
    this.router.delete(path, this.generateCustomResponses, this.appycallbacks(callbacks));
  };
}