
// Set up server dependencies and variables
const app_data              = require('./app_data');
const path                  = require("path");
const express               = require('express');
const app                   = express();
const webpack_server_port   = 8008;
const node_server_port      = 8009;
const bodyParser            = require('body-parser');
const mysql                 = require("mysql");
const webpack               = require('webpack');
const merge                 = require('webpack-merge');
const webpackDevMiddleware  = require('webpack-dev-middleware');
const webpackDevServer      = require('webpack-dev-server');
const webpackConfig         = require((process.env.NODE_ENV === 'production') ? './webpack.prod.js' : './webpack.dev.js');

let devServerOptions = {
    contentBase: path.join(__dirname, "dist"),
    port: webpack_server_port,
    publicPath: '/',
    headers: {
        "Access-Control-Allow-Origin": "http://localhost:8008",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        //,"Access-Control-Allow-Credentials": "true"
    },
    host: "0.0.0.0",
    proxy: {
        '/api/*': {
            target: 'http://localhost:8009',
            secure: false//,
            /*changeOrigin: true,
            bypass: function(req, res, proxyOptions) {
            if (req.headers.accept.indexOf('html') !== -1) {
                console.log('Skipping proxy for browser request.');
                return '/index.html';
            }*/
        }
    }
};
if (process.env.NODE_ENV !== 'production') {
    devServerOptions = merge(devServerOptions, {
        hot: false,
        open: true,
        inline: true
    });
    // for (prop in webpackConfig.entry) {
    //     // console.log(prop);
    //     if (Array.isArray(webpackConfig.entry[prop])) {
    //         // console.log("prop is an array");
    //         // console.log(prop);
    //         webpackConfig.entry[prop].unshift("Adding this gay thing here");
    //     }
    // }
}
// console.log(webpackConfig);
// console.log(devServerOptions);


if (process.env.NODE_ENV === 'production'){
    const compiler = webpack(merge(webpackConfig, {
        devServer: devServerOptions
    }));
    compiler.run((err, stats) => {
        if (err) {
            console.error(err.stack || err);
            if (err.details) {
                console.error(err.details);
            }
            return;
        }

        const info = stats.toJson();

        if (stats.hasErrors()) {
            console.error(info.errors);
        }

        if (stats.hasWarnings()) {
            console.warn(info.warnings);
        }
    });
    console.log(`Webpack server listening on port ${webpack_server_port}.`);
} else if (process.env.Node_ENV === 'development' ) {
    const compiler = webpack(webpackConfig);
    // pass devServer options to the webpack server
    webpackDevServer.addDevServerEntrypoints(webpackConfig, devServerOptions);
    const webpackServer = new webpackDevServer(compiler, devServerOptions);
    webpackServer.listen(webpack_server_port, 'localhost', () => {
        console.log(`Webpack server listening on port ${webpack_server_port}.`);
    });
}


// Connect to database
var sqlPool = mysql.createPool(app_data.sqlConfig);

// Do any work here to exit the server gracefully on ctrl+c
var shutDownServer = function () {
    console.log("\nGracefully shutting down from SIGINT (Ctrl+C)");
    if (sqlPool) sqlPool.end();
    process.exit(1);
};
process.on('SIGINT', shutDownServer);

let errorHandling = function (e) {
    console.log("http request error'd out");
    console.log(e);
}

// Create the attending table
var createAttendingTable = `CREATE TABLE IF NOT EXISTS attending
    (gameID BIGINT(20) NOT NULL,
        userID VARCHAR(127) NOT NULL,
        name VARCHAR(127) NOT NULL )`;

// Create the users table
var createUsersTable = 'CREATE TABLE IF NOT EXISTS users ' +
    '(id VARCHAR(256), ' +
    'fullName VARCHAR(256), ' +
    'firstName VARCHAR(256)) ';

// Create the games table
var createGamesTable = `CREATE TABLE IF NOT EXISTS games
    (time VARCHAR(127),
        date VARCHAR(127),
        description TEXT,
        sport VARCHAR(127) NOT NULL,
        latitude VARCHAR(127) NOT NULL,
        longitude VARCHAR(127) NOT NULL,
        creatorID VARCHAR(127) NOT NULL,
        creatorName VARCHAR(127),
        gameID BIGINT NOT NULL AUTO_INCREMENT,
        PRIMARY KEY(gameID) )`;

// Create the messages table
var createMessagesTable = `CREATE TABLE IF NOT EXISTS messages
(gameID BIGINT(20) NOT NULL,
    userID VARCHAR(127) NOT NULL,
    firstName VARCHAR(127) NOT NULL,
    fullName VARCHAR(127) NOT NULL,
    message TEXT NOT NULL,
    date VARCHAR(127) NOT NULL,
    time VARCHAR(127) NOT NULL,
    messageID BIGINT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY(messageID) )`;

var createTables = function (num) {
    var statement, table;
    switch (num) {
        case 1:
            statement = createUsersTable;
            table = "Users";
            break;
        case 2:
            statement = createGamesTable;
            table = "Games";
            break;
        case 3:
            statement = createAttendingTable;
            table = "Attending";
            break;
        case 4:
            statement = createMessagesTable;
            table = "Messages";
            break;
        default:
            return;
    }
    sqlPool.query(statement, function(err, results, fields) {
        if (err) {
            console.log(`Error while making ${table} table.`);
            shutDownServer();
        }
        createTables(num + 1);
        if (num === 4) console.log('All tables have been created.');
    });
};
createTables(1);

// This helps with parsing the data sent from forms
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


