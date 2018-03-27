import React from 'react';
import { Map, Marker, InfoWindow, GoogleApiWrapper } from 'google-maps-react';
import * as app_data from '../../app_data.js';
import { showGameDetails } from '../js/gameDetails.js'

export class Container extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            markers: [],
            currentLoc : {lat:42.73018076004365, lng:-73.67882251739502},
            showInfoWindow: false,
            activeMarker: {},
            selectedPlace: {}
        };

        this.addMarker = this.addMarker.bind(this);
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.isEqual = this.isEqual.bind(this);
    }

    componentDidMount() {
        // when the map is mounted, grab the games from the database and pin them to the map
        $.getJSON('/api/getGames', {}, (data) => {
            this.setState({
                markers: data
            });
        });
        // set the position of the map to the user's current location
        if (navigator && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const coords = pos.coords;
                this.setState({
                    currentLoc: {
                        lat: coords.latitude,
                        lng: coords.longitude
                    }
                });
            });
        };
    }

    addMarker(mapProps, map, clickEvent) {
        // remove any InfoWindow when the map is clicked on
        this.setState({
            showInfoWindow: false
        });
        // if the toggle for adding markers is false, don't do anything
        if (!window.toggle) return;
        // update the position of the marker added and the state for the component
        window.createdMarkerPosition = {lat: clickEvent.latLng.lat(), lng: clickEvent.latLng.lng()};
        this.setState({
            markers: [{name: "Current Location", latitude: window.createdMarkerPosition.lat, longitude: window.createdMarkerPosition.lng}]
        });
        console.log("should have added marker");
    }

    onMarkerClick(markerProps, marker, e) {
        this.setState({
            selectedPlace: markerProps,
            activeMarker: marker,
            showInfoWindow: this.isEqual(marker, this.state.activeMarker)
        });
        
        showGameDetails(markerProps.name);
    }

    isEqual(marker1, marker2) {
        // return a boolean on if to show an InfoWindow for a marker
        if(this.state.showInfoWindow === false || "undefined" === typeof marker2 || Object.keys(marker2).length === 0 || 
            !(marker1.position.lat() === marker2.position.lat() && marker1.position.lng() === marker2.position.lng())){
            return true;
        }
        return false;
    }

    render() {

        if (!this.props.loaded) {
            return <div>Loading...</div>
        }

        return (
            <Map google={this.props.google}
                 containerStyle={{width: "70%", height: "100%"}}
                 style={{width: "100%", height: "100%", position: "static"}}
                 initialCenter={this.state.currentLoc}
                 onClick={this.addMarker}>

                {this.state.markers.map((marker, index) => {
                    return <Marker name={marker.gameID}
                                   position={{lat:Number(marker.latitude), lng:Number(marker.longitude)}}
                                   onClick={this.onMarkerClick}
                                   icon={"images/" + marker.sport + ".png"}
                                   key={index} />
                })}

                <InfoWindow marker={this.state.activeMarker} visible={this.state.showInfoWindow}>
                    <div><h1>{this.state.selectedPlace.name}</h1></div>
                </InfoWindow>

            </Map>
        );
    }
}

export default GoogleApiWrapper({
  apiKey: app_data.googleAPIKey,
  version: 3.26
})(Container);