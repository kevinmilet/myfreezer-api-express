const logger = require('../config/logger');
class MainError extends Error {
	constructor(errorMessage, errorType = '') {
		super();

		this.name = this.constructor.name;
		this.message = errorMessage;

		switch (this.constructor.name) {
			case 'AuthenticationError':
				if (errorType == 0) {
					this.statusCode = 400;
				} else if (errorType == 1) {
					this.statusCode = 404;
				} else {
					this.statusCode = 401;
				}
				break;
			case 'RequestError':
				this.statusCode = 400;
				break;
			case 'ForbiddenError':
				this.statusCode = 403;
				break;
			case 'UserError':
				if (errorType == 1) {
					this.statusCode = 404;
				} else {
					this.statusCode = 409;
				}
				break;
			case 'FreezerError':
				if (errorType == 0) {
					this.statusCode = 404;
				} else {
					this.statusCode = 409;
				}
				break;
			case 'FreezerTypeError':
				if (errorType == 3) {
					this.statusCode = 404;
				} else {
					this.statusCode = 409;
				}
				break;
			case 'ProductError':
				if (errorType == 2) {
					this.statusCode = 404;
				} else {
					this.statusCode = 409;
				}
				break;
			case 'ProductTypeError':
				if (errorType == 4) {
					this.statusCode = 404;
				} else {
					this.statusCode = 409;
				}
				break;
			default:
				logger.warn('No handler for this error');
		}
	}
}

class AuthenticationError extends MainError {}
class RequestError extends MainError {}
class ForbiddenError extends MainError {}
class UserError extends MainError {}
class FreezerError extends MainError {}
class FreezerTypeError extends MainError {}
class ProductError extends MainError {}
class ProductTypeError extends MainError {}

module.exports = {
	MainError,
	AuthenticationError,
	RequestError,
	ForbiddenError,
	UserError,
	FreezerError,
	FreezerTypeError,
	ProductError,
	ProductTypeError,
};
