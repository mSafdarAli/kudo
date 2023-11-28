const jwt = require('jsonwebtoken');

const verifyAdminToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_TOKEN_SECRET);

    // Attach the user object to the request
    req.admin = decoded.admin;

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Unauthorized attempt.' });
  }
};

module.exports = verifyAdminToken;
