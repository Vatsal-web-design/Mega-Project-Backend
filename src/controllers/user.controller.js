import { asynchandler } from "../utils/asyncHandler.js";

const registerUser = asynchandler(async (req, res) => {
    res.status(200).json({
        message: "Vatsal"
    }

    )
})

export { registerUser }