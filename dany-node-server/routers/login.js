const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require.main.require('./config');
const database = require.main.require('./modules/database');

const router = express.Router();

router.post(
    '/',
    async (
        req,
        res
    ) => {
        const {
            email,
            password
        } = req.body;

        if(req.auth)
        {
            res.status(403);
            res.json(
                {
                    success: false,
                    error: 'Already logged in'
                }
            );

            return;
        }

        const [
            [
                user
            ]
        ] = await database.execute(
            `
                SELECT
                    *
                FROM
                    users
                WHERE
                    email = :email
                ;
            `,
            {
                email
            }
        );

        if(!user)
        {
            res.status(400);
            res.json(
                {
                    success: false,
                    error: 'No user found'
                }
            );

            return;
        }

        if(
            !bcrypt.compareSync(
                password,
                user.password
            )
        )
        {
            res.status(400);
            res.json(
                {
                    success: false,
                    error: 'Passwords do not match'
                }
            );

            return;
        }

        const token = jwt.sign(
            {
                userId: user.userId,
                publicId: user.publicId,
                username: user.username
            },
            config.secret
        );

        res.status(200);
        res.json(
            {
                success: true,
                token
            }
        );

        return;
    }
);

module.exports = router;