import { BadgeCheck, MessageCircle, Share2 } from 'lucide-react'
import React from 'react'
import moment from 'moment'
import { useState } from 'react'
import { Heart } from 'lucide-react'
import { dummyUserData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'


const PostCard = ({post}) => {
    const postWithHashtags = post.content.replace(/(#\w+)/g,'<span class="text-indigo-600">$1</span>')

    const[likes, setLikes] =useState(post.likes_count)
    const [isLiked, setIsLiked] = useState(post.isLikedByCurrentUser)
    const currentUser =  dummyUserData

    const handleLike = async()=>{
         if (likes.includes(currentUser._id)) {
            setLikes(likes.filter(id => id !== currentUser._id))
        }
        else {
            setLikes([...likes, currentUser._id])
        }
    }

    const navigate = useNavigate()


  return (
    <div className='bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl'>
        {/*user Info*/}
        <div onClick={() => navigate(`/messages/${post.user._id}`)}
            className='inline-flex items-center gap-3 cursor-pointer'>
            <img src={post.user.profile_picture} alt="" className='w-10 h-10 rounded-full shadow'/>
             <div>
                <div className='flex items-center space-x-1'>
                    <span>{post.user.full_name}</span>
                    <BadgeCheck className='w-4 h-4 text-blue-500'/> 
                </div>
                <div className='flex items-center space-x-1'>
                    @{post.user.username}.{moment(post.createdAt).fromNow()}
                </div>
             </div>
        </div>
        {/*content*/}
        {post.content && <div className='text-gray-800 text-sm whitespace-pre-line' dangerouslySetInnerHTML={{__html:postWithHashtags}}/>}

        {/*Images*/}
        <div className='grid grid-cols-2 gap-2'>
            {post.image_urls.map((img,index)=>(
                <img src={img} key={index} className={`w-full h-48 object-cover rounded-lg  ${
                post.image_urls.length === 1 ? 'col-span-2 h-auto' : 'h-48' }`} alt=""/>
            ))}


        </div>
        {/*action*/}
        <div className='flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-300'>
            <div className='flex items-center gap-1'>
                <Heart className={`w-4 h-4 cursor-pointer ${likes.includes(currentUser._id) && 'text-red-500 fill-red-500'}`} onClick={handleLike}/>
                <span>{likes.length}</span>
            </div>
            <div className='flex items-center gap-1'>
                <MessageCircle/>
                <span>
                    {12}
                </span>
            </div>
            <div className='flex items-center gap-1'>
                <Share2 className="w-4 h-4"/>
                <span>{7}</span>
            </div>
        </div>
    </div>
  )
}

export default PostCard
