import React,{useState} from 'react'
import './css/Styles.css'
import {useHistory} from 'react-router-dom'
import axios from 'axios'
import M from 'materialize-css'
export default function NewPost() {
    const history = useHistory();
    const [content,setContent] = useState('');
    const [image,setImage]=useState('');
    //const [imageUrl,setImageUrl]= useState('');
    const imagePost=async()=>{
        //FormData for image
        const imgdata = new FormData();
        imgdata.append('file',image);
        imgdata.append('upload_preset','instagram')
        imgdata.append('cloud_name','dwu20')
        var result;
        try {
            //upload pictures to cloudinary to store data
            result= await axios.post('https://api.cloudinary.com/v1_1/dwu20/image/upload',imgdata);
            console.log(result.data.secure_url);
    
            //setImageUrl(result.data.secure_url);
        } catch (error) {
            console.log(error);
        }
        try {
            var data= await axios.post('/newpost',{
                content,
                picture:result.data.secure_url
            },
            {headers:{
                Authorization:'Bearer '+localStorage.getItem('jwt')
            }});
            if(data.data.error)
            {
                M.toast({html:data.data.error,classes:'red darken-2'});
            }
            else{
                console.log(data.data);
                M.toast({html:'successful created post',classes:'green darken-2'});
                history.push('/');
            }
     
        } catch (error) {
            console.log(error);
            M.toast({html:error,classes:'pink darken-2'});
        }
       
      
    }

    return (
        <div>
             <div className ='card new-post-card input-field'>

            <input type='text' 
            placeholder='content'
            onChange={e=>setContent(e.target.value)}
            ></input>


            <div className="file-field input-post-field ">
            <div className="btn uploadPic red lighten-1">
                <span >Upload Img</span>
                <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>

            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text"></input>
            </div>
            </div> 
                <button className="btn pink lighten-3 loginbtn" 
                type="submit" name="action"
                onClick={e=>imagePost()}>
                        Submit
                </button>       
            </div>
            
        </div>
       
        
    )
}
