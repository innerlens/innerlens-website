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

function validateSchema(body, schema) {
    const errors = [];

    for (const key in schema) {
        const rule = schema[key];
        const value = body[key];

        if (rule.required && (value === undefined || value === null || value === '')) {
            errors.push(`${key} is required`);
            continue;
        }

        if (rule.type === "integer") {
            if (!/^\d+$/.test(value)) errors.push(`${key} must be of type integer`);
        } else {
            if (typeof value !== rule.type) errors.push(`${key} must be of type ${rule.type}`);
        }
    }

    return errors.length > 0 ? errors.join(', ') : null;
  }