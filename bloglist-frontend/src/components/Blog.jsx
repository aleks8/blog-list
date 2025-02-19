import { useState, useEffect } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog , allBlogs, setAllBlogs, setErrorMessage}) => {
  const [addBlogVisible, setAddBlogVisible] = useState(false)
  const hideWhenVisible = { display: addBlogVisible ? 'none' : '' }
  const showWhenVisible = { display: addBlogVisible ? '' : 'none' }
  const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
  const loggeduser = JSON.parse(loggedUserJSON)
  //console.log('loggedUserJSON', loggedUserJSON)
  //console.log('loggeduser', loggeduser)
  //console.log('loggeduser.name', loggeduser.name)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  /*useEffect(() => {
      blogService.getAll().then(blogs =>
        setAllBlogs( blogs )
      )
    }, [])*/

  const changeLikes = async (blog) => {
    const newLikes = blog.likes + 1

    const newLikesBlog = allBlogs.find(((blogfromlist) => blogfromlist.title === blog.title))
    const newLikesBlogId = newLikesBlog.id
    const newLikesBlogUserId = newLikesBlog.user.id
    console.log('newLikesBlog', newLikesBlog)
    console.log('newLikesBlogUserId', newLikesBlogUserId)
    //console.log('newLikesBlogId', newLikesBlogId)
    //console.log('newLikes',newLikes)
    const newBlogObject = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: newLikes,
      user: newLikesBlogUserId
    }
    /* await api
    .put('/api/blogs/{')
    .send(newBlog)*/
    //need to add pass setBlogs?
    console.log('blog.user.name here', blog.user.name)
    blogService
      .update(newLikesBlogId, newBlogObject)
      .then((returnedBlog) => {
        setAllBlogs(allBlogs.map((blog) => (blog.id !== newLikesBlogId ? blog : returnedBlog)))
      })
      .catch((error) => {
        setErrorMessage(
          `Blog '${blog.title}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setAllBlogs(allBlogs.filter((b) => b.id !== newLikesBlogId))
      })

    //const updateBlogUser = await User.findById(newBlogObject.user)
    /*blogService.getAll().then(blogs =>
          setAllBlogs( blogs ))*/

  }

  const deleteBlog = async (blog) => {
    if (window.confirm('Remove blog '+blog.title+' by '+blog.author+'?')) {
      blogService
        .remove(blog.id)
        .then(remainingBlogs => {
          remainingBlogs = allBlogs.filter((b) => b.id !== blog.id)
          setAllBlogs(remainingBlogs)
        })
    }
  }
  /*
  const deleteUser = (person, props) => () => {
    //console.log('hello', person.id)
    //console.log('hello', props)
    //console.log('remPeople', props.persons.filter((x) => x.id !== person.id))
    if (window.confirm('Delete '+person.name+' ?')) {

          //console.log('id',person.id)
          //console.log('props',person)
          props.personService
              .remove(person.id)
              .then(remPeople => {
                //console.log(notRemovedPeople)
                //console.log('promise fulfilled 1') 
                remPeople = props.people.filter((x) => x.id !== person.id)
                props.setPeople(remPeople)
                  
          
              })
          }
      
  }*/
  /*const hideWhenVisible = { display: addBlogVisible ? 'none' : '' }
    const showWhenVisible = { display: addBlogVisible ? '' : 'none' }*/
    /* <div style={hideWhenVisible}>
          <button onClick={() => setAddBlogVisible(true)}>new blog</button>
        </div>
        <div style={showWhenVisible}>*/
    //<button onClick={() => setAddBlogVisible(false)}>cancel</button>

  //<div style={showWhenVisible}>
  //</div>  
  //between these two can add the new information 
  //{blog.user.name}
  //{blog.title} {blog.author}
  //{blog.user.name}
  return (
  <div style={blogStyle}>
    <div>
    
    <div style={hideWhenVisible}>
    {blog.title} {blog.author} <button onClick={() => setAddBlogVisible(true)}>view</button>
        </div>
    <div style={showWhenVisible}>
    {blog.title} {blog.author} <button onClick={() => setAddBlogVisible(false)}>hide</button>
    <br></br>
    {blog.url} <br></br>
    likes {blog.likes} <button onClick={() => changeLikes(blog)}>like</button><br></br>
    {blog.user === null ? 'undefined' : blog.user.name} <br></br>
    {blog.user.name === loggeduser.name ? <button onClick={() => deleteBlog(blog)}>remove</button> :
        ''}
    </div>  
  </div>
  </div>
)}

export default Blog