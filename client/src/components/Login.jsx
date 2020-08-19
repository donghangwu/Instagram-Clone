import React,{useState,useContext} from 'react'
import './css/Styles.css'
import {UserContext} from '../App.js'
import {Link,useHistory} from 'react-router-dom'
import axios from 'axios'
import M from 'materialize-css'
export default function Login() {
    const {state,disPatch} = useContext(UserContext)
    const history = useHistory();
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const POST=async()=>{
        try {
            var data= await axios.post('/login',{
                email,
                password
            });
            if(data.data.error)
            {
                M.toast({html:data.data.error,classes:'red darken-2'});
            }
            else{
                //use local storage to save the login token and user info
                localStorage.setItem('jwt',data.data.token);
                //pass user's info into context can be user later to adjsut page content
                localStorage.setItem('userinfo',JSON.stringify(data.data.user))
                disPatch({type:'USER',payload:data.data.user});
                M.toast({html:'successful login',classes:'red darken-2'});
                history.push('/');
            }
     
        } catch (error) {
            console.log(error);
            M.toast({html:error,classes:'pink darken-2'});
        }
       

    }
    return (
     <div>
        <div className="row">
        <div className="col s12 m3 "></div>
        <div className="col s12 m6 ">
        <div className="card  darken-1 login">
            <h3>Login</h3>
            <div className="card-content white-text center input-field">
                
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
                 type="submit" name="action" onClick={POST}>
                     Login
                </button>
                <div className='lostbtn'>
                    <Link to='/signup'>Forget Password</Link>
                    <br></br>
                    <br></br>
                    <span className='text-black'>Don't have an account? </span>
                    <Link to='/signup'> Sign Up</Link>
                </div>
                
            </div> 
        </div>
        </div>
        </div>
    </div>
    )
}
