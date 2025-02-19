const Notification = ({ message }) => {
    //{ message }
    if (message === null) {
      return null
    }
    /*if (type === "success" && message !== null) {
        return (
            <div className="success">
            {message}
          </div>
        )
    }*/
    if(message.includes('added')) {
        return (
            <div className="success">
            {message}
        </div>
        )
    }
    return (
      <div className="error">
        {message}
      </div>
    )
  }
  
  export default Notification