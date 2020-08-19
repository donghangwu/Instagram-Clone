import React,{useState} from 'react'
import gridIcon from '../img/gridIcon.jpg'
import { useEffect } from 'react'
import axios from 'axios'
import {useParams} from 'react-router-dom'
export default function Profile() {
    //user posts
    const [userPosts, setuserPosts] = useState([])
    //user info
    const [userinfo, setuserinfo] = useState('')
    //extract userid from req params
    const {userid}=useParams();
    
    useEffect(() => {
        var ignore=false;
        const cancelTokenGetMyPosts = axios.CancelToken.source();
        const fetchProfile=async()=>
        {
            try {
                
                var result = await axios.get(`./${userid}`,{
                    headers:{
                        "Authorization":'Bearer '+localStorage.getItem('jwt')
                    }
                },{ 
                    cancelToken:cancelTokenGetMyPosts.token
                })
                result=result.data;
                if(!ignore)
                {  
                    setuserinfo(result.userdata)
                    setuserPosts(result.userpost)
                }        
               
        
            } catch (error) {
                console.log(error);
            }
                
        }
        fetchProfile();

        return () => {
            ignore=true;
            cancelTokenGetMyPosts.cancel();
        }
    }, [])//only fetch the data onces

    //follow a user
    const following=async()=>{
        try {
            var result = await axios.put('/follow',{
                followId:userid
            },{
                headers:{
                    'Authorization':localStorage.getItem('jwt')
                }
            })
             result=result.data;
            //update the being followed user's state
             setuserinfo(result.followedResult);
             //update userinfo stored in localstorage 
             localStorage.setItem('userinfo',JSON.stringify(result.followingResult))
        } catch (error) {
            
        }
    }
    //unfollow a user
    const unfollowing=async()=>{
        try {
            var result = await axios.put('/unfollow',{
                followId:userid
            },{
                headers:{
                    'Authorization':localStorage.getItem('jwt')
                }
            })
            result=result.data;
            //update the being unfollowed user's state
            setuserinfo(result.unfollowedResult);
            //update userinfo stored in localstorage !!
            localStorage.setItem('userinfo',JSON.stringify(result.unfollowingResult))
        } catch (error) {
            
        }
    }

    //generate the follow/unfollow button
    const followBtn =()=>{
        try {
                        
            const followings = userinfo.followers;
            var find=false;
    
            followings.forEach(element => {
                if(JSON.stringify(element)===JSON.stringify(JSON.parse(localStorage.getItem('userinfo'))._id))
                {
                    find=true;                   
                }
            });
            if(find)
            {
                return( 
                    <button className="btn waves-effect waves-light red lighten-1 followbtn" 
                 name="action" onClick={unfollowing} >
                    unfollow
                    </button>
                    )
            }
            else
            {
                return (
                    <button className="btn waves-effect waves-light green lighten-1 followbtn" 
                   name="action" onClick={following} >
                      follow
                 </button>
             )
            }
            
        } catch (err) {
            console.log(err)     
        }
    }
    const followNum=(follows)=>{
        if(follows)
        {
            return follows.length
        }
        else
            return 0;
    }
 
    return (

        <div>
            
            <div className="profilecard">
            <div className="card horizontal">
            <div >
                <img className='profileImg' alt='profile img' src={userinfo?userinfo.img:'loading..'}/>
            </div>
            <div className="card-stacked">
                <div className="card-content">
                    <h3>{userinfo.name}
                    {followBtn()}
                    </h3>
                    <h6>{userinfo.email}</h6>
                    <br/>
                    <br/>
                    <div className="profileStats">
                        <h6>{userPosts.length} posts</h6>
                        <h6>{followNum(userinfo.followers)} followers</h6>
                        <h6>{followNum(userinfo.followering)} following</h6>
         
                    </div>
                </div>
                        <br/>
                        <br/>
                
            </div>
            </div>
        </div>
            
            <div className='center postText'>
                <img style={{width:'20px', marginRight:'10px'}} src={gridIcon} alt='grid img'></img>
                 Gallery</div>
            <div className='userPosts'>
                {
                 
                 userPosts.map(post=>{
                       return(
                        <img className='post' src={post.picture} alt='user img' key={post._id}/>
                       )
                   })
                }
            </div>
            
        </div>
     
    )
}
