import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  try {

    const {token} = req.headers
    console.log(token)
    if (!token) {
      return res.json({ success: false, message: "Not Authorized, Login Again" });
    }

    // Verify the token
    const decoded_token = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = decoded_token.id;
    console.log(decoded_token.id)
    next(); // Proceed to next middleware or route handler

  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default authUser;
