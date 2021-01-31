//Models
const userModel = require('./user.model');

async function getCurrentUser(req, res, next) {
	try {
		const user = await userModel.findById(req.user.userId);

		if (!user) {
			return res.status(401).json({ message: 'Not authorized' });
		}

		const currentUser = {
			userId: user._id,
			username: user.username,
			email: user.email,
			permission: user.permission,
		};

		return res.status(200).json(currentUser);
	} catch (error) {
		next(error);
	}
}

module.exports = {
	getCurrentUser,
};
