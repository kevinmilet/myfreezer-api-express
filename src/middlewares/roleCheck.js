const roleCheck = (...authRoles) => {
	return (req, res, next) => {
		if (!req?.isAdmin) {
			return res.sendStatus(403);
		}

		const result = req.isAdmin;

		if (!result) {
			return res.sendStatus(403);
		}

		next();
	};
};

module.exports = roleCheck;
