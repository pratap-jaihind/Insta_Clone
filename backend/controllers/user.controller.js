import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Post } from "../models/post.model.js";
// import cloudinary from "../utils/cloudinary.js";
// import { getDataUri } from "../utils/dataUri.js";
dotenv.config();

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    if (!username || !email || !password) {
      return res
        .status(401)
        .json({ message: "Something is missing", success: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Try Different email Id", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user
    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Save user to database

    res
      .status(201)
      .json({ message: "User registered successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "Email and password are required",
        success: false,
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", success: false });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const populatedPosts = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post.author.equals(user._id)) {
          return post;
        }
        return null;
      })
    );

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      post: populatedPosts,
    };

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome Back ${user.username}`,
        success: true,
        user,
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId);
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (_, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;

    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();

    return res.status(200).json({
      message: "Profile updated.",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );
    if (!suggestedUsers) {
      return res.status(400).json({
        message: "Currently do not have any users",
      });
    }
    return res.status(200).json({
      success: true,
      users: suggestedUsers,
    });
  } catch (error) {
    console.log(error);
  }
};

export const followOrUnfollow = async (req, res) => {
  try {
    const followKrneWala = req.id; // patel
    const jiskoFollowKrunga = req.params.id; // shivani
    if (followKrneWala === jiskoFollowKrunga) {
      return res.status(400).json({
        message: "You cannot follow/unfollow yourself",
        success: false,
      });
    }

    const user = await User.findById(followKrneWala);
    const targetUser = await User.findById(jiskoFollowKrunga);

    if (!user || !targetUser) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }
    // I will check here do I have to follow or unfollow
    const isFollowing = user.following.includes(jiskoFollowKrunga);
    if (isFollowing) {
      // unfollow logic
      await Promise.all([
        User.updateOne(
          { _id: followKrneWala },
          { $pull: { following: jiskoFollowKrunga } }
        ),
        User.updateOne(
          { _id: jiskoFollowKrunga },
          { $pull: { followers: followKrneWala } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: "Unfollowed successfully", success: true });
    } else {
      // follow logic ayega
      await Promise.all([
        User.updateOne(
          { _id: followKrneWala },
          { $push: { following: jiskoFollowKrunga } }
        ),
        User.updateOne(
          { _id: jiskoFollowKrunga },
          { $push: { followers: followKrneWala } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: "followed successfully", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};
