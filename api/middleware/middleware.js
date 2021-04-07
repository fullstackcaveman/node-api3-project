const Users = require('../users/users-model');

const logger = (req, res, next) => {
	console.log(req.method, req.url, Date());
	next();
};

const validateUserId = async (req, res, next) => {
	// DO YOUR MAGIC
	const id = req.params.id;

	try {
		const user = await Users.getById(id);
		if (!user) {
			res.status(404).json({ message: 'User not found' });
		} else {
			req.user = user;
			console.log(req.user);
			next();
		}
	} catch (err) {
		res.status(500).json(err.message);
	}
};

const validateUser = (req, res, next) => {
	// DO YOUR MAGIC
	if (!req.body.name) {
		res.status(400).json({ message: 'missing required name field' });
	} else {
		next();
	}
};

const validatePost = (req, res, next) => {
	// DO YOUR MAGIC
	if (!req.body.text) {
		res.status(400).json({ message: 'missing required text field' });
	} else {
		next();
	}
};

// do not forget to expose these functions to other modules
module.exports = { logger, validateUserId, validateUser, validatePost };
