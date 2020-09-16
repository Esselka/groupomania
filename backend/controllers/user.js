const connection = require('../databaseConnection');
const bcrypt = require('bcrypt');
const fs = require('fs');

// Modification des données d'un utilisateur (email, username, password)
exports.modifyUser = (req, res) => {
    const userID = res.locals.userID;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    // S'il y a une nouvelle image, doit supprimer l'ancienne et mettre à jour l'URI de la nouvelle
    if (req.file) {
        const avatarUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

        let findUserQuery = "SELECT avatar_url FROM users WHERE userID = ?";
        connection.query(findUserQuery, [userID], function(err, result) {
            // Gestion des erreurs
            if (err) return res.status(500).json(err.message);

            const filename = result[0].avatar_url.split("/images/")[1];
            modifyUserQuery = "UPDATE users SET avatar_url = ? WHERE userID = ?";
            if (filename !== "defaultPic.png") {
                // Suppression de l'ancienne image
                fs.unlink(`images/${filename}`, () => {
                    connection.query(modifyUserQuery, [avatarUrl, userID], function(err) {
                        if (err) {
                            return res.status(500).json(err.message);
                        };
                        return res.status(200).json({ message: "User modified !" });
                    });
                })
            } else {
                connection.query(modifyUserQuery, [avatarUrl, userID], function(err) {
                    if (err) {
                        return res.status(500).json(err.message);
                    };
                    return res.status(200).json({ message: "User modified !" });
                });
            }
        });
    } else { // Pour tout autre modification que l'avatar, demande du MDP
        findUserQuery = "SELECT password FROM users WHERE userID = ?";
        connection.query(findUserQuery, [userID], function(err, result) {
            if (err) {
                return res.status(500).json(err.message);
            }
            if (result.length == 0) {
                return res.status(401).json({ error: "User not found !" });
            }

            const newPassword = req.body.new_password;
            const hashedPassword = result[0].password;
            bcrypt.compare(password, hashedPassword)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: "Password incorrect !" });
                    }

                    // Si un nouveau mdp est défini
                    if (newPassword) {
                        bcrypt.hash(newPassword, 10)
                            .then(hash => {
                                changePasswordQuery = "UPDATE users SET email = ?, username = ?, password = ? WHERE userID = ?";
                                queryValues = [email, username, hash, userID];
                                connection.query(changePasswordQuery, queryValues, function(err, result) {
                                    if (err) {
                                        return res.status(500).json(err.message);
                                    }
                                    if (result.affectedRows == 0) {
                                        return res.status(400).json({ message: "Update failed !" });
                                    }
                                    return res.status(200).json({ message: "Update successfull !" });
                                });
                            })
                            .catch(e => res.status(500).json(e));

                        // Si le mdp reste le même
                    } else {
                        modifyUserQuery = "UPDATE users SET email = ?, username = ?, WHERE userID = ?";
                        queryValues = [email, username, userID];
                        connection.query(modifyUserQuery, queryValues, function(err, result) {
                            if (err) {
                                return res.status(500).json(err.message);
                            }
                            if (result.affectedRows == 0) {
                                return res.status(400).json({ message: "Update failed !" });
                            }
                            return res.status(200).json({ message: "Update successfull !" });
                        });
                    }
                })
                .catch(e => res.status(500).json(e));
        });
    }
};