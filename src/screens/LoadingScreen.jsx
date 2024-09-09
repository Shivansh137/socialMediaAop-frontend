const LoadingSreen = () => {
  return (
    <section className="absolute bottom-0 left-0 w-screen h-screen grid place-content-center bg-white dark:bg-[#000]/50 z-50  ">
      <article className=" px-16 py-8 rounded-md flex flex-col dark:bg-dark items-center gap-4">
        <div className="ring-spin "><div></div><div></div><div></div><div></div></div>
        <p>Connecting...</p>
      </article>
    </section>
  )
}
export default LoadingSreen