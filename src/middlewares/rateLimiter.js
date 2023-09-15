const rateLimiter = require('express-rate-limit');

const signupLimiter = rateLimiter({
	max: 3,
	windowsMS: 10 * 60 * 1000,
	message: 'Too many requests',
});

const loginLimiter = rateLimiter({
	max: 5,
	windowsMS: 60 * 1000,
	message: 'Too many requests',
});

const generalLimiter = rateLimiter({
	max: 5,
	windowsMS: 5000,
	message: 'Too many requests',
});

module.exports = { signupLimiter, loginLimiter, generalLimiter };
