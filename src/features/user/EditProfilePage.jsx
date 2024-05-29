import { MdAccountCircle } from "react-icons/md";
import Header from "../../components/Header"
import useAuthData from "../../hooks/useAuthData"
import { useChangePasswordMutation, useGetUserByUsernameQuery, useUpdateUserMutation } from "./usersApiSlice";
import { useEffect, useRef, useState } from "react";
import LoadingSreen from "../../screens/LoadingScreen";
import { useNavigate } from "react-router-dom";
import Main from "../../components/Main";

const EditProfilePage = () => {
  const { username } = useAuthData();
  const { data: user, isLoading: isLoadingUser } = useGetUserByUsernameQuery(username)
  const [newName, setNewName] = useState(user?.name);
  const [currentPassword, setCurrentPassword] = useState('');
  const [file, setFile] = useState('');
  const [url, setUrl] = useState(`https://res.cloudinary.com/dofd4iarg/image/upload/v1690608655/${user?.profilePic}.png`);
  const [newPassword, setNewPassword] = useState('');
  const profilePicRef = useRef(null);
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [changePassword, { isLoading: isChangingPassword, isError, error }] = useChangePasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('name', newName);
    formData.append('profilePic', file);
    try {
      await updateUser(formData).unwrap();
      navigate('/')
    } catch (error) {
      console.log(error);
    }
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      setErrMsg("All fields are required")
      return;
    }
    try {
      await changePassword({ username, c_password: currentPassword, n_password: newPassword })
      navigate('/profile')
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (file) setUrl(URL.createObjectURL(file));
  }, [file])

  return (
    <>
      <Header title={'Edit Profile'} />
      <Main className='gap-2 md:gap-4 p-4'>
        {
          isLoading || isLoadingUser || isChangingPassword ? <LoadingSreen />
            :
            <>
              <section onClick={() => { profilePicRef.current?.click() }} className=" relative">
                <input onChange={(e) => { setFile(e.target.files[0]) }} type="file" accept="image/png, image/jpeg" name="profile" hidden={true} ref={profilePicRef} />
                {
                  user?.profilePic ?
                    <div className='w-28 h-28 rounded-full bg-cover mx-auto' style={{ backgroundImage: `url(${url})` }} ></div>
                    : <MdAccountCircle className='text-slate-300/80 mx-auto text-8xl' />
                }
              </section>

              <p className='text-black/70 dark:text-primary text-sm bg-primary/10 dark:bg-primary/25 w-fit flex items-center gap-1 mx-auto mt-2 px-4 py-2 rounded-full'>
                {'@' + username}
              </p>

              <form className="mx-auto max-w-md py-4 gap-6 space-y-4">
                <label htmlFor="name" className="w-full p-1 space-y-2">
                  <p className="px-2 text-primary">Name</p>
                  <input id="name" className="px-4 py-3 w-full bg-light dark:bg-dark-sec rounded-md" value={newName} onChange={(e) => setNewName(e.target.value)} type="text" placeholder='Name' />
                </label>
                <button onClick={handleSubmit} className="px-4 py-2 w-full rounded-lg bg-primary text-black" >Update Profile</button>
              </form>

              <hr />
              
                <form className="mx-auto max-w-md py-4 gap-6 space-y-4">
                  <p className="text-primary">Change Password</p>
                  <input onChange={(e) => { setCurrentPassword(e.target.value) }} placeholder="Current Password" className="px-4 py-3 w-full block dark:bg-dark-sec bg-light rounded-lg" type="password" name="current_password" id="c_password" value={currentPassword} />
                  <input onChange={(e) => { setNewPassword(e.target.value) }} placeholder="New Password" className="px-4 py-3 w-full block dark:bg-dark-sec rounded-lg bg-light" type="password" name="current_password" id="n_password" value={newPassword} />
                  {
                    isError && <p className="text-red-500" >{error?.data?.message}</p>
                  }
                  <button type="button" onClick={handleChangePassword} className="px-4 py-2 rounded-lg my-2 bg-primary text-black  w-full" >Update Password</button>
                  {errMsg && <p className="text-red-500 self-start text-xs">{'*' + errMsg}</p>}
                </form>
            </>
        }
      </Main>
    </>
  )
}
export default EditProfilePage