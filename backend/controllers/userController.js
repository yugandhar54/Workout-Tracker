const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const User = require('../models/userModel')

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: '3d' })
}

const signupUser = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Please fill in all the fields' })
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Please provide a valid email' })
  }

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(400).json({ error: 'Email is already registered' })
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = await User.create({ email, password: hashedPassword })

  const token = createToken(user._id)
  res.status(201).json({ email: user.email, token, _id: user._id })
}

const loginUser = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Please fill in all the fields' })
  }

  const user = await User.findOne({ email })
  if (!user) {
    return res.status(400).json({ error: 'Invalid credentials' })
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    return res.status(400).json({ error: 'Invalid credentials' })
  }

  const token = createToken(user._id)
  res.status(200).json({ email: user.email, token, _id: user._id })
}

module.exports = { signupUser, loginUser }
