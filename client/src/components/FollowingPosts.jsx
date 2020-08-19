import React, { useState,useEffect } from 'react'
import './css/Styles.css'
import axios from 'axios';
import {Link} from 'react-router-dom'
import redHeart from '../img/redHeart.png'

export default function Homepage() {
    //const history = useHistory();
    //data stores all the public posts as array
    const [data,setData] = useState([]);
    const [comment,setComment]=useState('');
    //fetch posts from my API
    useEffect(() => {
        const cancelTokenGetFollowingPosts = axios.CancelToken.source();
        /*{
            
                "Authorization":'Bearer '+localStorage.getItem('jwt')
            
        }*/
        //async function to fetch data
        const fetchPosts=async()=>
        {
            var result =await axios.get('/followingpost',{
                headers:{
                    'Authorization':localStorage.getItem('jwt')
                }
            },{
                cancelToken:cancelTokenGetFollowingPosts.token
            })
            result=result.data.posts;
            setData(result);
        }
        fetchPosts();
        return () => {
            //clear up your messs
            cancelTokenGetFollowingPosts.cancel();
        }
    }, [])//load all infos at the first time


    

    //comment on a post
    const submitComment=async(content,postId)=>{
        try {
            var result = await axios.put('/comment',{
                content:content,
                postId:postId
            },{
                headers:{
                    'Authorization':'Bearer '+localStorage.getItem('jwt')
                }
            })
            result=result.data;
            const newData=data.map(each=>{
                if(each._id===result._id)
                {
                     //update old likes with new likes
                    //result.likes from back end api updated
                    //each.likeBy=result.likeBy;
                    return result;
                }
                else{
                    return each;
                }

            })
            setData(newData);
            
        } catch (error) {
            console.log('comment err:',error)
        }
    }


    //generate delete btn for user's comment
    const deleteCommentbtn =(post,comment)=>{
        var user=JSON.stringify(JSON.parse(localStorage.getItem('userinfo'))._id);
        if(JSON.stringify(comment.postBy._id)===user)
        {
            return  (<i className="material-icons deleteCommentbtn" onClick={()=>{deleteComment(post,comment)}}> 
            delete_forever</i>)
          
        }
    }

    //delete a comment 
    const deleteComment = async(post,comment)=>{
        try {
           
            var result =await axios.put('/deletecomment',{
               content: comment.content,
               commentId:comment._id,
               postId:post._id
            },{
                headers:{
                    "Authorization":'Bearer '+localStorage.getItem('jwt')
                }
            })
            //update the data with setData
            var newdata =await axios.get('/publicpost')
            newdata=newdata.data.posts;
            setData(newdata);
           
        } catch (error) {
            
        }
    }



    //like post
    const like=async(_id)=>{
        try {

            var result =await axios.put('/like',{
                postId:_id
            },{
                headers:{
                    "Authorization":'Bearer '+localStorage.getItem('jwt')
                }
            });
            result=result.data
            //modify datas
            const newData=data.map(each=>{
                //console.log(result);
                if(each._id===result._id)
                {
                     //update old likes with new likes
                    //result.likes from back end api updated
                    each.likeBy=result.likeBy;
                    return each;
                }
                else{
                    return each;
                }

            })
            //update page
            setData(newData);
        } catch (err) {
            console.log('like err:',err);
        }
    }
    //unlike post
    const unlike=async(_id)=>{
        try {
            var result =await axios.put('/unlike',{
                postId:_id
            },{
                headers:{
                    "Authorization":'Bearer '+localStorage.getItem('jwt')
                }
            })
            result=result.data
            //modify data
            const newData=data.map(each=>{
                if(each._id===result._id)
                {
                    //update old likes with new likes
                    //result.likes from back end api updated
                    each.likeBy=result.likeBy;
                    return each
                }
                else{
                    return each;
                }

            })
            //update page
            setData(newData);
        } catch (err) {
            console.log('unlike err:',err);
        }
    }
    //generate redheart if the user liked this post
    //generate white heart if user did not like this post before
    const likebtn=(each)=>{
        var find=false;
        var likes=each.likeBy;
        
        likes.forEach(like => {
            if(JSON.stringify(like._id)===JSON.stringify(JSON.parse(localStorage.getItem('userinfo'))._id))
            {
                find=true;
            }
            
        });
        if(find)
        {
            return (<img className="redHeart" src={redHeart} onClick={()=>{unlike(each._id)}} alt='Favorite'></img>
        )
        }
        else{
            return (<i className="material-icons" onClick={()=>{like(each._id)}}>favorite_border</i>
            )
        }
    }
    const profileLink=(post)=>{
        if(post.postBy._id===JSON.parse(localStorage.getItem('userinfo'))._id)
        {
            return '/profile'
        }
        else{
            return `/profile/${post.postBy._id}`;
        }
    }
    const likebyMsg=(likeList)=>{
        
        if(likeList.length===0)
        {
            return <></>
        }
        else{
            if(likeList.length===1)
            {
            return <> Liked by {likeList[0].name}</>
            }
            else{
                return <> liked by {likeList[0].name} and {likeList.length-1} others</>
            }
        }

    }
    return (
        <div className='home'>
            {
                data.map(each=>{
                    return(
                        <div className='card my-home-card input-post-field' key={each._id}>
                            <div className='postBy'>
                                <h5>
                                <img className='postProfileImg' alt='profile img' src={each.postBy.img}/>
                                    <Link to={profileLink(each)}>{each.postBy.name}</Link> 
                                   
                                </h5>
                                
                            </div>
                            
                            {/**posts */}
                            <div className='card-image'>
                                <img src={each.picture} alt='img'></img>
                            </div>
                            <div className='card-content'>
                                {likebtn(each)}
                                {likebyMsg(each.likeBy)}
                                <br/>
                                <span className='boldText' >
                                    <span>{ each.likeBy.length+' likes'}</span>
                                        <br/><br/>
                                        {each.postBy.name+': '}
                                </span>
                                
                                <span>{ each.content}</span>
                                <br/>    
                                {
                                    each.comments.map(comment=>{
                                    
                                    return(
                                       <div key={comment._id}>
                                            <span  className='boldText'>{comment.postBy.name+": "}</span>
                                             {comment.content}{deleteCommentbtn(each,comment)}
                                       </div>                                                    
                                        )
                                        
                                    })
                                  
                                }
                            </div>
                             <div className='card-action buttonIn'>              
                                <input id={each._id} type="text" onChange={e=>setComment(e.target.value)} 
                                placeholder="add a comment"/>
                                    <button className='replybtn' type='submit' name='action'
                                    onClick={()=>{
                                        submitComment(comment,each._id)
                                        document.getElementById(each._id).value=''}}> Post</button>  
                               
                                
                                
                            </div>
                        </div>
                    )
                })
            }
            {/**personalized card looking */}
            

         
        </div>
    )
}
