const parse = (data, fields) => {
  const errors = {};
  for (const [field, check] of Object.entries(fields)) {
    const message = check(data[field], data);
    if (message) errors[field] = [message];
  }
  return Object.keys(errors).length
    ? { success: false, error: { flatten: () => ({ fieldErrors: errors }) } }
    : { success: true, data };
};

const required = (message) => (value) =>
  typeof value === "string" && value.trim() ? null : message;

const validEmail = (value) =>
  typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ? null
    : "Please provide a valid email";

export const registerSchema = {
  safeParse: (data = {}) => {
    const normalized = { ...data, email: data.email?.trim().toLowerCase() };
    return parse(normalized, {
      name: required("Name is required"),
      email: validEmail,
      password: (value) =>
        typeof value === "string" && value.length >= 8
          ? null
          : "Password should be at least 8 characters",
      passwordConfirm: (value, values) =>
        !value
          ? "Confirm your password"
          : value === values.password
            ? null
            : "Please enter the same password",
    });
  },
};

export const loginSchema = {
  safeParse: (data = {}) =>
    parse(
      { ...data, email: data.email?.trim().toLowerCase() },
      { email: validEmail, password: required("Password is required") },
    ),
};
