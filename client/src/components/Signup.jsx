import React,{useState} from 'react'
import './css/Styles.css'
import {Link, useHistory} from 'react-router-dom'
import axios from 'axios'
import M from 'materialize-css'
export default function Signup() {
    //use the useHistory hook to redirect pages
    //ex:history.push(/login)
    const history = useHistory();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    
    const POST = async()=>{
      
        try {
           var data= await axios.post('/signup',{
                name,
                password,
                email
            });

            if(data.data.success)
            {
                M.toast({html:data.data.success,classes:'green darken-2'})
                history.push('/login');
            }
            else  if(data.data.error)
            {
                M.toast({html:data.data.error,classes:'red darken-2'})

            }
            else if(data.data.exist)
            {
                M.toast({html:data.data.exist,classes:'blue darken-2'});
            }
        } catch (error) {
            console.log(error);
            M.toast({html:error,classes:'pink darken-4'})

        }
        
    }
    return (
        <div>
           <div className="row">
           <div className="col s12 m3 "></div>
           <div className="col s12 m6 ">
           <div className="card  darken-1 login">
               <h3>Sign Up</h3>
               <div className="card-content white-text center input-field">
                   
                  <input type='text' 
                   placeholder='name'
                   value={name}
                   onChange={e=>setName(e.target.value)}>
                   </input>

                   <input type='email' 
                   placeholder='email'
                   value={email}
                   onChange={e=>setEmail(e.target.value)}>
                   </input>

                   <input type='password' 
                   placeholder='password'
                   value={password}
                   onChange={e=>setPassword(e.target.value)}></input>

                    <button className="btn pink lighten-1 loginbtn" 
                    type="submit" name="action" onClick={()=>POST()}>
                        Sign up
                   </button>

                   <div className='lostbtn'>
                   <span className='text-black'>Have an account? </span>
                   <Link to='/login'> Login</Link>
                   <br></br>
                   <br></br>
                    <Link  to='/signup'>Forget Password</Link>
                                        
                </div>
               </div>
           </div>
           </div>
           </div>
       </div>
       )
}
