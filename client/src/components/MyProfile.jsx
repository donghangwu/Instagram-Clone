import React,{useState} from 'react'
import gridIcon from '../img/gridIcon.jpg'
import { useEffect } from 'react'
import axios from 'axios'
export default function Profile() {
    const [myPosts, setmyPosts] = useState([])
    const [userinfo, setuserinfo] = useState('')
    const [profileImg,setProfileImg] = useState('')
    useEffect(() => {
        var ignore=false;
        const cancelTokenGetMyPosts = axios.CancelToken.source();
        const fetchProfile=async()=>
        {
            try {
                var result = await axios.get('./userpost',{
                    headers:{
                        "Authorization":'Bearer '+localStorage.getItem('jwt')
                    }
                },{ 
                    cancelToken:cancelTokenGetMyPosts.token
                })
                result=result.data;
                //store the user info
                if(!result.picture &&!ignore)
                {
                    setuserinfo(result[0]);

                }   
                if(result[0].picture&&!ignore)
                {
                    setmyPosts(result);
                    setuserinfo(result[0].postBy)
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
    }, [])
    const followNum=(follows)=>{
        if(follows)
        {
            return follows.length
        }
        else
            return 0;
    }
  
    const updateImg=async()=>{
        //FormData for image
        const imgdata = new FormData();
        imgdata.append('file',profileImg);
        imgdata.append('upload_preset','instagram')
        imgdata.append('cloud_name','dwu20')
        var result;
        try {
            //upload pictures to cloudinary to store data
            result= await axios.post('https://api.cloudinary.com/v1_1/dwu20/image/upload',imgdata);            
            //setImageUrl(result.data.secure_url);
        } catch (error) {
            console.log(error);
        }
         try {
            var data= await axios.put('/updateimg',{
                
                img:result.data.secure_url
            },
            {headers:{
                Authorization:'Bearer '+localStorage.getItem('jwt')
            }});

            //updating the page when the profile image changed
            setuserinfo(data.data);
            setProfileImg(result.data.secure_url)
            //window.location.reload();
     
        } catch (error) {
            console.log(error);
        }      
       
       
      
    }

    return (
        <div>
            
            <div className="profilecard">
            <div className="card horizontal">
            <div >
                <img className='profileImg' alt='profile img' src={userinfo?userinfo.img:''}/>
                <div className="file-field input-post-field profileimgBlock">
                            <div className="btn  updateprofilebtn red lighten-1">
                                <span >Update Image</span>
                                <input type="file" 
                                onChange={e=>setProfileImg(e.target.files[0])}/>
                                
                            </div>
                            <div className="file-path-wrapper">
                                <input className="file-path validate" type="text"/>
                            </div>
                            <button className="btn pink lighten-3  " 
                                    type="submit" name="action"
                                    onClick={
                                       updateImg
                                    }
                                    >Update profile Image
                                </button>      
                                
                            
                        </div> 
           
            </div>
            <div className="card-stacked">
                <div className="card-content profileinfo">
                    <h3>{userinfo.name}</h3>
                    {userinfo.email}
                    <br/><br/>
                    <div className="profileStats">
                        <h6>{myPosts.length} posts</h6>
                        <h6>{followNum(userinfo.followers)} followers</h6>
                        <h6>{followNum(userinfo.following)} following</h6>
                    </div>
                </div>
                <br/>
                <br/>
            </div>
            </div>
        </div>
        <br/>
            
            <div className='center postText'>
                <img style={{width:'20px', marginRight:'10px'}} src={gridIcon} alt='grid img'></img>
                 Gallery</div>
            <div className='userPosts'>
                {
                 
                   myPosts.map(post=>{
                       return(
                        <img className='post' src={post.picture} alt='user img' key={post._id}/>
                       )
                   })
                }
            </div>
            
        </div>
    )
}
