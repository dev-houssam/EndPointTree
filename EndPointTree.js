class EndpointNode {
    constructor(name) {
        this.name = name;
        this.methods = {}; // Méthodes HTTP (GET, POST, etc.)
        this.children = []; // Liste des enfants (n-aire)
        this.prev = null; // Liens vers le parent
        this.next = null; // Liens vers le frère suivant
    }
}

class EndpointTree {
    constructor({ secure = false, sslCertPath = '', sslKeyPath = '' }) {
        // Dépendances internes à la classe
        this.express = require('express'); // Importer express à l'intérieur
        this.fs = require('fs');           // Importer fs à l'intérieur
        this.https = require('https');     // Importer https à l'intérieur

        this.root = new EndpointNode('root'); // Le nœud racine
        this.app = this.express(); // Instance de l'application Express
        this.secure = secure; // Option de sécurité (SSL)
        this.sslCertPath = sslCertPath; // Chemin du certificat
        this.sslKeyPath = sslKeyPath; // Chemin de la clé privée
        
        this.app.use(this.express.json()); // Middleware pour parser les JSON dans les requêtes
    }

    // Créer un nœud et l'ajouter dynamiquement à l'arbre
    create(path, handler) {
        const pathParts = path.split('.');
        let currentNode = this.root;

        pathParts.forEach((part, index) => {
            // Chercher si un enfant avec ce nom existe déjà
            let childNode = currentNode.children.find(child => child.name === part);
            
            // Si l'enfant n'existe pas, on le crée
            if (!childNode) {
                childNode = new EndpointNode(part);
                currentNode.children.push(childNode); // Ajout du nouvel enfant
                // Si c'est un nœud avec plusieurs enfants, on les chaînent
                if (currentNode.children.length > 1) {
                    currentNode.children[currentNode.children.length - 2].next = childNode;
                    childNode.prev = currentNode.children[currentNode.children.length - 2];
                }
            }

            currentNode = childNode; // Passer au sous-nœud pour le prochain niveau
        });

        // Enregistrer le handler pour la méthode GET ou POST sur le dernier nœud
        if (!currentNode.methods['post']) {
            currentNode.methods['post'] = handler;
        } else {
            console.error(`La méthode POST existe déjà pour le chemin ${path}`);
        }
    }

    // Appliquer toutes les routes dans l'arbre
    applyRoutes() {
        const methods = ['get', 'post', 'put', 'delete'];

        // Fonction pour lier chaque méthode à la bonne route
        function traverse(node, path = []) {
            methods.forEach(method => {
                if (node.methods[method]) {
                    // Créer une route dans Express
                    this.app[method](path.join('/'), node.methods[method]);
                    console.log(`Route créée : ${method.toUpperCase()} ${path.join('/')}`);
                }
            });

            // Parcours récursif des sous-noeuds (n-aire)
            node.children.forEach(child => {
                traverse.call(this, child, [...path, child.name]);
            });
        }

        // Commencer le parcours des routes
        traverse.call(this, this.root);
    }

    // Méthode pour démarrer le serveur
    start(port = 3000) {
        this.applyRoutes();

        if (this.secure) {
            // Si sécurisé, on utilise https avec les certificats
            if (!this.sslCertPath || !this.sslKeyPath) {
                console.error("Certificat SSL et clé privée requis pour une connexion sécurisée");
                return;
            }

            // Lecture des fichiers de certificat
            const sslOptions = {
                cert: this.fs.readFileSync(this.sslCertPath),
                key: this.fs.readFileSync(this.sslKeyPath),
            };

            this.https.createServer(sslOptions, this.app).listen(port, () => {
                console.log(`Serveur sécurisé démarré sur https://localhost:${port}`);
            });
        } else {
            // Serveur non sécurisé
            this.app.listen(port, () => {
                console.log(`Serveur démarré sur http://localhost:${port}`);
            });
        }
    }
}

module.exports = EndpointTree;
