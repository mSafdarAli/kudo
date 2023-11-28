const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.USER_TOKEN_SECRET);

    // Attach the user object to the request
    req.user = decoded.user;

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Unauthorized attempt.' });
  }
};

module.exports = verifyToken;
