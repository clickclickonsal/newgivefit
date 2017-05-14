import React from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'

import { GET_THROUGH_VIEWER } from './gql'

import GridContainer from './GridContainer'

import './styles.css'

class Explore extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.centerLatLng = null

    const { query } = this.props.location

    this.centerLatLng = {
      lat: query.lat ? parseFloat(query.lat) : 39.2904,
      lng: query.lng ? parseFloat(query.lng) : -76.6122,
    }
  }

  render () {
    const { profile, data } = this.props
    const { loading, viewer } = data
    let workoutGroups = []
    let workouts = []

    if (!loading) {
      workouts = viewer.allWorkouts.edges || []
      workoutGroups = viewer.allWorkoutGroups.edges || []
    }

    return (
      <div>
        <GridContainer
          centerLatLng={this.centerLatLng}
          onPlaceSelect={(place) => {
            data.refetch({
              latLng: place.address,
            })

            return null
          }}
          profile={profile}
          workoutGroups={workoutGroups}
          workouts={workouts}
        />
      </div>
    )
  }
}

Explore.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
}

const ExploreWithData = compose(
  graphql(GET_THROUGH_VIEWER, {
    options: (props) => ({
      variables: { first: 8 },
    }),
  })
)(Explore)

export default ExploreWithData
