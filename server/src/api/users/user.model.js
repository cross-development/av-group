//Core
const { Schema, model } = require('mongoose');

const userSchema = new Schema({
	username: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	permission: { type: String, default: 'user' },
});

module.exports = model('User', userSchema);
