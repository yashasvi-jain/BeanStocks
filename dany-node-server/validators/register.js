const express = require('express');
const validator = require('validator');

const router = express.Router();

router.post(
    '/',
    async (
        req,
        res,
        next
    ) => {
        const {
            username,
            email,
            password
        } = req.body;

        const errors = [];

        if(
            !username ||
            !email ||
            !password
        )
        {
            res.status(400);
            res.json(
                {
                    success: false,
                    error: 'One or more fields are missing'
                }
            );

            return;
        }

        // Username

        if(
            !validator.isAlphanumeric(username)
        ) errors.push('Username must only contain characters and numbers');

        if(
            !validator.isLength(
                username,
                {
                    min: 5,
                    max: 20
                }
            )
        ) errors.push('Username length must be between 5 and 20 characters long');

        // Email

        if(
            !validator.isEmail(email)
        ) errors.push('Email is not valid');

        // Password

        if(
            !validator.isAlphanumeric(password)
        ) errors.push('Password must only contain characters and numbers');

        if(
            !validator.isLength(
                password,
                {
                    min: 8,
                    max: 30
                }
            )
        ) errors.push('Password length must be between 8 and 30 characters long');

        if(errors.length)
        {
            res.status(400);

            res.json(
                {
                    success: false,
                    error: errors
                }
            );

            return;
        }

        next();
        return;
    }
)

module.exports = router;