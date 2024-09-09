import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectAllStories, selectAllUsernames } from "./storySlice";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MdAccountCircle, MdClose } from 'react-icons/md';
import { useGetProfilePicQuery } from "../user/usersApiSlice";
import { formatDistanceToNow } from "date-fns";

const StoryPage = () => {
  const { index } = useParams();
  const [userIndex, setUserIndex] = useState(Number(index));
  const [storyIndex, setStoryIndex] = useState(0);
  const stories = useSelector(selectAllStories);
  const users = useSelector(selectAllUsernames);
  const navigate = useNavigate();
  const ref = useRef(null);
  const { data: profilePic } = useGetProfilePicQuery(users[userIndex]);


  // handling left and right clicks
  const handleImgClick = (e) => {
    const center = window.screen.width / 2;
    const x = e?.clientX;
    if (x < center) {
      if (storyIndex > 0) setStoryIndex(i => i - 1);
      else if (users[userIndex - 1]) setUserIndex(i => i - 1);
    }
    else if (storyIndex + 1 < stories[users[userIndex]]?.length) setStoryIndex(i => i + 1);
    else if (users[userIndex + 1]) setUserIndex(i => i + 1);
    else navigate('/');
  }
  useEffect(() => {
    setStoryIndex(0);
  }, [userIndex]);

  // handling swipe
  let x1, x2;
  let userIndexCopy = userIndex;
  const getX1 = (e) => {
    x1 = e.targetTouches[0].clientX;
  }
  const getX2 = (e) => {
    x2 = e.changedTouches[e.changedTouches.length - 1].clientX;
    if (x1 > x2) {
      if (users[userIndexCopy + 1]) {
        userIndexCopy++;
        setUserIndex(i => i + 1);
      } else {
        navigate('/')
      }
    }
    if (x1 < x2 && users[userIndexCopy - 1]) {
      userIndexCopy--;
      setUserIndex(i => i - 1);
    }
  }
  const addSwipeListener = () => {
    window.addEventListener('touchstart', getX1);
    window.addEventListener('touchend', getX2);
  }
  const removeSwipeListener = () => {
    window.removeEventListener('touchstart', getX1);
    window.removeEventListener('touchend', getX2);
  }
  useEffect(() => {
    addSwipeListener();
    localStorage.setItem('seenStoriesUsernames', JSON.stringify([...(JSON.parse(localStorage.getItem('seenStoriesUsernames')) || []), users[userIndex]]));
    return () => {
      removeSwipeListener();
    }
  }, [userIndex]);

  // handling story changes
  useEffect(() => {
    let interval = setInterval(() => {
      if (storyIndex + 1 < stories[users[userIndex]]?.length) setStoryIndex(i => i + 1);
      else if (users[userIndex + 1]) setUserIndex(i => i + 1);
      else navigate('/')
    }, 8000);
    return () => clearInterval(interval)
  })

  return (

    <div className=" whitespace-nowrap absolute top-0 left-0 w-screen">
      <ul className="w-screen overflow-visible" style={{ transform: `translate(-${userIndex * 100}%, 0%)`, transition: 'all 0.3s ease-out' }}>
        {
          users.map((user, index) => (
            <li key={user} ref={ref} className={`h-screen w-screen bg-center md:w-[25vw] z-30 relative left-0 ${storyIndex === 0 ? 'animate-[story_0.3s_linear]' : ''}`} style={{ backgroundImage: `url(https://res.cloudinary.com/dofd4iarg/image/upload/v1690608655/${stories[user][storyIndex]?.media?.public_id}.png)`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }} onClick={handleImgClick}>

              <section className="flex gap-2 bg-dark">
                {
                  stories[user]?.map((_, i) => <div key={i} className="h-1 bg-gray-500 w-full">
                    <div className={`h-full ${storyIndex >= i ? 'bg-primary' : ''} ${storyIndex === i && userIndex === index ? 'storyTimer' : ''}`}></div>
                  </div>
                  )
                }
              </section>

              <section className="px-2 py-1 flex items-center bg-[rgba(0,0,0,0.5)] text-white z-10 gap-2">
                <Link className="flex items-center gap-2" to={`/${user}`}>
                  {
                    profilePic ? <img className='w-16 h-16 rounded-full p-2 bg-white dark:bg-dark-sec' src={`https://res.cloudinary.com/dofd4iarg/image/upload/v1690608655/${profilePic}.png`} alt="" /> : <p><MdAccountCircle className='text-slate-300 text-4xl' /></p>
                  }


                  <div className="flex-col p-1">
                    <p className=" font-normal">{user}</p>
                    <p className="text-xs">{
                      formatDistanceToNow(new Date(stories[user][storyIndex]?.createdAt), { addSuffix: true })
                    }</p>
                  </div>

                </Link>
                <MdClose className="ml-auto mr-2 cursor-pointer" size={25} onClick={() => { navigate('/') }} />
              </section>

            </li>
          ))
        }
      </ul>
    </div>
  )
}
export default StoryPage