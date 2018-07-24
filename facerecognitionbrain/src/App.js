import React, { Component } from 'react';
import Navigation from './components/navigation/navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';

// ############ APP CONFIGURATION ###############

const app = new Clarifai.App({
 apiKey: 'e3556d2ed80c497f8090d95f7fff0790'
});


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

// ########## DEFINING APP ####################
class App extends Component {
// ############ Constructs initial app state
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

//########## STATE CHANGE DEFINITIONS ####################

// ########## Detects change in URL import box ###
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


  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }
// ######## Detects button click
  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err));
 }  

 onRouteChange = (route) => {
  if (route === 'signout') {
    this.setState({isSignedIn: false})
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
              <Rank />  
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
                ? <Signin onRouteChange={this.onRouteChange}/>
                : <Register onRouteChange={this.onRouteChange}/>
              )
      }
      </div>
    );
  }
}

export default App;
