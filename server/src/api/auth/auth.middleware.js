//Validation package
const Joi = require('joi');
//Configs
const configs = require('../../configs');

//The middleware validate to register user
function validateSignUpUser(req, res, next) {
	const { minNameLength, maxNameLength, minPassLength, maxPassLength } = configs.users;

	const createRegisterRules = Joi.object({
		username: Joi.string().min(minNameLength).max(maxNameLength).required(),
		email: Joi.string().email().required(),
		password: Joi.string().min(minPassLength).max(maxPassLength).required(),
	});

	const validatedRegister = createRegisterRules.validate(req.body);

	if (validatedRegister.error) {
		const message = validatedRegister.error.details[0].message;

		return res.status(400).json({ message });
	}

	next();
}

//The middleware validate to login user
function validateSignInUser(req, res, next) {
	const { minPassLength, maxPassLength } = configs.users;

	const createLoginRules = Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().min(minPassLength).max(maxPassLength).required(),
	});

	const validatedLogin = createLoginRules.validate(req.body);

	if (validatedLogin.error) {
		const message = validatedLogin.error.details[0].message;

		return res.status(400).json({ message });
	}

	next();
}

module.exports = {
	validateSignUpUser,
	validateSignInUser,
};
