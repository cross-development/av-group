//Core
const {
	Types: { ObjectId },
} = require('mongoose');
//Validate
const Joi = require('joi');
//Crypt
const jwt = require('jsonwebtoken');
//Configs
const configs = require('../configs');

//The middleware validate query params (page, limit, query)
function validateQueryParams(req, res, next) {
	const { minPageNumber, minLimitNumber, minQueryLength } = configs.queryParams;

	const createQueryRules = Joi.object({
		page: Joi.number().min(minPageNumber).default(minPageNumber),
		limit: Joi.number().min(minLimitNumber).default(minLimitNumber),
		query: Joi.string().min(minQueryLength),
		category: Joi.string(),
	});

	const validatedQueryParams = createQueryRules.validate(req.query);

	if (validatedQueryParams.error) {
		const message = validatedQueryParams.error.details[0].message;

		return res.status(400).json({ message });
	}

	req.query = validatedQueryParams.value;

	next();
}

//The middleware validate user token
async function validateToken(req, res, next) {
	try {
		const authorizationHeader = req.get('Authorization') || '';
		const token = authorizationHeader.replace('Bearer ', '');

		try {
			const userId = await jwt.verify(token, process.env.JWT_SECRET_KEY).userId;

			req.user = { userId, token };

			next();
		} catch (err) {
			return res.status(401).json({ message: 'Not authorized' });
		}
	} catch (err) {
		next(err);
	}
}

//The middleware validate id
function validateId(req, res, next) {
	const { id } = req.params;

	if (!ObjectId.isValid(id)) {
		return res.status(400).send({ message: 'invalid id' });
	}

	next();
}

module.exports = {
	validateQueryParams,
	validateToken,
	validateId,
};
