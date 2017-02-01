import React, { Component, PropTypes as T } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import GroupAdd from 'material-ui/svg-icons/social/group-add';
import Toggle from 'material-ui/Toggle';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Comment from 'material-ui/svg-icons/communication/comment';
import WorkoutPost from './WorkoutPost';
import WorkoutCreator from './WorkoutCreator';
import {Tabs, Tab} from 'material-ui/Tabs';
import AddAPhoto from 'material-ui/svg-icons/image/add-a-photo';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import ReactFilepicker from 'react-filepicker';
import configKeys from '../../../../../configKeys';
import apolloConfig from '../../../../../apolloConfig';
import AuthService from 'utils/AuthService';

const inlineStyles = {
  listStyle: {
    'list-style-type': 'none'
  }
}

class GroupCreator extends Component {
  constructor(props: any) {
    super(props);
    console.log("GroupCreator props", props)
    this.state = {
      open: false,
      expanded: false,
      recur: true,
      title: undefined,
      contentSnippet: undefined,
      location: undefined,
      lat: undefined,
      lng: undefined
    };
    this._handleTitleChange = this._handleTitleChange.bind(this);
    this._handleDescriptionChange = this._handleDescriptionChange.bind(this);
    this._handleLocationChange = this._handleLocationChange.bind(this);
    this._handleAutoComplete = this._handleAutoComplete.bind(this);
    this.addImage = this.addImage.bind(this);
    this.submitWorkoutGroup = this.submitWorkoutGroup.bind(this);
    this.auth = new AuthService(apolloConfig.auth0ClientId, apolloConfig.auth0Domain);
  };
  handleOpen(){
    console.log('handling open')
    this.setState({open: true});
  };
  handleToggle(event, toggled){
    this.setState({
      [event.target.name]: toggled,
    });
  };
  submitWorkoutGroup(e){
    if (e) {
      e.preventDefault();
    }
    console.log('submitWorkoutGroup props', this.props)
    const address = this.state.location;
    const scapholdUser = this.auth.getLoggedInUser();
    this.props.geocoder.geocode({'address' : address}, (results, status) => {
      if(status == google.maps.GeocoderStatus.OK){
        console.log('geocoded results', results)
        this.setState({
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        })
        console.log('submitWorkoutGroup props inside geocoder', this.props)
        this.props.createWorkoutGroup({
          title: this.state.title,
          contentSnippet: this.state.contentSnippet,
          lat: this.state.lat,
          lng: this.state.lng,
          image: this.props.profile.picture,
          avatar: this.props.profile.picture,
          userGroupsId: scapholdUser
        }).then(({ data }) => {
          console.log("data", data)
          this.setState({
            open: false
          });
        }).catch((error) => {
          console.error('error in form', error)
          this.setState({
            open: false
          });
        });
      }else{
            console.log('nah', status)
            this.setState({
            open: false
          });
        }
    })
    console.log('closed');
  };
  //reference https://scotch.io/tutorials/handling-file-uploads-painlessly-with-filepicker
  //https://www.youtube.com/watch?v=ngeYUo7ElGY
  addImage(){
    filepicker.pick(
      {
        mimetype: 'image/*',
        container: 'window',
        services: ['COMPUTER', 'FACEBOOK', 'INSTAGRAM', 'GOOGLE_DRIVE', 'DROPBOX']
      },
      function(Blob){
        console.log(JSON.stringify(Blob));
      },
      function(FPError){
        console.log(FPError.toString());
      }
    );
  };
  handleReduce(){
    this.setState({expanded: false});
    console.log('reduced')
  };
  handleExpand(){
    this.setState({expanded: true});
    console.log('expanded')
  };
  //consider this syntax:
  /*updateUsername(e){
    this.setState({
      username: e.target.value,
    })
  }*/
  _handleTitleChange(e){
    this.state.title = e.target.value;
  };
  _handleDescriptionChange(e){
    this.state.contentSnippet = e.target.value;
  };
  _handleLocationChange(e){
    this.state.location = e.target.value;
  };
  //Not working
  _handleAutoComplete(){
    new google.maps.places.Autocomplete(
    (document.getElementById('autocomplete')), {
        types: ['geocode']
    });
  }
  render() {
    const actions = [
      <FlatButton
        label="Ok"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.submitWorkoutGroup.bind(this)}
      />,
    ];
    return (
      //Need to improve styling a lot here
      <div>
        <div>
        <RaisedButton 
          label="Create a workout group" 
          labelPosition="before"
          onTouchTap={this.handleOpen.bind(this)}
          icon={<GroupAdd />}
        />
        </div>
        {
          !this.auth.loggedIn() ?
            <div>
              <Dialog
                title="Please Login to Create a Workout Group"
                actions={actions}
                modal={false}
                open={this.state.open}
                onRequestClose={this.submitWorkoutGroup.bind(this)}
              >
              </Dialog>
            </div> :
            <div>
              <Dialog
                title="Add your own awesome group"
                actions={actions}
                modal={false}
                open={this.state.open}
                onRequestClose={this.submitWorkoutGroup.bind(this)}
              >
               <Card>
                  <ul className={inlineStyles.listStyle}>
                    <li>
                      <TextField 
                        hintText="Group Title"
                        id="autocomplete"
                        name="groupTitle"
                        onChange={this._handleTitleChange}
                      />
                    </li>
                    <li>
                      <ReactFilepicker apikey={configKeys.FILESTACK_API} onTouchTap={this.addImage}/>
                    </li>
                    <li>
                      <TextField 
                        hintText="Location"
                        id="autocomplete"
                        onChange={this._handleLocationChange}
                        //onTouchTap={this._handleAutoComplete}
                      />
                    </li>
                </ul>
                {/*<RaisedButton 
                  label="Add an Image"
                  type="filepicker"
                  onTouchTap={this.addImage.bind(this)}
                  icon={<AddAPhoto/>}
                />
                <input type="filepicker" data-fp-apikey="AqoZLyjES7m7e3lO4h8ZFz" onChange={alert(event.fpfile.url)}/>*/}
               </Card>
              </Dialog>
            </div> 
          }
      </div>
    );
  }
}

