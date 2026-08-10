import { userChangePasswordSchema, userLoginSchema, userSignUpSchema, validateEmailSchema } from "../validators/validateUser.js";

export const handleValidSignUp = (req, res, next) => {

    const result = userSignUpSchema.safeParse(req.body);

    if(!result.success) return res.status(406).json({
        errors: result.error.issues
    })

    req.body = result.data,

    next();
};

export const handleValidLogin = (req, res, next) => {

    const result = userLoginSchema.safeParse(req.body);

    if(!result.success) return res.status(406).json({
        errors: result.error.issues
    })

    req.body = result.data;

    next();
};

export const handleValidPasswordChange = (req, res, next) => {

    const result = userChangePasswordSchema.safeParse(req.body);

    if(!result.success) return res.status(406).json({
        errors: result.error.issues
    })

    req.body = result.data;

    next();
};

export const handleValidEmail = (req, res, next) => {

    const result = validateEmailSchema.safeParse(req.body);

    if(!result.success) return res.status(406).json({
        errors: result.error.issues
    })

    req.body = result.data;

    next();
};