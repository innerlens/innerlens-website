import { HTTP_STATUS } from "../utils/httpStatus.js";

export function validateRequestBody(schema) {
	return (req, res, next) => {
		const error = validateSchema(req.body || {}, schema);
		if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json({ error });
		next();
	};
}

export function validateUrlParams(schema) {
	return (req, res, next) => {
		const error = validateSchema(req.params || {}, schema);
		if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json({ error });
		next();
	};
}

export function validateQueryParams(schema) {
	return (req, res, next) => {
		const error = validateSchema(req.query || {}, schema);
		if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json({ error });
		next();
	};
}

function validateSchema(body, schema) {
	const errors = [];

	for (const key in schema) {
		const rule = schema[key];
		const value = body[key];

		if (
			rule.required &&
			(value === undefined || value === null || value === "")
		) {
			errors.push(`${key} is a required field`);
			continue;
		}

		// skip validation if not required
		if (value === undefined || value === null || value === "") {
			continue;
		}

		if (rule.type === "integer") {
			if (!/^\d+$/.test(value))
				errors.push(`${key} field must be of type integer`);
		} else if (rule.type === "date") {
			if (isNaN(new Date(value).getTime()))
				errors.push(`${key} field must be a valid ISO date format`);
		} else {
			if (typeof value !== rule.type)
				errors.push(`${key} field must be of type ${rule.type}`);
		}
	}

	return errors.length > 0 ? errors.join(", ") : null;
}