/*GroupCreator.propTypes = {
  createWorkoutGroup: T.func.isRequired
};*/

//Data operations begin below
const LoggedInUserQuery = gql`
query LoggedInUser {
  viewer {
    user {
      id
      username
      nickname
    }
  }
}
`;

//I want to tie the workout group to a user
const CREATE_WORKOUT_GROUP = gql`
  mutation CreateWorkoutGroup($input: CreateWorkoutGroupInput!) {
  createWorkoutGroup(input:$input){
    changedWorkoutGroup{
      title,
      lat,
      lng,
      image,
      avatar,
      UserGroups {
        id
      }
    }
  }
}
`;

//Get some WorkoutGroups
const GET_THROUGH_VIEWER = gql`
  query GetThroughViewer($first: Int) {
    viewer {
      allWorkoutGroups(first: $first) {
        edges {
          node {
          id
          image
          title
          lat
          lng
          avatar
          contentSnippet
          }
        }
      }
  }
}
`;

//How many WorkoutGroups to return
const FIRST = 8;

const GroupCreatorWithData = compose(
  graphql(GET_THROUGH_VIEWER, {
    options: (props) => ({  
      variables: { first : FIRST } 
    }),
  }),
  graphql(LoggedInUserQuery, {
    props: ({ data }) => ({
      loggedInUser: data.viewer ? data.viewer.user : null
    })
  }),
  graphql(CREATE_WORKOUT_GROUP, {
    props: ({ mutate }) => ({
      createWorkoutGroup: (input) => mutate({ variables: { input: input } })
    }),
  }),
)(GroupCreator);

export default GroupCreatorWithData;
