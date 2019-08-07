const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//const bodyParser = require('body-parser');

const User = require('../models/user');

router.post('/signup', (req, res, next) => {
	User.find({ username: req.body.username}) //add more checks
	.exec()
	.then( user => {
		if (user.length >= 1) {
			return res.status(409).json({
				message: 'Username Exists'
			});
		} else {
			bcrypt.hash(req.body.password, 10, (err, hash) => {
					if (err) {
						return res.status(500).json({
							error: err
						});
					} else {
						const user = new User({
						_id: new mongoose.Types.ObjectId(),
						username: req.body.username,
						password: hash, 	//add check for confirm pass
						firstname: req.body.firstname,
						lastname: req.body.lastname,
						email: req.body.email,
						phone: req.body.phone,
						address: req.body.address,
						city: req.body.city,
						afm: req.body.afm
						});
						user.save()
						.then(result => {
							console.log(result);
							res.status(201).json({
								message: 'User Created'
							});
							return res.redirect('/pages/thanks_signup.html');
						}).catch(err => {
							console.log(err);
							res.status(500).json({
								error: err
							});
						});
					}
			});
		}
	});
});

router.delete('/:userId', (req, res, next) => {
	User.remove({ _id: req.params.userId})
	.exec()
	.then(result => {
		res.status(200).json({
			message: 'User Deleted'
		})
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
})
module.exports = router;
