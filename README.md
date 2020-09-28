# Groupomania

![image du projet](https://github.com/Esselka/OC/blob/master/divers/groupomania.png)

## Installation

Vous avez besoin de node.js et de npm. Vous devriez probablement l'installer globalement. [Installer Node](https://nodejs.org/)

```sh
git clone https://github.com/Esselka/groupomania.git
```
***Backend:***
```
cd groupomania
cd backend
npm install
npm start
```
API disponible à cette adresse : http://localhost:3000/

***Frontend:***
```
cd groupomania
cd frontend
npm install
npm run serve
```

Site disponible à cette adresse : [http://localhost:8080/](http://localhost:8080/)

***Ne pas oublier d'ajouter le fichier .env (fournit par l'auteur) à la racine du dossier backend***

## Création de la base de donnée

Le fichier ***Groupomania_DB.sql*** situé dans le dossier groupomania sert à créer la base de donnée.
Une fois dans le dossier groupomania tapez la commande suivante :
```
SOURCE Groupomania_DB.sql
```

Ou bien vous pouvez aussi importer le fichier via MySQL workbench

:thumbsup: