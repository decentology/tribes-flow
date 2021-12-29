import '../styles/Tribes.css'

const Loader = ({ loaderMessage }: { loaderMessage: string }) => {
  return (
    <div className="container">
      <div className="loader">
        <div></div>
        <div></div>
        <div></div>
      </div>
      <h4>{loaderMessage}</h4>
    </div>
  )
}

export default Loader