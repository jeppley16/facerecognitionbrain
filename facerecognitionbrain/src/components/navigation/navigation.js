import React from 'react';
import './Navigation.css';

const Navigation = ({onRouteChange, isSignedIn}) => {
		if (isSignedIn) {
			return(
			<nav style={{display: 'flex', justifyContent: 'flex-end'}}>
				<p className='brand f2 pa3 black'>Face Find</p>
				<p onClick={() => onRouteChange('signout')} 
				className='f3 link dim black underline pa3 pointer'>Sign Out</p>
			</nav>
			);
		} else {
			return(
			<nav style={{display: 'flex', justifyContent: 'flex-end'}}>
				<p className='brand f2 pa3 black'>Face Find</p>
				<p onClick={() => onRouteChange('signin')} 
				className='f3 link dim black underline pa3 pointer'>Sign In</p>
				<p onClick={() => onRouteChange('register')} 
				className='f3 link dim black underline pa3 pointer'>Register</p>
			</nav>
			);
		}
} 

export default Navigation;