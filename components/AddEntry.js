import React, { Component } from 'react'
import { View,Text,TouchableOpacity } from 'react-native'
import {
  getMetricMetaInfo,
  timeToString,
  getDailyReminderValue
} from '../utils/helpers'
import UdaciSliders from './Udacislider'
import UdaciSteppers from './Udacistepper'
import DateHeader from './Dateheader'
import { Ionicons } from '@expo/vector-icons'
import TextButton from './TextButton'
import { submitEntry, removeEntry } from '../utils/api'
import { connect } from 'react-redux'
import { addEntry } from '../actions'

function Submitbtn({onPress}){
	return(
		<TouchableOpacity onPress={onPress}>
		<Text>Submit</Text>
		</TouchableOpacity>
	)
}

class AddEntry extends Component {

    state={
        run:10,
        bike:20,
        swim:0,
        sleep:0,
        eat:0,
    }
    increament=( metric )=> {
        const { max,step } = getMetricMetaInfo(metric)

        this.setState((state)=>{
            const count = state[metric] + step;

            return{
                ...state,
                [metric]: count > max ? max : count
            }
        })
    }
    decreament=( metric )=> {

        this.props.dispatch(addEntry({
          [key]: entry
        }))

        this.setState((state)=>{
            const count = state[metric] - getMetricMetaInfo(metric).step;

            return{
                ...state,
                [metric]: count < 0 ? 0 : count
            }
        })
    }
    slider=(metric,value)=>{
        this.setState(()=>({
            [metric]: value
        }))
    }
    submit=()=>{
    	const key = timeToString()
    	const entry= this.state
    	this.setState(() => ({ run: 0, bike: 0, swim: 0, sleep: 0, eat: 0 }))
    	//Navigate to home

        submitEntry({ key, entry })


    	//clean local noti
    }

      reset = () => {
        const key = timeToString()

        this.props.dispatch(addEntry({
          [key]: getDailyReminderValue()
        }))

        // Route to Home

        // Update "DB"
        removeEntry(key)
      }
    
    render(){
        const metainfo = getMetricMetaInfo();

        if (this.props.alreadyLogged) {
          return (
            <View>
              <Ionicons
                name={'ios-happy-outline'}
                size={100}
              />
              <Text>You already logged your information for today.</Text>
              <TextButton onPress={this.reset}>
                Reset
              </TextButton>
            </View>
          )
        }


        return(
            <View>
                <DateHeader date={(new Date()).toLocaleDateString()}/>
                <Text>{JSON.stringify(this.state)}</Text>
                {
                    Object.keys(metainfo).map((key)=>{
                        const {getIcon, type , ...rest}=metainfo[key];
                        const value = this.state[key];
                        return (
                            <View key={key}>

                            {getIcon()}
				              {type === 'slider'
				                ? <UdaciSliders
				                    value={value}
				                    onChange={(value) => this.slider(key, value)}
				                    {...rest}
				                  />
				                : <UdaciSteppers
				                    value={value}
				                    onIncrement={() => this.increament(key)}
				                    onDecrement={() => this.decreament(key)}
				                    {...rest}
				                  />}
				            </View>

                        )
                    })
                }
                <Submitbtn onPress={this.submit} />
            </View>
            )
    }
}
function mapStateToProps (state) {
  const key = timeToString()

  return {
    alreadyLogged: state[key] && typeof state[key].today === 'undefined'
  }
}

export default connect(
  mapStateToProps
)(AddEntry)