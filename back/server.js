// Utilisation du package http de Node

const http = require('http');

// Import du fichier app.js

const app = require('./app');

// Configuration du serveur

// Fonction permettant de renvoyer un port valide sous forme de nombre ou d'une chaîne

const normalizePort = (val) => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

// Le serveur écoute soit la variable définie au préalable, soit le port 3000

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Gestion des erreurs serveur

const errorHandler = (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : +'port ' + port;
    switch (error.code) {
        case 'EACESS':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

// Création du serveur avec Express

const server = http.createServer(app);

// Ecoute l'évènements retournant le port ou le canal du serveur

server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

server.listen(port);