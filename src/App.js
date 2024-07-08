/* eslint-disable no-useless-concat */
import React, { Component } from 'react';
import ParticlesBg from 'particles-bg'
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';

import './App.css';


const app = new Clarifai.App({
  apiKey: 'a6d8782a88d84ce9a536d0df89696caf'
});

const returnClarifaiRequestOprions =(imageUrl) => {
  const PAT = 'c74aec1c0b7b497d8a2ecfbdd4885af8';
  const USER_ID = 'fusnk12vfifx';       
  const APP_ID = 'facerecognitionbrain';
  const MODEL_ID = 'face-detection';
  const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                }
            }
        }
    ]
  });

  const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
  };

  return requestOptions;
 }

class App extends Component {
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
    console.log(box);
    this.setState({box: box})
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input})

    fetch("https://api.clarifai.com/v2/models/" + "face-detection" + "/outputs", returnClarifaiRequestOprions(this.state.input))
    .then(response => response.json())
    .then((response) => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err))
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});

  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <ParticlesBg type="cobweb" bg={true}  num={80} color='#F5F5F5'/>
        <Navigation isSignedIn={ isSignedIn } onRouteChange={this.onRouteChange}/>
          { route === 'home'
            ? <div>
                <Logo />
                <Rank />
                <ImageLinkForm 
                  onInputChange={this.onInputChange} 
                  onButtonSubmit = {this.onButtonSubmit} 
                />
                <FaceRecognition box={ box } imageUrl={ imageUrl } />
              </div>
            : ( route === 'signin'
                ? <SignIn onRouteChange = {this.onRouteChange} />
                : <Register onRouteChange = {this.onRouteChange} />
            )
          }
      </div>
    );
  }
}

export default App;
