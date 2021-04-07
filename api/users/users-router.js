const express = require('express');

// You will need `users-model.js` and `posts-model.js` both
const Users = require('./users-model');
const Posts = require('../posts/posts-model');
const {
	validateUserId,
	validateUser,
	validatePost,
} = require('../middleware/middleware');

// The middleware functions also need to be required

const router = express.Router();

router.get('/', (req, res) => {
	// RETURN AN ARRAY WITH ALL THE USERS
	Users.get(req.query)
		.then((users) => {
			res.json(users);
		})
		.catch((err) => {
			res.status(500).json({
				message: 'Error retrieving the users',
			});
		});
});

router.get('/:id', validateUserId, (req, res) => {
	// RETURN THE USER OBJECT
	res.json(req.user);

	// this needs a middleware to verify user id
});

router.post('/', validateUser, (req, res) => {
	// RETURN THE NEWLY CREATED USER OBJECT
	// this needs a middleware to check that the request body is valid
	console.log(req.body);
	Users.insert(req.body)
		.then((user) => {
			res.json(user);
		})
		.catch(() => {
			res.status(500).json({ message: 'Error adding the user' });
		});
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
	// RETURN THE FRESHLY UPDATED USER OBJECT
	// this needs a middleware to verify user id
	// and another middleware to check that the request body is valid
	const changes = req.body;
	Users.update(req.user.id, changes)
		.then(() => {
			return Users.getById(req.user.id);
		})
		.then((user) => {
			if (user) {
				res.json(user);
			}
		})
		.catch(() => {
			res.status(500).json({ message: 'Error updating the user' });
		});
});

router.delete('/:id', validateUserId, (req, res) => {
	// RETURN THE FRESHLY DELETED USER OBJECT
	// this needs a middleware to verify user id
	Users.remove(req.user.id).then(() => {
		res.json(req.user);
	});
});

router.get('/:id/posts', validateUserId, async (req, res) => {
	// RETURN THE ARRAY OF USER POSTS
	// this needs a middleware to verify user id
	try {
		const posts = await Users.getUserPosts(req.user.id);

		if (!posts) {
			res
				.status(404)
				.json({ message: 'The post with the specified ID does not exist' });
		} else {
			res.json(posts);
		}
	} catch (err) {
		res
			.status(500)
			.json({ message: 'The posts information could not be retrieved' });
	}
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
	// RETURN THE NEWLY CREATED USER POST
	// this needs a middleware to verify user id
	// and another middleware to check that the request body is valid
	const newPost = { ...req.body, user_id: req.user.id };

	Posts.insert(newPost)
		.then((post) => {
			res.status(201).json(post);
		})
		.catch(() => {
			res.status(500).json({ message: 'The post could not be submitted' });
		});
});

// do not forget to export the router
module.exports = router;
