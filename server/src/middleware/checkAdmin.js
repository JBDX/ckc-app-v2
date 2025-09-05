const jwt = require('jsonwebtoken');

function checkAdmin(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Accès refusé. Jeton manquant.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded.isAdmin) {
            // --- LIGNE AJOUTÉE ---
            // On attache les informations de l'utilisateur à la requête
            // pour que la route suivante sache qui a fait l'action.
            req.user = decoded; 
            next(); // L'utilisateur est admin, on le laisse passer.
        } else {
            res.status(403).json({ message: 'Accès refusé. Droits administrateur requis.' });
        }
    } catch (err) {
        res.status(403).json({ message: 'Jeton invalide.' });
    }
}

module.exports = checkAdmin;