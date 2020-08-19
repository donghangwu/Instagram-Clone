import React,{useContext} from 'react'
import '../App.css'
import './css/Styles.css'
import{UserContext} from '../App'
import {Link, useHistory} from 'react-router-dom'
export default function Navbar() {
  const {state,disPatch}=useContext(UserContext)
  const history = useHistory();
  //clear the login info at localStorage
  //remove login info in context
  const logout=()=>{
    localStorage.clear();
    //call dispatch function to clear data stored in state
    disPatch({type:'LOGOUT'})
    history.push('/login')
  }
  const navar=()=>{
    var id=1;
      if(state)
    {
      return[
        <li key={id++}><Link to="/">Home</Link></li>,
        <li key={id++}><Link to="/followingpost">Followings</Link></li>,
        <li key={id++}><Link to="/profile">Profile</Link></li>,        
        <li key={id++}><Link to="/newpost">New Post</Link></li>,
        <li key={id++}>
          <button className='btn logoutbtn' onClick={logout}>
            LOG OUT</button>
        </li>
      ]
    }
    else{
      return [
        <li key={id++}><Link to="/login">Log in</Link></li>,
        <li key={id++}><Link to="/signup">Sign up</Link></li>
      ]
    }
  }
  const protectHome=()=>{
    if(state)
      return '/';
    else 
      return '/login';
  }
    return (
        <div className='navbar-fixed'>
          <nav>
          <div className="nav-wrapper white  ">
              {/**unlike a href 
               * Link to will not make the page refresh everytime */}

              
            <Link to={protectHome()} className="brand-logo">Instargram</Link>
            <ul id="nav-mobile" className="right">
              {navar()}
            </ul>
          </div>
        </nav>
      </div>
    )
}
