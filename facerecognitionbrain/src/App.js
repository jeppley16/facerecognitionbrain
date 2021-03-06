import React, { Component } from 'react';
import Navigation from './components/navigation/navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';
import './App.css';

// ############ APP CONFIGURATION ###############


const particlesOptions = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        email: '',
        id: '',
        name: '',
        entries: 0,
        joined: ''
      }
    }

// ########## DEFINING APP ####################
class App extends Component {
// ############ Constructs initial app state for session
  constructor() {
    super();
    this.state = initialState;
  }

//########## STATE CHANGE DEFINITIONS ####################

// ########## Detects change in URL import box ###

loadUser = (data) => {
  this.setState({user: {
        email: data.email,
        id: data.id,
        name: data.name,
        entries: data.entries,
        joined: data.joined
  }})
}


calculateFaceLocation = (data) => {
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputimage');
  const width = Number(image.width);
  const height = Number(image.height);
  return {
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height)
  }
}

displayFaceBox = (box) => {
  this.setState({box: box});
}

// Detects a link input to box, changes input state to value
// This function can be passed as a prop to the component
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }


// ######## Detects button click
  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
      fetch('https://obscure-river-70438.herokuapp.com/imageurl', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            input: this.state.input
          })
        })
    .then(response => response.json())
    .then(response => {
      if (response) {
        fetch('https://obscure-river-70438.herokuapp.com/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {
              entries: count
            })) //object.assign allows for only updating entries
          })
          .catch(console.log) //error handling
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err));
 }  

 onRouteChange = (route) => {
  if (route === 'signout') {
    this.setState(initialState)
  } else if ( route === 'home') {
    this.setState({isSignedIn: true})
  }
  this.setState({route: route});
 }

//###### Renders application interface (state)
  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
           params={particlesOptions}      />
        <Navigation 
        isSignedIn={isSignedIn}
        onRouteChange={this.onRouteChange}/>
        { route === 'home' 
          ? <div>
              <Logo />
              <Rank 
                name={this.state.user.name}
                entries={this.state.user.entries}
                />  
              <ImageLinkForm 
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition
                box={box}
                imageUrl={imageUrl}
              />
            </div>
            : (
                route === 'signin' 
                ? <Signin 
                    onRouteChange={this.onRouteChange}
                    loadUser={this.loadUser}
                    />
                : <Register 
                    onRouteChange={this.onRouteChange}
                    loadUser={this.loadUser}
                    />
              )
      }
      </div>
    );
  }
}

export default App;
