import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import {Apiresponse} from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, fullname, password } = req.body;

  if (!username || !email || !fullname || !password) {
    throw new ApiError(400, 'All fields are required');
  }

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new ApiError(400, 'User already exists with this email or username');
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath || !coverImageLocalPath) {
    throw new ApiError(400, 'Avatar and cover image are required');
  }

  const avatarCloudPath = await uploadToCloudinary(avatarLocalPath);
  const coverImageCloudPath = await uploadToCloudinary(coverImageLocalPath);

  const user = await User.create({
    username,
    email,
    fullname,
    password,
    avatar: avatarCloudPath,
    coverImage: coverImageCloudPath,
  });

  const userObject = user.toObject ? user.toObject() : { ...user };
  delete userObject.password;

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: userObject,
  });
  const createdUser = await user.findById(user._id).select(
   '-password -refreshtoken'
)
if(!createdUser) {
  throw new ApiError(500, 'Failed to create user');
}
return res.status(201).json(new ApiResponse(201, 'User registered successfully', createdUser));
});

export { registerUser };