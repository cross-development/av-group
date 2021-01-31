//Models
const userModel = require('../users/user.model');
//Crypt
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//User authentication
async function singUpUser(req, res, next) {
	try {
		const { username, email, password } = req.body;

		const existedUser = await userModel.findOne({ email });

		if (existedUser) {
			return res.status(409).json({ message: 'Email in use' });
		}

		const passwordHash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND));
		const user = await userModel.create({ username, email, password: passwordHash });

		return res.status(201).json({ username: user.username, email: user.email });
	} catch (error) {
		next(error);
	}
}

async function signInUser(req, res, next) {
	try {
		const { email, password } = req.body;

		const user = await userModel.findOne({ email });

		if (!user) {
			return res.status(401).json({ message: 'Email or password is wrong' });
		}

		const isUserPasswordCorrect = await bcrypt.compare(password, user.password);

		if (!isUserPasswordCorrect) {
			return res.status(401).json({ message: 'Email or password is wrong' });
		}

		const userToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
			expiresIn: process.env.EXPIRES_IN,
		});

		await userModel.findByIdAndUpdate(user._id, { $set: { token: userToken } });

		const response = {
			user: {
				username: user.username,
				email: user.email,
				permission: user.permission,
			},
			token: userToken,
		};

		return res.status(200).json(response);
	} catch (error) {
		next(error);
	}
}

async function signOutUser(req, res, next) {
	try {
		const { userId, token } = req.user;
		const user = await userModel.findById(userId);

		if (!user || user.token !== token) {
			return res.status(401).json({ message: 'Not authorized' });
		}

		await userModel.findByIdAndUpdate(user._id, { $set: { token: '' } });

		return res.status(204).send();
	} catch (error) {
		next(error);
	}
}

module.exports = {
	singUpUser,
	signInUser,
	signOutUser,
};
