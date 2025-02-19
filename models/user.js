const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {    
    type: String,    
    required: true,    
    unique: true, // this ensures the uniqueness of username  
    length: 3
  },
  name: String,
  /*password: {
    type: String,
    required: true, 
    length: 3
  },*/
  passwordHash: String,
  //this below part wasn't necessary for 4.15
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User