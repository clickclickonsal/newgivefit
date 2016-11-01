import React, { PropTypes } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

const MainFeed = (props) => (
    <Card key={props.data.id}>
      <CardHeader
        title={props.data.author}
        avatar={props.data.avatar}
      />
      <CardMedia
        style={{width: '100%'}}
        overlay={
                  <CardTitle 
                    title={props.data.title} 
                    /*subtitle={props.data.date}*/
                  />
                }
      >
        <img src={props.data.image} />
      </CardMedia>
      <CardTitle title={props.data.contentSnippet} />
     {/* <CardText>
        <div>Comments</div>
      </CardText>*/}
      <CardActions>
        <FlatButton label="Share" />
      </CardActions>
    </Card>
);

export default MainFeed;