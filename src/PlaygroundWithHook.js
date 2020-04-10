import React, { useState } from 'react';
import axios from 'axios';

// Test users: gaearon, octocat, bvaughn, sophiebits, sebmarkbage

const CardList = (props) => (
  <div>
    {props.profiles.map(element => <Card key={element.id} {...element}/>)};
  </div>
);

class Card extends React.Component {
  //constructor
  //this
  render () {

    const profile = this.props;
    
    return (
      <div style={{ margin: '1rem'}}>
        <img alt={profile.login} src={profile.avatar_url} />
        <div style={{display: 'inline-block', marginLeft: 10}}>
          <div style={{fontSize: '125%'}}>{profile.name}</div>
          <div>{profile.company}</div>
        </div>
      </div>
    );
  }
}

class App extends React.Component {
  //constructor
  //this
  constructor(props) {
    super(props);
    this.state = {
      profiles: [],
    };
  }

  addNewProfile = (profileData) => {
    this.setState(prevState => ({
      profiles: [...prevState.profiles, profileData]
    }));
  };

  render () {
    return (
      <>
        <div>{this.props.title}</div>
        <Form onSubmit={this.addNewProfile}/>
        <CardList profiles={this.state.profiles}/>
      </>
    );
  }
}

let Form = (props) => {
  //constructor
  //this
  //state = { userName: ''};

  let [userName, setUserName] = useState('');

  let handleSubmit = async (event) => {
    event.preventDefault(); //Don't Refresh
    const resp = await axios.get(`https://api.github.com/users/${userName}`);
    props.onSubmit(resp.data);
    setUserName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text"
        placeholde="GitHub username"
        value={userName}
        onChange={event => setUserName(event.target.value)}
        required />
      <button>Add Card</button>
    </form>
  );
}

function PlaygroundWithHook() {
  return (
    <>
      <App title="The GitHub cards App"/>
    </>
  );
}

export default PlaygroundWithHook;
