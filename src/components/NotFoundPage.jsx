import notFoundImg from "../assets/page-not-found.jpg";

const NotFoundPage = () => {
  return (
    <div className="d-flex justify-content-center align-items-center">
      <img src={notFoundImg} className="not-found-img" alt="Page not found" width="800px" height="600px" />
    </div>
  )
}

export default NotFoundPage
