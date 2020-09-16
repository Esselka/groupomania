const connection = require('../databaseConnection');

// Création d'un nouveau commentaire
exports.createComment = (req, res) => {
    const postID = req.params.postId;
    const userID = res.locals.userID;
    const text = req.body.text;

    let createCommentQuery = 'INSERT INTO comments VALUES (NULL, ?, ?, NOW(), ?)';
    let values = [userID, postID, text];
    connection.query(createCommentQuery, values, function(err) {
        if (err) {
            return res.status(500).json(err.message);
        }
        return res.status(201).json({ message: 'Comment created !' });
    });
};

// Modification d'un commentaire si l'on en est propriétaire
exports.modifyComment = (req, res) => {
    const userID = res.locals.userID;
    const text = req.body.text;
    const commentID = req.params.commentId;

    let findCommentQuery = "SELECT text, date, user_id FROM comments WHERE comment_id = ?";
    connection.query(findCommentQuery, [commentID], function(err, result) {
        // Gestion des erreurs
        if (err) return res.status(500).json(err.message);
        // Vérification du propriétaire du commentaire
        if (result[0].user_id != userID) {
            return res.status(403).json({ error: "Forbidden : not the owner of the comment !" });
        }

        let modifyCommentQuery = 'UPDATE comments SET text = ?, date = NOW() WHERE comment_id = ?';
        let values = [text, commentID];
        connection.query(modifyCommentQuery, values, function(err, result) {
            if (err) {
                return res.status(500).json(err.message);
            }
            if (result.affectedRows == 0) {
                return res.status(400).json({ message: "Modification failed !" });
            }
            return res.status(200).json({ message: "Modification successfull !" });
        })
    });
};

// Suppression d'un commentaire si l'on en est propriétaire
exports.deleteComment = (req, res) => {
    const userID = res.locals.userID;
    const commentID = req.params.commentId;

    let verifyCommentOwnerQuery = "SELECT user_id FROM comments WHERE comment_id = ?";
    connection.query(verifyCommentOwnerQuery, [commentID], function(err, result) {
        // Gestion des erreurs
        if (err) return res.status(500).json(err.message);
        // Vérification du propriétaire du commentaire
        if (result[0].user_id != userID) {
            return res.status(403).json({ error: "Forbidden : not the owner of the comment !" });
        }

        let deleteCommentQuery = 'DELETE FROM comments WHERE comment_id = ?';
        connection.query(deleteCommentQuery, [commentID], function(err) {
            if (err) {
                return res.status(500).json(err.message);
            }
            return res.status(200).json({ message: 'Comment deleted !' });
        })
    })
};