import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';

const generateAccessAndRefreshTokens = (user) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, 'Failed to generate tokens');
  }
};

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

  if (!avatarLocalPath || !req.files?.coverImage?.[0]?.path) {
    throw new ApiError(400, 'Avatar and cover image are required');
  }

  const avatarCloudPath = await uploadToCloudinary(avatarLocalPath);
  const coverImageCloudPath = await uploadToCloudinary(req.files?.coverImage?.[0]?.path);

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
  const createdUser = await User.findById(user._id).select(
   '-password -refreshToken'
)
if(!createdUser) {
  throw new ApiError(500, 'Failed to create user');
}
return res.status(201).json(new ApiResponse(201, 'User registered successfully', createdUser));
});
const loginUser = asyncHandler(async (req, res) => {
  // req body -> Data le aao
  // username or email se user find karo
  // find the user in database
  // password match karo
  // access aur refresh token generate karo
  // send krdo cookies me refresh token aur response me access token
  const { email,username, password } = req.body;

  if (!email && !username) {
    throw new ApiError(400, 'Email or username is required');
  }
  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (!user) {
    throw new ApiError(404, 'User not found');  
  }

  const isPasswordMatch = await user.isPasswordMatch(password);
  if (!isPasswordMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user);
  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  const userObject = user.toObject ? user.toObject() : { ...user };
  delete userObject.password;
  delete userObject.refreshToken;

  return res.status(200).json(
    new ApiResponse(200, 'User logged in successfully', {
      user: userObject,
      accessToken,
    })
  );
});

const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.refreshToken = undefined;
  await user.save();

  res.clearCookie('refreshToken');

  return res.status(200).json(new ApiResponse(200, 'User logged out successfully'));
});

export {
  registerUser,
  loginUser,
  logoutUser,
};