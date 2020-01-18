import React, {Component} from 'react';
import { Header, Icon, List } from 'semantic-ui-react';
import './App.css';
import axios from "axios";

class App extends Component {
  state = {
    values: []
  };

  componentDidMount() {
    axios.get('https://localhost:5001/api/values')
      .then(response => {
        this.setState({ values: response.data });
      })
      .catch(error => console.log(error));
  }

  render() {
    return (
      <div>
        <Header as='h2'>
          <Icon name='users' />
          <Header.Content>Reactivities</Header.Content>
        </Header>

        <List>
          {this.state.values.map((v: any) => (
              <List.Item key={v.id}>{v.name}</List.Item>
              ))}
        </List>
      </div>
    );
  }
}

export default App;
