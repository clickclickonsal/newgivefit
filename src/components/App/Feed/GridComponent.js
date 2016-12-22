import React, { PropTypes, Component } from 'react';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import GridList from 'material-ui/GridList'
import {GoogleMapLoader, GoogleMap, Marker} from 'react-google-maps';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

import MainFeed from './subComponents/MainFeed';
import {searchNearby} from 'utils/googleApiHelpers';

const height = window.innerHeight - 64;

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 500,
    height: height,
    overflowY : 'auto',
    background : '#e5e5e5'
  },
  workout : {
    padding : '20px 12px 10px',
    boxSizing : 'border-box'
  }
};

class GridComponent extends Component {
    constructor(props){
      super(props);
      // grab our googleMaps obj from whever she may lay
      var googleMaps = this.props.googleMaps ||
        (window.google && // eslint-disable-line no-extra-parens
          window.google.maps) ||
        this.googleMaps;

      if (!googleMaps) {
        console.error(// eslint-disable-line no-console
          'Google map api was not found in the page.');
        return;
      }
      this.state = {
        activeIndex : -1,
        parks: [],
        gyms: [],
        pagination: null
      };
      // now grab the services we need
      this.googleMaps = googleMaps;
      this.geocoder = new googleMaps.Geocoder();
      /*this.placesService = new googleMaps.PlacesService(map);*/
      this.clickMarker = null;
      this.infowindow = new googleMaps.InfoWindow;
    }
    /*Working on Google API for location fetching
    Cannot get the _googleMapComponent.props
    possible reference material:
    https://dna.hioscar.com/2016/01/25/google-maps-a-call-to-reaction/
    This google apis return the places in sets of 20, the maximum number of places that an api can fetch is 60. If you carefully observe the response of the google places api, it has a parameter called next_pagetoken. So the second time you hit the API u need to pass this next_pagetoken to fetch the next set of schools.@ChithriAjay
    how to do multiple types
    http://stackoverflow.com/questions/19625228/google-maps-api-multiple-keywords-in-place-searches*/
    componentDidMount(obj){
    const div = document.createElement('div')
    console.log("isMounted method", div)
    /*const {googleMaps} = this.props;*/
    const parks = {
      location: { lat: 39.2904, lng: -76.6122 },
      radius: 5000,
      type: 'park'
    }

    const gyms = {
      location: { lat: 39.2904, lng: -76.6122 },
      radius: 5000,
      type: 'gym'
    }
    //search and add parks to state
    searchNearby(this.googleMaps, div, parks)
      .then((results, pagination) => {
        console.log('searchNearby results', results)
        console.log('searchNearby pagination', pagination)
        this.setState({
          parks: results,
          pagination
        })
      }).catch((status, result) => {
        console.error('error', status, result)
      })
    //search and add gyms to state  
    searchNearby(this.googleMaps, div, gyms)
      .then((results, pagination) => {
        console.log('searchNearby results', results)
        console.log('searchNearby pagination', pagination)
        this.setState({
          gyms: results,
          pagination
        })
      }).catch((status, result) => {
        console.error('error', status, result)
      })
    }

