import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import AddBlogForm from './components/AddBlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  //const [showAll, setShowAll] = useState(true)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')   
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  //const [addBlogVisible, setAddBlogVisible] = useState(false)
  const blogFormRef = useRef()
  
  useEffect(() => {    
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')    
    if (loggedUserJSON) {      
      const user = JSON.parse(loggedUserJSON)      
      setUser(user)      
      blogService.setToken(user.token)    
    }  
  }, [])
  
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])
  
  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
  //const addBlog = (event) => {
    //event.preventDefault()
    /*const blogObject = {
      title: newTitle,
      author: newAuthor, 
      url: newUrl
      //important: Math.random() > 0.5,
    }*/
    //console.log('blogObject',blogObject)
    //console.log('newTitle',newTitle)
    //const response = 
    blogService
      .create(blogObject)
        .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
        //setNewBlog('')
      })
    //if (response !== null) {
     
    setSuccessMessage('a new blog '+newTitle.toString()+" by "+newAuthor.toString()+" added")      
      setTimeout(() => {        
        setSuccessMessage(null)      
      }, 5000)
    //console.log('response', response)
    //}
  }
  const handleTitleChange = (event) => {
    //console.log('event.target.title', event.target.title)
    setNewTitle(event.target.value)
    //setNewAuthor(event.target.author)
    //setNewUrl(event.target.url)
    //setNewBlog(event.target.value)
  }

  const handleAuthorChange = (event) => {
    //console.log('event.target.title', event.target.title)
    //setNewTitle(event.target.title)
    setNewAuthor(event.target.value)
    //setNewUrl(event.target.url)
    //setNewBlog(event.target.value)
  }
  const handleUrlChange = (event) => {
    //console.log('event.target.title', event.target.title)
    //setNewTitle(event.target.title)
    //setNewAuthor(event.target.author)
    setNewUrl(event.target.value)
    //setNewBlog(event.target.value)
  }

  const handleLogin = async (event) => {    
    event.preventDefault()    
    console.log('logging in with', username, password)  
    
    try {      
      const user = await loginService.login({        
        username, password,      
      })     
      window.localStorage.setItem(        
        'loggedBlogappUser', JSON.stringify(user)      
      )  
      blogService.setToken(user.token)
      setUser(user)      
      setUsername('')      
      setPassword('')    
    } catch (exception) {      
      setErrorMessage('Wrong credentials')      
      setTimeout(() => {        
        setErrorMessage(null)      
      }, 5000)
  }
} 
  const handleLogout = (event) => {
    window.localStorage.removeItem('loggedBlogappUser')
  }
  
  const addBlogForm = () => {
    
    return (
      <div>
        <Togglable buttonLabel='new blog' ref={blogFormRef}>
          <AddBlogForm
            createBlog={addBlog}
            //addBlog={addBlog}
            newTitle={newTitle}
            handleTitleChange={handleTitleChange}
            newAuthor={newAuthor}
            handleAuthorChange={handleAuthorChange}
            newUrl={newUrl}
            handleUrlChange={handleUrlChange}
          />
          </Togglable>
        </div>
    )
  }
 //
  const loginForm = () => (
    <div>
    <h1>log in to application</h1>
    <Notification type="fail" message={errorMessage} />
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>   
    </div>   
  )
//<form onSubmit={handleLogout}>
//<button type="submit">logout</button></form>
//onChange={handleBlogChange}set={setNewTitle}set={setNewAuthor}set={setNewUrl}
/*const addBlogForm = () => (
  <div>
  <h2>create new</h2>
  <form onSubmit={addBlog}>
    title: <input value={newTitle} onChange={handleTitleChange} /><br></br>
    author: <input value={newAuthor} onChange={handleAuthorChange} /><br></br>
    url: <input value={newUrl} onChange={handleUrlChange} /><br></br>
    <button type="submit">create</button>
  </form>  
  </div>
)*/

  const blogList = () => (
    <div>
      
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} 
        allBlogs={blogs} setAllBlogs={setBlogs}
        setErrorMessage={setErrorMessage}/>
      )}
    </div>
    /*<form onSubmit={addNote}>
      <input
        value={newNote}
        onChange={handleNoteChange}
      />
      <button type="submit">save</button>
    </form>  */
  )
  //{user === null && loginForm()}      
  //{user !== null && noteForm()}
  //
  //<button type="submit">logout</button></p></form>
  //
  //</form>
  return (
    <div>
    
    {user === null ?
      loginForm() : 
      <div>
      <h2>blogs</h2>
      <Notification type="success" message={successMessage} />
      <form onSubmit={handleLogout}>
      <p>{user.name} logged-in <button type="submit">logout</button></p></form>
      {addBlogForm()}
      {blogList()}
      </div>
    }
    
    
    </div>
  )
}

export default App