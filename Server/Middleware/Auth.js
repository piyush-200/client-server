
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../Model/User");

dotenv.config();


exports.auth = async (req, res, next) => {
	try {


		console.log('Auth middleware headers:', req.headers);
		let token = null;
		if (req.cookies && req.cookies.token) {
			token = req.cookies.token;
			console.log('Token from cookies:', token);
		} else if (req.body && req.body.token) {
			token = req.body.token;
			console.log('Token from body:', token);
		} else if (req.header("Authorization")) {
			token = req.header("Authorization").replace("Bearer ", "");
			console.log('Token from Authorization header:', token);
		}


		if (!token) {
			return res.status(401).json({ success: false, message: `Token Missing` });
		}

		try {

			const decode = await jwt.verify(token, process.env.JWT_SECRET);
			console.log(decode);

			req.user = decode;
		} catch (error) {

			return res
				.status(401)
				.json({ success: false, message: "token is invalid" });
		}


		next();
	} catch (error) {

		return res.status(401).json({
			success: false,
			message: `Something Went Wrong While Validating the Token`,
		});
	}
};
exports.isStudent = async (req, res, next) => {
	try {
		const userDetails = await User.findOne({ email: req.user.email });

		if (userDetails.accountType !== "Student") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Student",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
};
exports.isAdmin = async (req, res, next) => {
	try {
		const userDetails = await User.findOne({ email: req.user.email });

		if (userDetails.accountType !== "Admin") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Admin",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
};
exports.isInstructor = async (req, res, next) => {
	try {
		const userDetails = await User.findOne({ email: req.user.email });
		console.log(userDetails);

		console.log(userDetails.accountType);

		if (userDetails.accountType !== "Instructor") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Instructor",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
};
