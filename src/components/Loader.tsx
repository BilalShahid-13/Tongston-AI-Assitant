
export const Loader = () => {
  const width_height = "w-7 h-7";
  return (<div className="flex w-full h-screen justify-center items-center space-x-1">
    <div className={`${width_height} bg-yellow-400 rounded-full animate-bounce`}
      style={{
        animationDelay: "-0.3s"
      }}></div><div className={`${width_height} bg-yellow-500 rounded-full animate-bounce`}
        style={{
          animationDelay: "-0.3s"
        }}></div><div className={`${width_height} bg-yellow-600 rounded-full animate-bounce`}></div></div>
  )
}