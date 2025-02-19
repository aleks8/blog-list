var _ = require('lodash')

/*var result = _.map([1, 2, 3], function(num) {
  return num * 3;
});
console.log('result',result)*/

const dummy = (blogs) => {
    // ...
    return 1
  }

const totalLikes = (array) => {
    //maybe add a reducer here? 
    const total = array.reduce(
      (accumulator, currentValue) => accumulator + currentValue.likes,
      0,
    )
    //console.log('total',total)
    return total
}

const favoriteBlog = (array) => {
  //const mostLikes = 0 
  if (array.length === 0) {
    return {}
  }
  else {
    const favBlogLikes = array.reduce(
      (mostLikes, currentValue) => (currentValue.likes > mostLikes)? 
      currentValue.likes : mostLikes, 
    0)
    //console.log('favBlogLikes',favBlogLikes)
    const favBlogAll = array.find((blog) => blog.likes === favBlogLikes)
    //console.log('favBlogAll',favBlogAll)
    const { title, author, likes } = favBlogAll
    const favBlog = { title, author, likes }
    //console.log('favBlog', favBlog)

    return favBlog
  }
  
  //got the right value now how do I return probably find?
}

const mostBlogs = (array) => {
  if (array.length === 0) {
    return {}
  }
  else {
    const uniqueBlogs = _.uniqBy(array, 'author')
    //const countByAuthor = _.countBy(array,'author')
    
    //console.log('maxBy',_.max(countByAuthor))
    //console.log('countby',_.countBy(array,'author'))
    /*_.forEach(countByAuthor, 
        function(oneBlog) {
          console.log('countoneblog',oneBlog)
        })*/
    let mostNumBlogsFinal = []
    _.forEach(uniqueBlogs, 
        function(oneBlog) {
          //console.log('oneblog',oneBlog)
          const totalLikes = array.filter((blog) => blog.author === oneBlog.author)
          //console.log('totalLikes', totalLikes)
          const numberOfBlogs = _.size(totalLikes)
          //console.log('numberOfBlogs', numberOfBlogs)
          
          const author = oneBlog.author
          const blogs = numberOfBlogs
          const mostNumBlogObject = { author, blogs}
          //console.log('mostNumBlogObject',mostNumBlogObject)
          mostNumBlogsFinal = mostNumBlogsFinal.concat(mostNumBlogObject)
          //console.log('mostNumBlogsFinal',mostNumBlogsFinal)
          
        }
      )
      const mostNumBlogsAnswer = _.maxBy(mostNumBlogsFinal, 'blogs')
      //console.log('mostNumBlogsAnswer', mostNumBlogsAnswer)
      return mostNumBlogsAnswer
  }
}

const mostLikes = (array) => {
  //const blogs = 0
  //const { author } = favBlogAll
  //_.foreach(array)
  if (array.length === 0) {
    return {}
  }
  else {
    const uniqueBlogs = _.uniqBy(array, 'author')
    /*function likesByAuthor(oneBlogHere) {
      const totalLikes = array.find((blog) => blog.author === oneBlogHere.author)
      console.log('totalLikes',totalLikes)
      
    }*/
    /*const likesByAuthor = (oneBlogHere) => {
      const totalLikes = array.find((blog) => blog.author === oneBlogHere.author)
      console.log('totalLikes',totalLikes)
    }*/
    let mostBlogsFinal = []
    _.forEach(uniqueBlogs, 
      function(oneBlog) {
        const totalLikes = array.filter((blog) => blog.author === oneBlog.author)
        //console.log('blog',oneBlog)
        //console.log('totalLikes',totalLikes)
        const totalAdded = totalLikes.reduce(
          (accumulator, currentValue) => accumulator + currentValue.likes,
          0,
        )
        const author = oneBlog.author
        const likes = totalAdded
        const mostBlogObject = { author, likes}
        mostBlogsFinal = mostBlogsFinal.concat(mostBlogObject)
        //const mostBlogsResult = _.concat(mostBlogsFinal, mostBlogObject)
        
        //const mostBlogsResult = _.unionBy(mostBlogsFinal, mostBlogObject, 'author')
        //console.log('total number',likes)
        //console.log('mostBlogObject', mostBlogObject)
        //console.log('mostBlogsResult',mostBlogsFinal)
      }
    )
    const mostLikesAnswer = _.maxBy(mostBlogsFinal, 'likes')
    
    //console.log('mostLikesAnswer', mostLikesAnswer)
    //console.log('countby',_.countBy(array,'author'))
    //console.log('countbylikes',_.countBy(array,'likes'))
    //console.log('uniqby',_.uniqBy(array, 'author'))
    return mostLikesAnswer
    //console.log('unique',_.sortedUniq(array))
    //console.log('uniq',_.uniq(array))
    //console.log('uniqueby',_.sortedUniqBy(array, "author:"))
    //const favBlog = { author, blogs }
  }
}
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
  }