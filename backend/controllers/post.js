const connection = require('../databaseConnection');
const fs = require('fs');
const slugCreator = require('../helpers/slug_creator');

exports.createPost = (req, res) => {
    const userID = res.locals.userID;
    const title = req.body.title;
    const imageURL = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    const slug = slugCreator.makeSlug();

    let createPostQuery = 'INSERT INTO posts VALUES (NULL, ?, NOW(), ?, ?, ?)';
    let values = [userID, title, imageURL, slug];
    connection.query(createPostQuery, values, function(err) {
        // Gestion des erreurs
        if (err) return res.status(500).json(err.message);

        return res.status(201).json({ message: 'Post created !' });
    });
};

// Récupération d'un post avec toutes les données nécessaires pour le front
exports.getOnePost = (req, res) => {
    const slug = req.params.slug;

    let getOnePostQuery = `SELECT posts.post_id, posts.user_id, DATE_FORMAT(posts.date, 'le %e-%m-%Y à %H:%i') AS dateCreation, title, image_url, slug, firstname, lastname, username, avatar_url,
    (SELECT COUNT(*) FROM votes WHERE votes.post_id=posts.post_id AND type='1' ) AS positiveVotes,
    (SELECT COUNT(*) FROM votes WHERE votes.post_id=posts.post_id AND type='-1' ) AS negativeVotes
    FROM posts
    LEFT JOIN users ON posts.user_id = users.user_id
    WHERE slug = ?`;
    connection.query(getOnePostQuery, [slug], function(err, result) {
        // Gestion des erreurs
        if (err) return res.status(500).json(err.message);
        if (result.length == 0) return res.status(404).json({ message: "This post doesn't exists !" });

        // Récupération des commentaires liés à ce post
        let commentsQuery = 'SELECT * from comments WHERE post_id = ? order by date DESC';
        connection.query(commentsQuery, [result[0].post_id], function(error, commentsResult) {
            if (error) return res.status(500).json(error.message);
            // Retourne un objet contenant les données du post et les commentaires
            return res.status(200).json({
                ...result,
                commentsResult,
            });
        });
    });
};

// Obtention de tous les posts ainsi que des données nécessaires pour le front
// TODO : trouver comment récupérer le total des commentaires car asynchrone
exports.getAllPosts = (req, res) => {
    let getAllPostsQuery = `SELECT posts.post_id, posts.user_id, DATE_FORMAT(posts.date, 'le %e-%m-%Y à %H:%i') AS dateCreation, title, image_url, slug, firstname, lastname, username, avatar_url,
    (SELECT COUNT(*) FROM comments WHERE comments.post_id=posts.post_id) AS commentsNumber,
    (SELECT COUNT(*) FROM votes WHERE votes.post_id=posts.post_id AND type='1' ) AS positiveVotes,
    (SELECT COUNT(*) FROM votes WHERE votes.post_id=posts.post_id AND type='-1' ) AS negativeVotes
    FROM posts
    LEFT JOIN users ON posts.user_id = users.user_id LEFT JOIN votes ON posts.post_id = votes.post_id GROUP BY post_id`;

    connection.query(getAllPostsQuery, function(err, result) {
        // Gestion des erreurs
        if (err) return res.status(500).json(err.message);
        // S'il n'y a aucun post, envoyer un message l'indiquant
        if (result.length == 0) return res.status(400).json({ message: 'There is no post yet !' });

        return res.status(200).json({ result });
    });
};

exports.modifyPost = (req, res) => {
    const userID = res.locals.userID;
    const slug = req.params.slug;
    const title = req.body.title;

    let checkOwnerQuery = 'SELECT user_id FROM posts WHERE slug = ?';
    connection.query(checkOwnerQuery, [slug], function(err, result) {
        // Gestion des erreurs
        if (err) return res.status(500).json(err.message);
        // Vérification du propriétaire du post
        if (result[0].user_id != userID) {
            return res.status(403).json({ error: 'Forbidden : not the owner of the post !' });
        }

        let modifyPostQuery = 'UPDATE posts SET date = NOW(), title = ? WHERE slug = ?';
        let values = [title, slug];
        connection.query(modifyPostQuery, values, function(err, result) {
            // Gestion des erreurs
            if (err) return res.status(500).json(err.message);
            // Si aucune ligne n'a été modifiée, envoyer un message expliquant que la modification a échoué
            if (result.affectedRows == 0) {
                return res.status(400).json({ message: 'Modification failed !' });
            }
            return res.status(200).json({ message: 'Modification successfull !' });
        });
    });
};

