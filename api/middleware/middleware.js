const Users = require('../users/users-model');

function logger(req, res, next) {
	// console.log(req);
	next();
}

const validateUserId = async (req, res, next) => {
	// DO YOUR MAGIC
	const id = req.params.id;

	try {
		const user = await Users.getById(id);
		if (!user) {
			res.status(404).json({ message: 'User not found' });
		} else {
			req.user = user;
			next();
		}
	} catch (err) {
		res.status(500).json(err.message);
	}
};

function validateUser(req, res, next) {
	// DO YOUR MAGIC
}

function validatePost(req, res, next) {
	// DO YOUR MAGIC
}

// do not forget to expose these functions to other modules
module.exports = { logger, validateUserId, validateUser, validatePost };
