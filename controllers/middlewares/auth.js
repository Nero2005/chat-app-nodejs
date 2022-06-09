import "dotenv/config";
import jwt from "jsonwebtoken";

export const authToken = (req, res, next) => {
  // const token = req.headers.token;
  let authHeader;
  if (req.headers.cookie) {
    for (let ck of req.headers.cookie.split("; ")) {
      if (ck.split("=")[0] === "chatToken") {
        authHeader = ck.split("=")[1];
      }
    }
  }
  // console.log(token);

  if (!authHeader)
    return res.status(401).json({ message: "You are not authenticated!" });

  jwt.verify(authHeader, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ err, message: "Token is not valid!" });
    }
    req.user = user;
    next();
  });
};
