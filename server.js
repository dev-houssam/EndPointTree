const EndpointTree = require('./EndpointTree'); // Importer la classe EndpointTree

// Initialiser le module avec les certificats SSL si sécurisé
const endpointTree = new EndpointTree({
    secure: true, // Sécuriser la connexion avec SSL
    sslCertPath: './certs/cert.pem',  // Chemin vers le certificat
    sslKeyPath: './certs/key.pem'     // Chemin vers la clé privée
});

// Ajouter des routes dynamiquement
endpointTree.create('root.configuration.settings.edit', (req, res) => {
    res.send("Modification des paramètres");
});

endpointTree.create('root.configuration.settings.edit.post', (req, res) => {
    console.log(req.body);
    res.send("Création réussie");
});

endpointTree.create('root.configuration.settings.edit.get', (req, res) => {
    res.send("Récupération des données");
});

// Démarrer le serveur
endpointTree.start(3000); // Démarrer le serveur sur le port 3000
