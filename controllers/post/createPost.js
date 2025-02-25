const { clerkClient } = require('@clerk/express')
const Post = require('../../models/Post')
const User = require('../../models/User')

const createPost = async (req, res) => {
  try {
    const userId = req.userId // Gives the User ID

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No user ID found.',
      })
    }

    // Pass `userId` directly, as Mongoose expects a string or ObjectId, not an object
    const user = await User.findOne({ clerkId: userId })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      })
    }
    console.log(user)

    const { image, caption, filters, tags, location } = req.body

    if (!caption) {
      return res.status(400).json({
        success: false,
        message: 'Caption is required.',
      })
    }

    const newPost = new Post({
      image,
      caption,
      author: user._id,
      filters,
      tags,
      location,
    })

    const savedPost = await newPost.save()
    user.posts.push(newPost._id)
    await user.save()

    res.status(201).json({
      success: true,
      message: 'Post created successfully.',
      data: savedPost,
    })
  } catch (error) {
    console.error('Error in createPost:', error)
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the post.',
      error: error.message,
    })
  }
}

module.exports = createPost
