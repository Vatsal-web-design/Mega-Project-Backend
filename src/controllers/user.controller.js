import { asynchandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/use.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { Apiresponse } from "../utils/ApiResponse.js";

const registerUser = asynchandler(async (req, res) => {
    // res.status(200).json({
    //     message: "Vatsal"
    // })

    // get user details from frontend
    //validation -not emty
    //check if user already exixts :username,email
    // check for image,check for avatar
    // uplod them to cloudnary ,avtar
    //creat user object - creat entry in db
    //remove password and refresh token field from response
    //check for user create
    //return response

    const { username, email, password, fullName } = req.body
    // console.log("email:", email);
    // if (fullName === "") {
    //     throw new ApiError(400,"fullname is required")
    // }

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "User with email or username is already exists")
    }

    // console.log(req.files)

    const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage
        .length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Somthing went wrong while registring the user")
    }

    return res.status(200).json(
        new Apiresponse(200, createdUser, "User registered successfully")
    )

})

export { registerUser }