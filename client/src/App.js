import React, { useContext } from 'react';
import Navbar from './components/Navbar'
import './App.css'
import {BrowserRouter,Route, useHistory, Switch} from 'react-router-dom'
import Home from './components/Homepage'
import Profile from './components/Profile'
import MyProfile from './components/MyProfile'
import Signup from './components/Signup'
import Login from './components/Login'
import NewPost from './components/NewPost'
import Followingpost from './components/FollowingPosts'
import NotFound from './components/errorPage/NotFount'
import {useEffect,createContext,useReducer} from 'react'
import {reducer,initialState} from './components/reducer/userReducer'
export  const UserContext = createContext()

const MyRoutes =()=>{
  const history = useHistory();
  const {state,disPatch} = useContext(UserContext)

  //protect routes by checking the user is login or not
  useEffect(()=>{
    const user =JSON.parse(localStorage.getItem('userinfo'));
    if(user)
    {
      //pass user info to context to protect route
      disPatch({type:"USER",payload:user});
    }
    else{
      history.push('/login')
    }
    console.log('localstorage:',user);
  },[]);
  return(
    <Switch>  
      <Route path = '/' exact>
        <Home />
      </ Route>

      <Route path = '/login' exact>
        <Login />
      </ Route>

      <Route path = '/signup' exact>
        <Signup />
      </ Route>

      <Route path = '/profile' exact>
        <MyProfile />
      </ Route>

      <Route path = '/profile/:userid' exact>
        <Profile />
      </ Route>

      <Route path='/followingpost'>
      <Followingpost/>
      </Route>


      <Route path = '/newpost'exact>
        <NewPost />
      </ Route>


      
      <Route path = '*' component={NotFound} />
    </Switch>
  )
  
  
}
function App() {
  const [state,disPatch] = useReducer(reducer,initialState)
  return (
 
    <UserContext.Provider value={{state,disPatch}}>   
    {
      //above is pass dispatch as part of context down so 
      //i can update the state from child compoents
    } 
    <BrowserRouter>
      
      {/* Nav bar will show in any page for redirect*/}
      <Navbar/>
      {/* other pages */}
      <MyRoutes />
    </BrowserRouter>
    </UserContext.Provider>

    
  );
}

export default App;