exports.deletePost = (req, res) => {
    const slug = req.params.slug;
    const userID = res.locals.userID;

    let checkOwnerQuery = 'SELECT user_id, image_url FROM posts WHERE slug = ?';
    connection.query(checkOwnerQuery, [slug], function(err, result) {
        // Gestion des erreurs
        if (err) return res.status(500).json(err.message);
        // Vérification du propriétaire du post
        if (result[0].user_id != userID) {
            return res.status(403).json({ error: 'Forbidden : not the owner of the post !' });
        }
        // S'il y a une image, suppression de cette image localement
        if (result[0].image_url != 'defaultPic.png') {
            const filename = result[0].image_url.split('/images/')[1];
            // Suppression de l'image
            fs.unlink(`images/${filename}`, () => {
                // Suppression du post une fois l'image locale effacée
                let deletePostQuery = 'DELETE FROM posts WHERE slug = ?';
                connection.query(deletePostQuery, [slug], function(err) {
                    if (err) return res.status(500).json(err.message);
                    return res.status(200).json({ message: 'Post deleted !' });
                });
            });
            // S'il n'y a pas d'image à supprimer localement, suppression du post    
        } else {
            let deletePostQuery = 'DELETE FROM posts WHERE slug = ?';
            mysql.query(deletePostQuery, [slug], function(err) {
                if (err) {
                    return res.status(500).json(err.message);
                }
                return res.status(200).json({ message: 'Post deleted !' });
            });
        }
        if (err) {
            return res.status(500).json(err.message);
        }
    });
};

// Gestion des likes et dislikes d'un utilisateur sur un post
exports.reactToPost = (req, res) => {
    const userID = res.locals.userID;
    const vote = req.body.type;
    const slug = req.params.slug;

    // Si le vote est différent de '1' ou '-1', renvoie une erreur
    if (vote != '1' && vote != '-1') return res.status(403).json({ message: "Forbidden, bad vote value, must be -1 or 1 !" });

    let getPostIDFromSlugQuery = 'SELECT post_id FROM posts WHERE slug = ?';
    connection.query(getPostIDFromSlugQuery, [slug], function(err, result) {
        // Gestion des erreurs
        if (err) return res.status(500).json(err.message);
        if (result.length == 0) return res.status(404).json({ message: 'Bad request, verify slug !' });
        const postID = result[0].post_id;

        let checkIfUserChangeHisVoteQuery = 'SELECT type FROM votes WHERE user_id = ? AND post_id = ?';
        connection.query(checkIfUserChangeHisVoteQuery, [userID, postID], function(err, result) {
            // Gestion des erreurs
            if (err) return res.status(500).json(err.message);

            // Si le résultat de la requête n'est pas NULL, vérifier s'il s'agit d'un changement de vote
            if (result.length > 0) {
                // S'il s'agit d'un changement de vote existant, faire la mise à jour
                if ((result[0].type == '1' && vote == '-1') || result[0].type == '-1' && vote == '1') {
                    let updateVoteQuery = 'UPDATE votes SET type = ? WHERE user_id = ? AND post_id = ?';
                    connection.query(updateVoteQuery, [vote, userID, postID], function(err) {
                        // Gestion des erreurs
                        if (err) return res.status(500).json(err.message);
                        return res.status(200).json({ message: "Vote updated successfully !" });
                    });
                    // S'il s'agit du même vote que précédemment, renvoie une erreur indiquant que le vote a déjà eu lieu
                } else return res.status(403).json({ message: "You already voted !" });
            } else {
                let createReactionQuery = 'INSERT INTO votes VALUES (NULL, ?, ?, ?)';
                let values = [userID, postID, vote];
                connection.query(createReactionQuery, values, function(err) {
                    // Gestion des erreurs
                    if (err) return res.status(500).json(err.message);

                    return res.status(201).json({ message: 'Reaction created !' });
                })
            }
        });
    });
};