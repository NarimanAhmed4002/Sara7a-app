import { Token } from "../DB/models/token.model.js";
import { User } from "../DB/models/user.model.js";
import { verifyToken } from "../utils/token/index.js";

export const tokenTypes = {
  access: "access",
  refresh: "refresh",
};

export const isAuthenticated = ({ tokenType = tokenTypes.access } = {}) => {
  return async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new Error("Token is required.", { cause: 401 });
    }
    // verify token signature (decoded = payload)
    const decoded = verifyToken({
      token: token,
      signature:
        tokenType === tokenTypes.access
          ? process.env.ACCESS_TOKEN_SIGNATURE
          : process.env.REFRESH_TOKEN_SIGNATURE,
    }); // verify throw error automatically
    if (!decoded?._id) {
      throw new Error("Invalid token.", { cause: 400 });
    }
    if (decoded.jti && ( await Token.findOne({ jti: decoded.jti}) ) ) {
        throw new Error("Token is invalid.", { cause: 401 });
    }
    // check user existence in DB
    const userExist = await User.findById(payload._id);
    if (!userExist) {
      throw new Error("User is not found", { cause: 404 });
    }

    // date take time in milli seconds & iat is in seconds
    if (userExist.credentialsUpdatedAt > new Date(decoded.iat * 1000)) {
      throw new Error("Token is expired, please login again", { cause: 401 });
    }

    req.user = userExist;
    return next();
  };
};
