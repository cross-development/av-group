//Core
const { Router } = require('express');
//Controller
const userController = require('./user.controller');
//Middleware
const middleware = require('../../middleware');

const { getCurrentUser } = userController;
const { validateToken } = middleware;

const userRouter = Router();

// @ GET /api/users/current
userRouter.get('/current', validateToken, getCurrentUser);

module.exports = userRouter;
