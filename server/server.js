const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const config = require('./config/config').get(process.env.NODE_ENV);
const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(config.DATABASE);

const { User } = require('./models/user');
const { Book } = require('./models/book');
const { auth } = require('./middleware/auth');

app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static('client/build'));


/**
 * Routes
 */

/* GET Requests */

// Get a single book
// Example: {{url}}/api/getBook?id=5ab32c55d253124975b8d899
app.get('/api/getBook', (req, res) => {
	let id = req.query.id;

	Book.findById(id,(error,doc) => {
		if (error) {
			return res.status(400).send(error);
		} else {
			res.send(doc);
		}
	});
});

// Get many books
// Example: {{url}}/api/books?order=desc&limit=5&skip=1
app.get('/api/books', (req, res) => {

	// ie: /api/books?skip=3&limit=10&order=asc
	let skip = parseInt(req.query.skip);
	let limit = parseInt(req.query.limit);
	let order = req.query.order;

	// ORDER = asc || desc
	Book.find().skip(skip).sort({_id: order}).limit(limit).exec((error,doc) => {
		if (error) {
			return res.status(400).send(error);
		} else {
			res.send(doc);
		}
	});	 
});



/* POST Requests */

// Adds a book
// Data for new book must be included in body as json.
// Example: {{url}}/api/book
app.post('/api/book',(req,res) => {
	const book = new Book(req.body);

	book.save((error, doc) => {
		if ( error ) {
			return res.status(400).send(error);
		} else {
			res.status(200).json({
				post: true,
				bookID: doc._id
			});
		}
	});
});

// Adds a user
// Data for new user must be included in body as json.
// Example: {{url}}/api/register
app.post('/api/register', (req, res) => {
	const user = new User(req.body);

	user.save((error, doc) => {
		if (error) return res.json({success:false});
		res.status(200).json({
			success: true,
			user: doc
		})
	})
})

// Allows a user to login
// Data for new book must be included in body as json.
// Example: {{url}}/api/login
app.post('/api/login',(req,res) => {
	User.findOne({'email':req.body.email},(error,user) => {
		if (!user) {
			return res.json({isAuth:false, message:'Auth failed, email not found.'});
		} else {
			user.comparePassword(req.body.password,(error,isMatch) => {
				if ( ! isMatch ) {
					return res.json({
						isAuth: false,
						message: 'Wrong password.'
					});
				} else {
					user.generateToken((error,user) => {
						if ( error ) {
							return res.status(400).send(error);
						} else {
							res.cookie('auth',user.token).json({
								isAuth: true,
								id: user._id,
								email: user.email
							});
						}
					});
				}
			});
		}
	});
});

// Gets the user's first and last name by ID.
// Example: {{url}}/api/getReviewer?id=5ab41eac79214df608f9080f
app.get('/api/getReviewer',(req,res) => {
	let id = req.query.id;
	User.findById(id,(error,doc) => {
		if ( error ) {
			return res.status(400).send(error);
		} else {
			res.json({
				firstname: doc.firstname,
				lastname: doc.lastname
			});
		}
	});
});

// Gets all the users
// Example: {{url}}/api/users
app.get('/api/users',(req,res) => {
	User.find({},(error,users) => {
		res.status(200).send(users);
	})
});

// Gets all books owned by a specific user
// Example: {{url}}/api/user_posts?user=5ab41eac79214df608f9080f
app.get('/api/user_posts',(req,res) => {
	Book.find({ownerID:req.query.user}).exec((error,docs) => {
		if ( error ) {
			return res.status(400).send(error);
		} else {
			res.send(docs);
		}
	});
});

// Logs user out and delete the token
// Example: {{url}}/api/logout
app.get('/api/logout',auth,(req,res) => {
	req.user.deleteToken(req.token,(error,user) => {
		if (error) {
			return res.status(400).send(error);
		} else {
			res.sendStatus(200);
		}
	});
});

// If the user is logged in, this returns the user info.
// Example: {{url}}/api/auth
app.get('/api/auth', auth, (req,res) => {
	res.json({
		isAuth: true,
		id: req.user._id,
		email: req.user.email,
		firstname: req.user.firstname,
		lastname: req.user.lastname
	})
});



/* DELETE Requests */

// Delete book by id
// example: {{url}}/api/delete_book?id=5ab32c55d253124975b8d899
app.delete('/api/delete_book', (req,res) => {
	let id = req.query.id;
	Book.findByIdAndRemove(id, (error,doc) => {
		if (error) {
			return res.status(400).send(error);
		} else {
			res.json(true);
		}
	});
	
});



/* UPDATE Requests */

// Updates a book
// Data to update must be included in body as json.
// Example: {{url}}/api/book_update
app.post('/api/book_update', (req,res) => {
	Book.findByIdAndUpdate(req.body._id,req.body,{new: true},(error,doc) => {
		if (error) {
			return res.status(400).send(error);
		} else {
			res.status(200).json({
				success: true,
				doc
			});
		}
	});
})

if ('production' === process.env.NODE_ENV) {
	const path = require('path');
	app.get('/*',(req,res) => {
		res.sendfile( path.resolve( __dirname, '../client', 'build', 'index.html' ) )
	})
}

/* Port */

const port = process.env.PORT || 3001;

app.listen(port,() => {
	console.log(`Server running.`)
});