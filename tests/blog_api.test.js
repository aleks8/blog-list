//const { test, after } = require('node:test')
const { test, after, beforeEach, describe } = require('node:test')

const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')

const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

const Blog = require('../models/blog')
const { request } = require('node:http')
//const middleware = require('../utils/middleware')
//const jwt = require('jsonwebtoken')


describe.only('checking initial blogs functionality', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
  
    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }
  })
//test.only is an option 
test('blogs are returned as json', async () => {
  console.log('entered test')

  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
  
    assert.strictEqual(response.body.length, 
        helper.initialBlogs.length)
})

test('a specific blog can be viewed', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const blogToView = blogsAtStart[0]
  //console.log('blogToView',blogToView)
  const resultBlog = await api    
    .get(`/api/blogs/${blogToView.id}`)    
    .expect(200)    
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resultBlog.body, blogToView)
})

describe.only('checking adding new blogs functionality', () => {
    let token

    beforeEach(async () => {
        const loginUser = 
      {
        username: '*',
        password: '*'
    }
        await api 
          .post('/api/users')
          .send(loginUser)
          
          const response = await api
          .post('/api/login')
          .send(loginUser)
          .expect(200)
      
        token = response.body.token
        //console.log('response.token',response.body.token)
  })

  test.only('a valid blog can be added ', async () => {
  const newBlog = {
    title: 'async/await simplifies making async calls',
    author: 'Martin Fowler',
    url: 'https://martinfowler.com/', 
    likes: 4, 
    user: '67a969a1a984f0ce0b582e55'
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    //.set('Authorization', token)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  

  const blogsAtEnd = await helper.blogsInDb()  
  assert.strictEqual(blogsAtEnd.length, 
      helper.initialBlogs.length + 1)
    
      //const response = await api.get('/api/blogs')

  //const contents = response.body.map(r => r.content)
  const contents = blogsAtEnd.map(b => b.title)
  //assert.strictEqual(response.body.length, initialBlogs.length + 1)
  //console.log('blogsAtEnd',blogsAtEnd)
  assert(contents.includes('async/await simplifies making async calls'))
})

test.only('a blog without a token cannot be added ', async () => {
  const newBlog = {
    title: 'async/await simplifies making async calls',
    author: 'Martin Fowler',
    url: 'https://martinfowler.com/', 
    likes: 4, 
    user: '67a969a1a984f0ce0b582e55'
  }

  const response = await api
    .post('/api/blogs')
    //.set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)

  

  const blogsAtEnd = await helper.blogsInDb()  
  assert.strictEqual(blogsAtEnd.length, 
      helper.initialBlogs.length)
    
      //const response = await api.get('/api/blogs')

  //const contents = response.body.map(r => r.content)
  const contents = blogsAtEnd.map(b => b.title)
  //assert.strictEqual(response.body.length, initialBlogs.length + 1)
  //console.log('blogsAtEnd',blogsAtEnd)
  assert(!contents.includes('async/await simplifies making async calls'))
})

test('likes will be 0 if add a blog without likes', async () => {
  const newBlog = {
    title: 'async/await simplifies making async calls',
    author: 'Martin Fowler',
    url: 'https://martinfowler.com/', 
    //likes: 4, 
  }
  /*title: String,
  author: String,
  url: String,
  likes: Number*/
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()  
  assert.strictEqual(blogsAtEnd.length, 
      helper.initialBlogs.length + 1)
    
      //const response = await api.get('/api/blogs')

  //const contents = response.body.map(r => r.content)
  const contents = blogsAtEnd.map(b => b.title)
  //assert.strictEqual(response.body.length, initialBlogs.length + 1)
  const newLikesBlog = blogsAtEnd.find(((blog) => blog.title === "async/await simplifies making async calls"))
  const newLikes = newLikesBlog.likes 
  //console.log('blogsAtEnd',blogsAtEnd)
  //console.log('newlikes',newLikes)
  assert.strictEqual(newLikes, 0)
  //assert(contents.includes('async/await simplifies making async calls'))
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'Martin Fowler',
    url: 'https://martinfowler.com/', 
    likes: 4, 
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  //console.log('blogsAtEnd',blogsAtEnd)
  //const response = await api.get('/api/blogs')
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  //assert.strictEqual(response.body.length, initialBlogs.length)
})

test('blog without url is not added', async () => {
  const newBlog = {
    title: 'async/await simplifies making async calls',
    author: 'Martin Fowler',
    likes: 4, 
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  //console.log('blogsAtEnd',blogsAtEnd)
  //const response = await api.get('/api/blogs')
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  //assert.strictEqual(response.body.length, initialBlogs.length)
})
})
describe('checking deleting blogs functionality', () => {
test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api    
    .delete(`/api/blogs/${blogToDelete.id}`)    
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  const contents = blogsAtEnd.map(r => r.id)
  assert(!contents.includes(blogToDelete.id))
  //console.log('contents',contents)
  //console.log('blogsAtEnd',blogsAtEnd)
  //console.log('blogToDelete',blogToDelete)
  //console.log('helper.initialBlogs.length - 1', helper.initialBlogs.length - 1)
  //console.log('blogsAtEnd.length', blogsAtEnd.length)
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
})
})
describe('checking updating blogs functionality', () => {
test('a blog can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  //const blogToUpdate = blogsAtStart.find((blog) => blog.id === '5a422a851b54a676234d17f7')
  const blogToUpdate = {
    id: '5a422a851b54a676234d17f7',
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 17,
  }
  //console.log('blogToUpdate',blogToUpdate)
  await api    
    .put(`/api/blogs/${blogToUpdate.id}`)   
    .send(blogToUpdate) 
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()

  const contents = blogsAtEnd.map(r => r.id)
  //console.log('blogsAtEnd', blogsAtEnd)
  const updatedBlogAtEnd = blogsAtEnd.find(((blog) => blog.title === "React patterns"))
  const updatedBlogNewLikes = updatedBlogAtEnd.likes 
  //console.log('updatedBlogAtEnd',updatedBlogAtEnd)
  //console.log('updatedBlogNewLikes',updatedBlogNewLikes)
  assert.strictEqual(updatedBlogNewLikes, 17)
  //assert(!contents.includes(blogToUpdate.id))
  //console.log('contents',contents)
  //console.log('blogsAtEnd',blogsAtEnd)
  //console.log('blogToDelete',blogToDelete)
  //console.log('helper.initialBlogs.length - 1', helper.initialBlogs.length - 1)
  //console.log('blogsAtEnd.length', blogsAtEnd.length)
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
}) })}) 

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'mluukkai', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: '*',
      name: '*',
      password: '*',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: '*',
      name: '*',
      password: '*',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is forgotten', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: '*',
      name: '*',
      //password: '*',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    //console.log('result.body.error', result.body.error)
    assert(result.body.error.includes('password missing'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test.only('creation fails with proper statuscode and message if password is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: '*',
      name: '*',
      password: 'No',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    //console.log('result.body.error', result.body.error)
    assert(result.body.error.includes('password too short'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})