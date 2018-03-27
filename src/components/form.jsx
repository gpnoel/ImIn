import React from 'react';
import createdMarkerPosition from "../js/main.js";
import { imin } from '../js/imin.js'

window.toggle = false;

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: "",
            time: "",
            description: "",
            sport: "",
            markerAddingButton: "Click to Drop Pin",
            longitude: 0,
            latitude: 0
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.toggleAddMarker = this.toggleAddMarker.bind(this);
        this.validateForm = this.validateForm.bind(this);
    }

    handleInputChange(event) {
        // function to handle when a user updates an input field on the form
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    toggleAddMarker(event) {
        // update the button value on if a user is able ot add a marker to the map or not
        window.toggle = !window.toggle;
        this.setState({
            markerAddingButton: window.toggle ? "Click to Interact With Map" : "Click to Drop Pin"
        });
    }

    validateForm(e) {
        // function to validate the form on submission
        // e.g. a sport, location, date, and time for event is required
        // then the data is sent to the server and the game is saved
        e.preventDefault();

        this.setState({
            latitude: window.createdMarkerPosition.lat,
            longitude: window.createdMarkerPosition.lng
        }, ( ) => {

            if (this.state.sport === "") {
                $("#form").validate().showErrors({sport: "Please select a sport"});
                return;
            }

            if (this.state.latitude === 0 && this.state.longitude == 0) {
                $("#form").validate().showErrors({latitude: "Please place a marker first"});
                return;
            }

            FB.api('/me', {fields: 'name,first_name'}, (response) => {
                var stringToBeSent = $("#form").serialize()+`&creatorID=${response.id}`+`&creatorName=${response.name}`;
        
                $.post("/api/form", stringToBeSent, function(data, textStatus){
                    imin(data.gameID, true);
                });
            });
        });

    }

    render() {
        return (
            <form id="form" action="/api/form" method="post" encType="multipart/form-data" onSubmit={this.validateForm}>

                <div className="form-group">
                  <label className="col-2 col-form-label">Sport</label>
                  <div className="col-10">
                      <select className="form-control" id="inlineFormCustomSelect" name="sport" value={this.state.sport} onChange={this.handleInputChange} required>
                        <option defaultValue>Choose...</option>
                        <option value="Basketball">Basketball</option>
                        <option value="Baseball">Baseball</option>
                        <option value="Tennis">Tennis</option>
                        <option value="Frisbee">Frisbee</option>
                        <option value="Soccer">Soccer</option>
                      </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="col-2 col-form-label">Date</label>
                  <div className="col-10">
                    <input className="form-control" type="date" name="date" id="date"/>
                  </div>
                </div>

                <div className="form-group">
                  <label  className="col-2 col-form-label">Time</label>
                  <div className="col-10">
                    <input className="form-control" type="time" name="time" step="60" defaultValue="12:00" id="time-input"/>
                  </div>
                </div>

                <div className="form-group">
                  <label className="col-2 col-form-label">Description</label>
                  <div className="col-10">
                    <textarea className="form-control" rows="3" id="description" name="description" placeholder="Enter a description for the event" value={this.state.description} onChange={this.handleInputChange}></textarea>
                  </div>
                </div>

                <input type="number" name="latitude" value={this.state.latitude} hidden required></input>
                <input type="number" name="longitude" value={this.state.longitude} hidden required></input>

                <div className="Row">
                    <div className="Column"><input type="button" className="btn btn-primary" name="markerAddingButton" value={this.state.markerAddingButton} onClick={this.toggleAddMarker}></input></div>
                    <div className="Column"><button type="submit" className="btn btn-primary">Create Game</button></div>
                </div>

              </form>
        );
    }
}

export default Form;