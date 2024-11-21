### Documentation du module **EndpointTree**

Le module **EndpointTree** est une solution flexible pour créer, gérer et sécuriser des routes d'API de manière dynamique dans une application Express. En utilisant une structure d'arbre n-aire et une liste chaînée, il permet de gérer les routes d'API de façon modulaire et efficace, sans avoir à manipuler de manière complexe des fichiers de configuration ou de gestion de routes.

### Table des matières

1. [Installation](#installation)
2. [Création d'une instance](#création-dune-instance)
3. [Création d'un endpoint](#création-dun-endpoint)
4. [Sécurisation des routes](#sécurisation-des-routes)
5. [Utilisation avec Express](#utilisation-avec-express)
6. [Structure de l'arbre](#structure-de-larbre)
7. [Gestion des méthodes HTTP](#gestion-des-méthodes-http)
8. [Exemples d'utilisation](#exemples-dutilisation)
9. [Extensions et personnalisations](#extensions-et-personnalisations)
10. [Gestion des erreurs et validations](#gestion-des-erreurs-et-validations)

---

### 1. Installation

Pour installer le module **EndpointTree**, utilisez **npm** ou **yarn** :

```bash
npm install endpointtree
```

ou

```bash
yarn add endpointtree
```

### 2. Création d'une instance

Pour utiliser le module **EndpointTree**, vous devez d'abord créer une instance de l'arbre d'endpoint. Voici comment initialiser l'instance :

```js
const EndpointTree = require('endpointtree');

// Créer une instance d'EndpointTree
const endpointTree = new EndpointTree();
```

### 3. Création d'un endpoint

Une fois l'instance créée, vous pouvez définir des endpoints de manière dynamique à l'aide de la méthode `create()`.

#### Exemple de syntaxe :

```js
// Ajouter un endpoint dynamique
endpointTree.create('root.configuration.settings.edit.post', (req, res) => {
    console.log(req.body);
    res.send("Création réussie");
});
```

Le chemin `'root.configuration.settings.edit.post'` est une représentation de la hiérarchie des endpoints. Chaque partie de ce chemin correspond à un nœud dans l'arbre.

### 4. Sécurisation des routes

Si vous souhaitez sécuriser certaines routes, vous pouvez le faire en définissant un paramètre supplémentaire à `true`. Lorsqu'il est activé, le module vous demandera de fournir des fichiers de certificat SSL pour sécuriser la connexion.

#### Exemple de sécurisation :

```js
const options = {
    secure: true,
    cert: 'chemin/vers/certificat.crt',
    key: 'chemin/vers/clé.key',
    ca: 'chemin/vers/ca.crt'
};

const endpointTreeSecure = new EndpointTree(options);
```

- `secure: true` active la sécurisation SSL.
- `cert`, `key`, et `ca` sont les chemins vers vos certificats SSL et la clé privée.

### 5. Utilisation avec Express

Le module **EndpointTree** est conçu pour être utilisé directement avec Express. Il intègre Express dans la classe et gère les routes via cette instance.

#### Exemple avec Express :

```js
const express = require('express');
const app = express();
const EndpointTree = require('endpointtree');

// Créer une instance d'EndpointTree
const endpointTree = new EndpointTree();

// Ajouter un endpoint
endpointTree.create('root.configuration.settings.edit.post', (req, res) => {
    console.log(req.body);
    res.send("Création réussie");
});

// Lancer l'application Express
endpointTree.listen(3000, () => {
    console.log('Serveur démarré sur le port 3000');
});
```

### 6. Structure de l'arbre

L'**EndpointTree** repose sur une structure d'arbre n-aire. Chaque nœud dans l'arbre représente une partie du chemin de l'endpoint, et chaque nœud peut avoir un ou plusieurs enfants.

Chaque nœud de l'arbre est lié à une méthode HTTP spécifique et contient un **handler** (la fonction qui sera exécutée lorsque la route correspondante est appelée).

La structure des nœuds est implémentée à l'aide d'une **liste chaînée double**. Chaque nœud a des références vers son parent (`prev`) et ses enfants (`next`).

### 7. Gestion des méthodes HTTP

Le module prend en charge les principales méthodes HTTP, telles que `GET`, `POST`, `PUT`, `DELETE`, etc. Vous pouvez définir des handlers pour chaque méthode à l'aide de la syntaxe suivante :

```js
// Ajouter un endpoint pour la méthode GET
endpointTree.create('root.configuration.settings.edit.get', (req, res) => {
    res.send("Récupération des données");
});

// Ajouter un endpoint pour la méthode POST
endpointTree.create('root.configuration.settings.edit.post', (req, res) => {
    res.send("Création réussie");
});
```

Le module gère les méthodes HTTP en associant chaque route à un type de requête spécifique.

### 8. Exemples d'utilisation

Voici quelques exemples pour vous aider à comprendre l'utilisation du module **EndpointTree** :

#### Exemple de création d'endpoint :

```js
// Définir une route GET
endpointTree.create('root.user.profile.get', (req, res) => {
    res.json({ name: "John Doe", age: 30 });
});

// Définir une route POST
endpointTree.create('root.user.profile.post', (req, res) => {
    console.log(req.body);
    res.send("Profil mis à jour");
});
```

#### Exemple de sécurisation :

```js
// Créer un endpoint sécurisé
const secureTree = new EndpointTree({
    secure: true,
    cert: 'chemin/vers/certificat.crt',
    key: 'chemin/vers/clé.key',
    ca: 'chemin/vers/ca.crt'
});

secureTree.create('root.secure.profile.get', (req, res) => {
    res.send("Accès sécurisé");
});
```

### 9. Extensions et personnalisations

Le module **EndpointTree** est conçu pour être extensible. Vous pouvez l'adapter à vos besoins en ajoutant des fonctionnalités supplémentaires ou en modifiant son comportement.

Par exemple, vous pourriez ajouter des **middlewares** ou des fonctionnalités d'authentification pour renforcer la sécurité de certaines routes :

```js
// Ajouter un middleware pour valider les données de la requête
endpointTree.create('root.user.profile.post', (req, res, next) => {
    if (!req.body.name) {
        return res.status(400).send("Le nom est requis");
    }
    next();
}, (req, res) => {
    res.send("Profil mis à jour");
});
```

### 10. Gestion des erreurs et validations

Le module gère les erreurs de manière transparente. Si une route n'est pas trouvée ou si une erreur se produit lors du traitement d'une requête, **EndpointTree** retourne une réponse appropriée avec un code d'état HTTP.

Vous pouvez également ajouter des mécanismes de validation dans chaque endpoint pour garantir que les données envoyées via les requêtes sont correctes.

---

### Conclusion

Le module **EndpointTree** est une solution flexible et puissante pour gérer les routes d'API dans une application Express. Il permet de créer des routes dynamiques avec une structure hiérarchique facile à gérer, tout en offrant la possibilité de sécuriser les connexions via SSL. Grâce à sa structure d'arbre n-aire et à son intégration étroite avec Express, il est idéal pour les applications Node.js modernes nécessitant une gestion souple des routes.
