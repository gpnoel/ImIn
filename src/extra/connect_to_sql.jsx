import React from 'react';

class SQL extends React.Component {

  handleSubmit(event) {
    console.log("starting handling submit");
    var user = {
        'clientname': 'CH Yamini Sankar',
        'email': 'mail@mail.com',
        'phonenumber': '9490430491',
        'message': 'hello world'
    };

    fetch('/api/connect', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(response) {
        console.log("from JSX:");
        console.log(response.text());
    });
  }

  render() {
    return (
        <div>
            <button onClick={this.handleSubmit}>Connect to database</button>
        </div>
    );
  }

}

export default SQL;