import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  dateOfBirth: Date;
  profilePicture: string;
  biography: string;
  location?: string;
  followers: IUser["_id"][];
  following: IUser["_id"][];
  authentication: {
    password: string;
    salt: string;
  };
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date },
  profilePicture: { type: String },
  biography: { type: String },
  location: { type: String },
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
  },
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;

export const getUsers = () => User.find();

export const getUserById = (id: string) => User.findById(id);

export const getUserByEmail = (email: string) => User.findOne({ email });

export const getUserByPhoneNumber = (phoneNumber: string) =>
  User.findOne({ phoneNumber });

export const getUserByUsername = (username: string) =>
  User.findOne({ username });

export const getUserBySessionToken = (sessionToken: string) =>
  User.findOne({ "authentication.sessionToken": sessionToken });

export const createUser = async (values: Record<string, any>) => {
  const user_1 = await new User(values).save();
  return user_1.toObject();
};

export const updateUserById = async (id: string, values: IUser) => {
  const updatedUser = await User.findByIdAndUpdate({ _id: id }, values, {
    new: true,
  });

  // Check if the user was not found
  if (!updatedUser) {
    throw new Error("User not found");
  }

  // Return the updated user
  return updatedUser;
};

export const deleteUserById = (id: string) => {
  User.findOneAndDelete({ _id: id });
};

/**
 * Get Followers of a User
 * @param userId - The ID of the user whose followers are to be retrieved
 * @returns A promise that resolves to a list of users following the specified user
 */

export const getFollowers = (userId: string) => {
  return User.findById(userId).populate(
    "followers",
    "username fullName profilePicture"
  );
};

/**
 * Get Users Followed by a User
 * @param userId - The ID of the user whose following list is to be retrieved
 * @returns A promise that resolves to a list of users followed by the specified user
 */
export const getFollowing = (userId: string) => {
  return User.findById(userId).populate(
    "following",
    "username fullName profilePicture"
  );
};

export const followUser = async (userId: string, targetUserId: string) => {
  // Preventing a user from following themselves
  if (userId === targetUserId) {
    throw new Error("Users cannot follow themselves.");
  }

  // Adding the target user to the current user's following list
  await User.findByIdAndUpdate(
    userId,
    { $addToSet: { following: targetUserId } },
    { new: true }
  );

  // Adding the current user to the target user's followers list
  await User.findByIdAndUpdate(
    targetUserId,
    { $addToSet: { followers: userId } },
    { new: true }
  );
};

export const unfollowUser = async (userId: string, targetUserId: string) => {
  // Preventing a user from unfollowing themselves
  if (userId === targetUserId) {
    throw new Error("Users cannot unfollow themselves.");
  }

  // Removing the target user from the current user's following list
  await User.findByIdAndUpdate(
    userId,
    { $pull: { following: targetUserId } },
    { new: true }
  );

  // Removing the current user from the target user's followers list
  await User.findByIdAndUpdate(
    targetUserId,
    { $pull: { followers: userId } },
    { new: true }
  );
};

/**
 * Check if a user is following another user
 * @param userId - The ID of the user
 * @param targetUserId - The ID of the target user
 * @returns A promise that resolves to a boolean indicating whether the user is following the target user
 */
export const isFollowingUser = async (userId: string, targetUserId: string) => {
  // Find the user by their ID
  const user = await User.findById(userId);

  // Check if the user exists
  if (!user) {
    throw new Error("User not found");
  }

  // Return a boolean indicating whether the targetUserId is in the user's following array
  return user.following.includes(targetUserId);
};
