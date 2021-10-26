const express = require('express');

const config = require.main.require('./config');

const app = express();

app.use(
    express.json(),
    require.main.require('./middlewares/auth')
);

config.routes.forEach(
    route => {
        app.use(
            `/${route}`,
            require.main.require(`./validators/${route}`),
            require.main.require(`./routers/${route}`)
        );

        return;
    }
);

// Errors

app.use(
    require.main.require('./middlewares/not-found'),
    require.main.require('./middlewares/error')
);

app.listen(8000);