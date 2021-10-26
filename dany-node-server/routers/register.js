const express = require('express');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const database = require.main.require('./modules/database');

const router = express.Router();

router.post(
    '/',
    async (
        req,
        res
    ) => {
        const {
            username,
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
                OR
                    username = :username
                ;
            `,
            {
                email,
                username
            }
        );

        if(user?.email === email)
        {
            res.status(400);
            res.json(
                {
                    success: false,
                    error: 'Email is already taken'
                }
            );

            return;
        }

        if(user?.username === username)
        {
            res.status(400);
            res.json(
                {
                    success: false,
                    error: 'Username is already taken'
                }
            );

            return;
        }

        const hashedPassword = bcrypt.hashSync(
            password,
            10
        );

        await database.execute(
            `
                INSERT INTO
                    users
                    (
                        userId,
                        username,
                        email,
                        password,
                        created,
                        updated
                    )
                VALUES
                    (
                        :userId,
                        :username,
                        :email,
                        :password,
                        :created,
                        :updated
                    )
                ;
            `,
            {
                userId: uuid.v4(),
                username,
                email,
                password: hashedPassword,
                created: new Date(),
                updated: new Date()
            }
        );

        res.status(200);
        res.json(
            {
                success: true
            }
        );

        return;
    }
);

module.exports = router;