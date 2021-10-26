To set up and run the codebase, three processes are required:

-   The python server. The code for this server is contained in the
    python-server branch. It consists of only two files, one of which is
    the main script and the other one is a CSV file with the data. To
    run the script, a number of packages is required, but unfortunately,
    there is no package control implemented as of now. That is, the
    packages are to be installed manually though pip3 which usually
    comes with the installation of the python interpreter. The required
    packages are: pandas, numpy, matplotlib, statsmodels, sklearn kit,
    pypfopt. Once all the packages are installed, the script can be run
    with a python3 interpreter. The script works with python 3.7.3 and
    no other versions were tested. Normally, the interpreter can be run
    with "py" or "python3" command, following the name of the file.
    Alternatively, it can be attempted to interpret through an IDE. This
    is the smallest server, which is proxied by the main API server
    written in JavaScript. It implements one route /optimize. This is
    due to the fact that all the optimizing algorithms were implemented
    in python, and while proxying it like this is not the best solution,
    it is only temporary. There's no path detection implemented, that is
    it treats any end point in the same way. The reason for this is
    because it stands behind a proxy that is responsible for this
    functionality, and it has only one method to serve. Although it is
    not recommended to continue expanding on it, and otherwise implement
    a better way to share data between processes, if a need arises, a
    path detection should be added. For that matter, it should be kept
    in mind that the script uses the built-in http server library, which
    is not recommended for production purposes.

-   The API server. The code for this server is contained within the
    node-server branch. This serves the API, which currently contains
    three routes: /login, /register and /optimize. The server uses a
    database to store the data, so it is required to run an instance of
    MySQL. The address, credentials, and the database name for the MySQL
    server can be specified in the config.js file. The table structures
    were exported into tables.sql file. These tables should be imported
    to the MySQL instance before running the server. The process of
    import varies across environments. After the branch is cloned, “npm
    install” command should be used to install the packages. Another
    piece of configuration available in the config is the secret for
    bcrypt hashing. This secret should be a secure string in production
    environment as it affects the hashing of the passwords. To extend
    the code, it is highly encouraged to follow the existing pattern, or
    rewrite current routes using a different one. The routes option in
    the config specifies the names of the routes. When adding a new
    route, first add the name of this route to the array. Then, create
    the corresponding files with the same names inside the routers and
    validators folders. These will be imported automatically. Both files
    should export instances of express router. The validator router
    should act as a middleware, conducting all the validation, typically
    without making any network requests. The router retuned by a file in
    routes should respond to the server keeping a consistent API
    response schema.

-   The front end react development server. This server can be accessed
    in the react branch. Upon cloning, the packages are to be installed
    with “npm install”, after which the server can be run with “npm
    start”. This server was automatically generated by create-react-app
    utility, and this is not very flexible and should not be used for
    production, but works well for development. The purpose of this
    server is to compile the front-end react application and serve it
    separately from the API. The views folder contain bigger react
    components that are to be used by react-router, while the components
    folder contains the smaller ones that are in use by the view
    components.