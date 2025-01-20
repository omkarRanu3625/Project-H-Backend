const { clerkClient } = require('@clerk/clerk-sdk-node')
const jwt = require('jsonwebtoken')

// Create a new user in Clerk and create a session
const createUser = async (req, res) => {
  const { username, email, password, firstName, lastName } = req.body

  try {
    // Create a user in Clerk
    const clerkUser = await clerkClient.users.createUser({
      firstName,
      lastName,
      emailAddress: [email],
      username,
      password,
    })

    // Issue a jwt
    const jwtToken = jwt.sign(
      { userId: clerkUser.id },
      process.env.JWT_SECRET_KEY, // Ensure this is set in your .env file
      {
        expiresIn: '100h',
      },
    )

    // Log the JWT token to ensure it's being issued properly
    console.log('JWT Token:', jwtToken)

    return res.status(200).json({
      status: 'success',
      message: 'Registration successful',
      user: {
        id: clerkUser.id,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        email: clerkUser.emailAddresses,
        username: clerkUser.username,
      },
      token: jwtToken,
    })
  } catch (error) {
    console.error('Error creating user:', error)
    res.status(500).json({
      status: 'error',
      message: 'Error creating user',
      error: error.message,
    })
  }
}

module.exports = { createUser }
