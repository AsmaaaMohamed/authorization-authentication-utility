// validate middleware for zod validation

export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        status: 'fail',
        errors: result.error.issues,
      });
    }

    req.body = result.data;

    next();
  };
};
