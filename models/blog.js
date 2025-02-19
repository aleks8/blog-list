const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: String,
  url: {
    type: String,
    required: true
  },
  likes: Number,
  user: {    
    type: mongoose.Schema.Types.ObjectId,    
    ref: 'User'  
  }
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      //console.log('returnedObject', returnedObject)
      if(returnedObject._id) {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
      }
      if(returnedObject.__v) {
        delete returnedObject.__v
      }
    }
  })

  module.exports = mongoose.model('Blog', blogSchema)