    /*gets us our map on click location, 
    may pass for location queries in the future*/
    geocodeLatLng(obj) {
    const {map} = this._googleMapComponent.props;
    //var input = "40,-90";
    //var latlngStr = input.split(',', 2);
    console.log("this is the geocoded object", obj.latLng)
    var latlng = {lat: obj.latLng.lat(), lng: obj.latLng.lng()};
    console.log("this is latlng", latlng)
    this.geocoder.geocode({'location': obj.latLng}, (results, status)=>{
      if (status === 'OK') {
        if (results[1]) {
          //map.setZoom(9);
          //map.setCenter(latlng);
          /*var marker = new google.maps.Marker({
            position: latlng,
            icon : 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
            map: map
          });
          if(this.clickMarker){
              this.clickMarker.setMap(null);
          }
          this.clickMarker = marker;*/
          /*this.infowindow.setContent(results[1].formatted_address);*/
          this.props.onPlaceSelect({
              coordinates : latlng,
              address : results[1].formatted_address
          });
          /*this.infowindow.open(map, marker);*/
        } else {
          //window.alert('No results found');
        }
        } else {
        //window.alert('Geocoder failed due to: ' + status);
        }
      });
    }
    markerClick(index){
      this.setState({activeIndex : index});
    }
    render(){
      const {props} = this;
      const {activeIndex, parks, gyms} = this.state;
      const {workouts} = props;

      console.log("props markers", props.markers);

      const placeById = {}
      parks.forEach(s => {
        /*const place_id = s.place_id*/
        console.log('each spot', s)
        /*const workout = workouts.find(w => w.placeId == place_id)*/
        placeById[s.place_id] = {
          /*comments: workout.comments,*/
          googleData: {
            'name': s.name,
            'rating': s.rating,
            'photos': s.photos,
            'position' : {
                lat : s.geometry.location.lat(),
                lng : s.geometry.location.lng()
            }
          }
        }
        console.log("first parks", placeById)
      })
       gyms.forEach(s => {
        /*const place_id = s.place_id*/
        console.log('each spot', s)
        /*const workout = workouts.find(w => w.placeId == place_id)*/
        placeById[s.place_id] = {
          /*comments: workout.comments,*/
          googleData: {
            'name': s.name,
            'rating': s.rating,
            'photos': s.photos,
            'position' : {
                lat : s.geometry.location.lat(),
                lng : s.geometry.location.lng()
            }
          }
        }
        console.log("then gyms", placeById)
      })

      //list with google data
      /*const gListView = spots.length ? <div
          style={styles.gridList} 
          >
          {Object.keys(placeById).map((id, index) => (
            console.log('gListView id', id)
            console.log('gListView index', index)
            const item = placeById[id]
               <div key={index} style={styles.workout}> {!item ||
                (<MainFeed
                  active={activeIndex===index}
                  data={item.node}
               />)} </div>
          ))}
      </div> : <Card>
              <CardHeader
                title="No Workouts In this location"
                subtitle="Please try a different location"
                actAsExpander={true}
                showExpandableButton={true}
              />
              <CardText expandable={true}>
                We are working to get workouts here
              </CardText>
      </Card>*/
      //google maps list view
      /*console.log('gListView', gridList)*/
      
      const listView = workouts.length ? <div
          style={styles.gridList}
        >
          {props.workouts.map((item, index) => (
               <div key={index} style={styles.workout}> {!item ||
                (<MainFeed
                  active={activeIndex===index}
                  data={item.node}
               />)} </div>
          ))}
      </div>  :  <Card>
              <CardHeader
                title="No Workouts In this location"
                subtitle="Please try a different location"
                actAsExpander={true}
                showExpandableButton={true}
              />
              <CardText expandable={true}>
                We are working to get workouts here
              </CardText>
            </Card>

      return (
            <div style={styles.root}>
            <section style={{height: "100%",flex:1}}>
               <GoogleMapLoader
                 containerElement={
                   <div
                     {...props.containerElementProps}
                     style={{
                       height: height,
                     }}
                   />
                 }
                 googleMapElement={
                   <GoogleMap
                    ref={(map) => { this._googleMapComponent = map ; console.log("the map", map);} }
                    defaultZoom={8}
                    defaultCenter={{ lat: 39.2904, lng: -76.6122 }}
                    onClick={(...args)=>{
                      console.log("map args", ...args);
                      return this.geocodeLatLng(...args)
                     }}
                   >
                   {console.log("props for markers", props.markers)}
                     {props.markers ? props.markers.map((marker, index) => {
                       return (
                         <Marker
                          key={index}
                           {...marker}
                           onClick={()=>this.markerClick(index)}
                           onRightclick={() => console.log(marker,index)} />
                       );
                     }) : null}
                   </GoogleMap>
                 }
               />
             </section>
             {listView}
            </div>

        );
    }
}

export default GridComponent;