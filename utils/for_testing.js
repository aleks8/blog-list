const reverse = (string) => {
    return string
      .split('')
      .reverse()
      .join('')
  }
  
const average = (array) => {
  const reducer = (sum, item) => {
    return sum + item
  }
  
  return array.length === 0
    ? 0
    : array.reduce(reducer, 0) / array.length
}
  
const totalLikes = (array) => {
  //maybe add a reducer here? 
  const total = array.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
  )
  console.log('total',total)
  return total
}
  module.exports = {
    reverse,
    average,
    totalLikes,
  }