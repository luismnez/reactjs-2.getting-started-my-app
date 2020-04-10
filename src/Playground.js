import React from 'react';
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

class Form extends React.Component {
  //constructor
  //this
  state = { userName: ''};

  handleSubmit = async (event) => {
    event.preventDefault(); //Don't Refresh
    const resp = await axios.get(`https://api.github.com/users/${this.state.userName}`);
    this.props.onSubmit(resp.data);
    this.setState({ userName: ''});
  };

  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <input 
          type="text"
          placeholde="GitHub username"
          value={this.state.userName}
          onChange={event => this.setState({ userName: event.target.value })}
          required />
        <button>Add Card</button>
      </form>
    );
  }
}

function Playground() {
  return (
    <>
      <App title="The GitHub cards App"/>
    </>
  );
}

export default Playground;
