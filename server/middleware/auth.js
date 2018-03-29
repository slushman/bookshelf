const { User } = require('./../models/user');

let auth = (req,res,next) => {
	let token = req.cookies.auth;
	User.findUserByToken(token,(error,user) => {
		if ( error ) throw error;
		if ( ! user ) return res.json({error: true,isAuth:false});
		 
		req.token = token;
		req.user = user;
		next();
	});
}

module.exports = { auth }