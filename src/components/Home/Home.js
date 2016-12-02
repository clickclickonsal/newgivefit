import React, { PropTypes as T } from 'react'
import RaisedButton from 'material-ui/RaisedButton';
import AuthService from 'utils/AuthService';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import styles from './styles.module.css';
import ProfileDetails from '../Profile/ProfileDetails';
import ProfileEdit from '../Profile/ProfileEdit';
/*possible reference: https://github.com/scaphold-io/auth0-lock-playground*/
export class Home extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      profile: props.auth.getProfile(),
      token: props.auth.getToken(),
    };

    props.auth.on('profile_updated', (newProfile) => {
      console.log('newProfile', newProfile)
      var token = this.state.token;
      var identity = newProfile.identities[0];
      console.log("token", token)
      console.log("identity", identity)
      this.props.register({
        identity, token
      }).then(({ data }) => {
        console.log('got data', data);
      }).catch((error) => {
        console.log('there was an error sending the query', error);
      });
      console.log('what do we have', newProfile)
      this.setState({
        profile: newProfile,
      })
    })
  }

  logout(){
    this.props.auth.logout()
    this.context.router.push('/login');
  }

  render(){
    const { profile } = this.state    
    return (
      <div className={styles.root}>
        <p>Welcome, {profile.given_name}!</p>
        <ProfileDetails profile={profile}></ProfileDetails>
        <ProfileEdit profile={profile} auth={this.props.auth}></ProfileEdit>
        <RaisedButton onClick={this.logout.bind(this)}>Logout</RaisedButton>
      </div>
    )
  }
}

Home.contextTypes = {
  router: T.object
};

Home.propTypes = {
  auth: T.instanceOf(AuthService),
  register: T.func.isRequired
};

const LOGIN_USER_WITH_AUTH0_LOCK = gql `
  mutation loginUserWithAuth0Lock($data: LoginUserWithAuth0LockInput!) {
    loginUserWithAuth0Lock(input: $data) {
    token
    user{
      id
      username
    }
    }
  }
`
const HomeContainerWithData = graphql(LOGIN_USER_WITH_AUTH0_LOCK, {
  props: ({ mutate }) => ({
    register: (data) => mutate({
      variables: {
        data
      }
    }),
  }),
})(Home);

export default HomeContainerWithData;