/* Function to add a new user to the database */
app.get('/api/addUser', function (req, response) {
    // See if ID is already in database
    var findIdQuery = 'SELECT * FROM `users` WHERE id="'+req.query.id+'"';
    sqlPool.query(findIdQuery, function(err, results, fields) {
    if (!err) {
        if ( results.length == 0 ) {

            // Add new user to the database
            var addUserQuery = 'INSERT INTO `users`(`id`, `fullName`, `firstName`) VALUES ("' + req.query.id + '", "' + req.query.fullName + '", "' + req.query.firstName + '")';
            sqlPool.query(addUserQuery, function(err2, results2, fields2) {
                if (!err2) {
                    console.log('User: ' + req.query.fullName + ' added to Database!');
                } else {
                    console.log('Error adding user!');
                }
            });

        } else {
            console.log("User already in database.");
        }
    } else
        console.log('Error searching database.');
    });

    response.end();
}).on('error', errorHandling);

/* Function to add a new game to the database */
app.post("/api/form", function(req, response) {
    var gameInsertion = `INSERT INTO games (time, date, description, sport, latitude, longitude, creatorID, creatorName) VALUES ('${req.body.time}', '${req.body.date}', '${req.body.description}', '${req.body.sport}', '${req.body.latitude}', '${req.body.longitude}', '${req.body.creatorID}', '${req.body.creatorName}')`;

    // Add the game to the table
    sqlPool.query(gameInsertion, function(err, results, fields) {
        if (!err) {
            console.log("Game successfully added");
            response.send({ redirect: "http://localhost:8008", gameID: results['insertId']});
        } else
            console.log('Error while performing game adding query.');
        }
    );
}).on('error', errorHandling);

/* Function to get a list of all games in the database */
app.get('/api/getGames', function (req, response) {
    // Create the query
    var getGamesQuery = 'SELECT * FROM `games`';

    // Run the query
    sqlPool.query(getGamesQuery, function(err, results, fields) {
        if (!err) {
            response.send( JSON.stringify(results) );
            console.log('Sent list of all games.')
        } else {
            console.log('Error searching database.');
        }
    });
}).on('error', errorHandling);

/* Function to get the details for a specific game */
app.get('/api/getGameDetails', function (req, response) {
    // Create the query
    var getGamesQuery = 'SELECT * FROM `games` WHERE gameID="'+req.query.ID+'"';

    // Run the query
    sqlPool.query(getGamesQuery, function(err, results, fields) {
        if (!err) {
            response.send( JSON.stringify(results) );
            console.log('Sent game details.')
        } else {
            console.log('Error searching database.');
        }
    });
}).on('error', errorHandling);

/* Function to add user to a specific game */
app.post("/api/imin", function(req, response) {
    var insertion = `INSERT INTO attending (gameID, userID, name) VALUES ('${req.body.gameID}', '${req.body.userID}', '${req.body.name}' )`;

    // Add user to the game
    sqlPool.query(insertion, function(err, results, fields) {
        if (!err) {
            console.log('User is attending game.');
        } else {
            console.log('Error while performing user attending game query.');
        }
    });
}).on('error', errorHandling);

/* Function to remove a user from a specific game */
app.post("/api/leaveGame", function(req, response) {
    // Create the query
    var removal = 'DELETE FROM `attending` WHERE gameID="'+req.body.gameID+'" AND userID="'+req.body.userID+'"';
    
    // Run the query
    sqlPool.query(removal, function(err, results, fields) {
        if (!err) {
            console.log("User was successfuly removed from game.");
        } else {
            console.log('Error while removing player from game.');
        }
    });
}).on('error', errorHandling);

/* Function to get all users attending a game */
app.get('/api/getUsersAttending', function (req, response) {
    // Create query
    var getGamesQuery = 'SELECT * FROM `attending` WHERE gameID="'+req.query.ID+'"';
    
    // Run query
    sqlPool.query(getGamesQuery, function(err, results, fields) {
        if (!err) {
            response.send( JSON.stringify(results) );
            console.log('Sent list of users attending game.')
        } else {
            console.log('Error searching database.');
        }
    });
}).on('error', errorHandling);

/* Function to see if a user is attending a specific game */
app.get('/api/getUserInGame', function (req, response) {
    // Create the query
    var getGamesQuery = 'SELECT * FROM `attending` WHERE gameID="'+req.query.gameID+'" AND userID="'+req.query.userID+'"';
    
    // Run the query
    sqlPool.query(getGamesQuery, function(err, results, fields) {
        if (!err) {
            response.send( JSON.stringify(results) );
            console.log("Sent response.")
        } else {
            console.log('Error searching database.');
        }
    });
}).on('error', errorHandling);

/* Function to get all messages for a specific game */
app.get('/api/getGameMessages', function (req, response) {
    // Create query
    var getGamesQuery = 'SELECT * FROM `messages` WHERE gameID="'+req.query.ID+'"';
    
    // Run query
    sqlPool.query(getGamesQuery, function(err, results, fields) {
        if (!err) {
            response.send( JSON.stringify(results) );
            console.log('Sent list of messages for game.')
        } else {
            console.log('Error searching database.');
        }
    });
}).on('error', errorHandling);

/* Function to add message for a specific game */
app.post("/api/addMessage", function(req, response) {
    var insertion = `INSERT INTO messages (gameID, userID, firstName, fullName, message, date, time ) VALUES ('${req.body.gameID}', '${req.body.userID}', '${req.body.firstName}', '${req.body.fullName}', '${req.body.msg}', '${req.body.date}', '${req.body.time}' )`;

    // Add user to the game
    sqlPool.query(insertion, function(err, results, fields) {
        if (!err) {
            console.log('Message added to database');
        } else {
            console.log('Error while performing add message query.');
        }
    });
}).on('error', errorHandling);

var nodeServer = app.listen(node_server_port, function () {
    console.log('Node server is running on ' + node_server_port + ' in ' + process.env.NODE_ENV + ' mode.');

});