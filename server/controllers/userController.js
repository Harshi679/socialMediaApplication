// controllers/userController.js

import Connection from '../models/Connection.js';
import imagekit from '../configs/imageKit.js';
import User from '../models/User.js';
import fs from 'fs';
import { inngest } from '../inngest/index.js';
// =================== Get User Data ===================
export const getUserData = async (req, res) => {
  try {
    const { userId } = req.auth;
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// =================== Update User Data ===================
export const updateUserData = async (req, res) => {
  try {
    const { userId } = req.auth;
    let { username, bio, location, full_name } = req.body;

    let tempUser = await User.findById(userId);

    if (!username) username = tempUser.username;

    if (tempUser.username !== username) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: userId },
      });
      if (existingUser) {
        username = tempUser.username; // Keep old username if already taken
      }
    }

    const updatedData = { username, bio, location, full_name };

    const profile = req.files?.profile?.[0];
    const cover = req.files?.cover?.[0];

    if (profile) {
      const buffer = fs.readFileSync(profile.path);
      const response = await imagekit.upload({
        file: buffer,
        fileName: profile.originalname,
      });

      const url = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: 'auto' },
          { format: 'webp' },
          { width: '512' },
        ],
      });
      updatedData.profile_picture = url;
    }

    if (cover) {
      const buffer = fs.readFileSync(cover.path);
      const response = await imagekit.upload({
        file: buffer,
        fileName: cover.originalname,
      });

      const url = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: 'auto' },
          { format: 'webp' },
          { width: '1280' },
        ],
      });
      updatedData.cover_photo = url;
    }

    const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });
    res.json({ success: true, user, message: "Profile updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// =================== Discover Users ===================
export const discoverUsers = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { input } = req.body;

    const allUsers = await User.find({
      $or: [
        { username: new RegExp(input, 'i') },
        { email: new RegExp(input, 'i') },
        { full_name: new RegExp(input, 'i') },
        { location: new RegExp(input, 'i') },
      ],
    });

    const filteredUsers = allUsers.filter(user => user._id.toString() !== userId);

    res.json({ success: true, users: filteredUsers });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// =================== Follow User ===================
export const followUser = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.body;

    const user = await User.findById(userId);
    if (user.following.includes(id)) {
      return res.json({ success: false, message: 'You are already following this user' });
    }

    user.following.push(id);
    await user.save();

    const toUser = await User.findById(id);
    toUser.followers.push(userId);
    await toUser.save();

    res.json({ success: true, message: 'You are now following this user' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// =================== Unfollow User ===================
export const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.body;

    const user = await User.findById(userId);
    user.following = user.following.filter(u => u.toString() !== id);
    await user.save();

    const toUser = await User.findById(id);
    toUser.followers = toUser.followers.filter(u => u.toString() !== userId);
    await toUser.save();

    res.json({ success: true, message: 'You unfollowed this user' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// =================== Send Connection Request ===================
/*export const sendConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.body;

    // Check request limit (20 in 24h)
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const connectionRequests = await Connection.find({
      from_user_id: userId,
      created_at: { $gt: last24Hours },
    });

    if (connectionRequests.length >= 20) {
      return res.json({
        success: false,
        message: 'You have sent more than 20 connection requests in the last 24 hours',
      });
    }

    // Check if already connected
    const connection = await Connection.findOne({
      $or: [
        { from_user_id: userId, to_user_id: id },
        { from_user_id: id, to_user_id: userId },
      ],
    });

    if (!connection) {
      await Connection.create({
        from_user_id: userId,
        to_user_id: id,
        status: 'pending',
        created_at: new Date(),
      });
      return res.json({ success: true, message: 'Connection request sent successfully' });
    } else if (connection.status === 'accepted') {
      return res.json({ success: false, message: 'You are already connected with this user' });
    }

    return res.json({ success: false, message: 'Connection request pending' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};*/
// controllers/userController.js
// <--- Import your Inngest client here

// ... (other controller functions)

// =================== Send Connection Request ===================
export const sendConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.body;

    // Check request limit (20 in 24h)
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const connectionRequests = await Connection.find({
      from_user_id: userId,
      created_at: { $gt: last24Hours },
    });

    if (connectionRequests.length >= 20) {
      return res.json({
        success: false,
        message: 'You have sent more than 20 connection requests in the last 24 hours',
      });
    }

    // Check if already connected
    const connection = await Connection.findOne({
      $or: [
        { from_user_id: userId, to_user_id: id },
        { from_user_id: id, to_user_id: userId },
      ],
    });

    if (!connection) {
      const newConnection = await Connection.create({ // Store the created connection
        from_user_id: userId,
        to_user_id: id,
        status: 'pending',
        created_at: new Date(),
      });

      // === NEW: Send Inngest event after creating the connection ===
      await inngest.send({
        name: 'app/connection-request', // This is the event your reminder function listens to
        data: {
          connectionId: newConnection._id.toString(), // Pass the ID of the new connection
          fromUserId: userId,
          toUserId: id,
        },
      });
      // =============================================================

      return res.json({ success: true, message: 'Connection request sent successfully' });
    } else if (connection.status === 'accepted') {
      return res.json({ success: false, message: 'You are already connected with this user' });
    }

    return res.json({ success: false, message: 'Connection request pending' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ... (rest of your controller functions)

// =================== Get User Connections ===================
export const getUserConnections = async (req, res) => {
  try {
    const { userId } = req.auth;
    const user = await User.findById(userId).populate('connections followers following');

    const pendingConnections = (await Connection.find({
      to_user_id: userId,
      status: 'pending',
    }).populate('from_user_id')).map(conn => conn.from_user_id);

    res.json({
      success: true,
      connections: user.connections,
      followers: user.followers,
      following: user.following,
      pendingConnections,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// =================== Accept Connection Request ===================
export const acceptConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.body;

    const connection = await Connection.findOne({
      from_user_id: id,
      to_user_id: userId,
    });

    if (!connection) {
      return res.json({ success: false, message: 'Connection not found' });
    }

    const user = await User.findById(userId);
    user.connections.push(id);
    await user.save();

    const toUser = await User.findById(id);
    toUser.connections.push(userId);
    await toUser.save();

    connection.status = 'accepted';
    await connection.save();

    res.json({ success: true, message: 'Connection accepted successfully' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
