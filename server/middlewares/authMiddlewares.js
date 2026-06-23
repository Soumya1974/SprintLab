import { userLoginSchema, userSignUpSchema } from "../validators/validateUser.js";

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