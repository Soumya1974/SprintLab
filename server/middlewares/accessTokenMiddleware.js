import jwt from "jsonwebtoken";

export const handleAccessToken = (req, res, next) => {

    const authHeaders = req.headers.authorization;

    if (!authHeaders) return res.status(401).json({
        message: "Access denied"
    })

    const token = authHeaders.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

        if (err) return res.status(401).json({
            message: "Access denied"
        })

        req.user = decoded;
        next();
    })
}