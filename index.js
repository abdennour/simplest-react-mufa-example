import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import {on, fire} from 'mufa';

class SearchGithubUser extends Component {
  constructor() {
    super(...arguments);
    this.state={data: ''};
  }

  componentDidMount() {
    on('success_userInfo_request', (response) =>
       this.setState({data: (<img src={response.avatar_url} />)})
    );

    on('fail_userInfo_request', (message) =>
       this.setState({data: message})
    );
  }

  handleClick(){
    fire('start_userInfo_request', this.refs.input.value);
  }

  render() {
    return (
        <div>
            <div>
              <input ref="input" type="text" placeholder="github username" />
              <button onClick={this.handleClick.bind(this)}>Search</button>

            </div>
            <div>
              <p>{this.state.data}</p>
            </div>
        </div>
      )
  }
}

//--- API endpoints service(s)
class GithubAPIService {
  userInfo(username) {
    return fetch(`https://api.github.com/users/${username}`)
      .then(response => response.json())
  }
}
const githubAPIService = new GithubAPIService();

//-- Connect service(s) to Mufa
on('start_userInfo_request', (username) => {
  githubAPIService.userInfo(username).then((response) => {
    if  (response && response.message === 'Not Found') {
      fire('fail_userInfo_request', 'User is not found');
    } else {
      fire('success_userInfo_request', response)
    }
  }).catch(() =>
      fire('fail_userInfo_request', 'An error was occured!')
  );
});

//----mount component
ReactDOM.render(
  <SearchGithubUser />,
  document.getElementById('root')
);
