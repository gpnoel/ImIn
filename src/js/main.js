//import ../css/index.css
import React from 'react';
import ReactDOM from 'react-dom';
import Chat from '../components/chat.jsx';
import Container from '../components/map.jsx';
import Form from '../components/form.jsx';
import '../css/index.css';
import '../bootstrap-4.0.0-dist/css/bootstrap.min.css'


window.toggle = false;
window.createdMarkerPosition = {lat: 0, lng: 0};
ReactDOM.render(<Container />, document.getElementById('mapContainer'));
ReactDOM.render(<Chat />, document.getElementById('chatContainer'));
ReactDOM.render(<Form />, document.getElementById('formContainer'));

var chat = $("#chatContainer").detach();
var form = null;

// module.hot.accept();
// if (module.hot) {
//   module.hot.accept('../components/form.jsx', function() {
//     console.log('Accepting the updated Form component');
//     const newForm = require('../components/form.jsx').default
//     render(newForm)
//   });
// }
// (() => {
//   console.log("good vibes :)")
// })();


// import _ from 'lodash';
// function component() {
//   var element = document.createElement('div');

//   // Lodash, currently included via a script, is required for this line to work
//   element.innerHTML = _.join(['Hello', 'webpack'], ' ');

//   return element;
// }
// document.getElementById('formContainer').appendChild(component());
