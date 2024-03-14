import { ApiError } from "../utils/ApiError";
import { asynchandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { User } from "../models/use.model";

export const verifyJwt = asynchandler(async (req,_, next) => {
    try {
        const token = req.cookie?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-passord -freshToken")

        if (!user) {
            //TODO: discuss about frontend
            throw new ApiError(401, "Invalid Access Token")
        }
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})