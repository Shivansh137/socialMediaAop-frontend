const Notification = ({ username, message, time }) => {
  return (
    <li className='px-4 py-4 relative flex items-center justify-between dark:bg-dark-sec mb-1'>
      <p>
        <span className="text-blue-500">{username}</span> {message}
      </p>
      <span className="text-xs text-gray-300 block ml-auto ">{new Date(time)?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
    </li>
  )
}
export default Notification