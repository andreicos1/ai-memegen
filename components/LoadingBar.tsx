function LoadingBar() {
  return (
    <div id="loading-animation" className="loading-animation max-w-3xl w-full mt-4 px-6">
      <p className="text-center mb-1">Loading... Waiting times are usually 10-15s</p>
      <div className="progress">
        <div className="progress-inner progress-inner--active"></div>
      </div>
    </div>
  )
}

export default LoadingBar
