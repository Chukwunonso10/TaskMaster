const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'full name is required'],
        minlength: [6, 'full name must be atleast 6 characters'],
        maxlength: [50, 'full name cannot exceed 50 characters']
    },
    username: {
        type: String,
        required: [true, 'username is required'],
        unique: true,
        trim: true,
        lowercase: true,
        minlength: [6, 'Username must be at least 6 characters long'],
        maxlength: [20, 'Username cannot exceed 20 characters']
    },

    email:{
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be atleast 6 characters long']
    }
},
{
    timestamps: true
})

// Virtual for confirmPassword
userSchema.virtual('confirmPassword')
  .set(function(value) {
    this._confirmPassword = value;
  })
  .get(function() {
    return this._confirmPassword;
  });

// Pre-save hook to hash password and validate confirmPassword
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    // Validate confirmPassword
    if (this.password !== this._confirmPassword) {
      this.invalidate('confirmPassword', 'Password and Confirm Password must match');
      return next(new Error('Password and Confirm Password must match'));
    }

    // Hash password
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Method to check if password is correct
userSchema.methods.correctPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

//export default mongoose.model('User', userSchema);
const user = mongoose.model('User', userSchema )
module.exports = user

