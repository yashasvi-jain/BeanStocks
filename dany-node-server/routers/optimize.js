const express = require('express');
const proxy = require('express-http-proxy');

const router = express.Router();

router.post(
    '/',
    (
        req,
        res,
        next
    ) => {
        if(!req.auth)
        {
            res.status(401);
            res.json(
                {
                    success: false,
                    error: 'Unauthorized'
                }
            );

            return;
        }

        next();
        return;
    },
    proxy('localhost:8001')
);

module.exports = router;