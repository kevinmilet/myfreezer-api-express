class MainError extends Error {
	constructor(errorMessage) {
		super();

		this.name = this.constructor.name;
		this.message = errorMessage;

		if (this instanceof RequestError) {
			this.statusCode = 400;
			this.type = 'request';
		}

		if (this instanceof ForbiddenError) {
			this.statusCode = 403;
			this.type = 'forbidden';
		}

		if (this instanceof FreezerError) {
			this.statusCode = 404;
			this.type = 'freezer';
		}
	}
}

class RequestError extends MainError {}
class ForbiddenError extends MainError {}
class FreezerError extends MainError {}

module.exports = { MainError, RequestError, ForbiddenError, FreezerError };
