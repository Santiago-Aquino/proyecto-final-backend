import express from 'express';

import productsRouter from './products.router.js';
import cartsRouter from './carts.router.js';
import viewRouter from './view.router.js';
import sessionsRouter from './sessions.router.js';
import usersRouter from './users.router.js';
import mockingRouter from './mocking.router.js';
import loggerRouter from './logger.router.js';

export const Router = express.Router()
.use('/api/products', productsRouter)
.use('/api/carts', cartsRouter)
.use('/', viewRouter)
.use('/api/sessions', sessionsRouter)
.use('/api/users', usersRouter)
.use('/', mockingRouter)
.use('/', loggerRouter)