const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {

  let token = req.header('x-auth-token');
  

  if (!token && req.header('Authorization')) {
    const authHeader = req.header('Authorization');
    token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
  }


  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

 
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};