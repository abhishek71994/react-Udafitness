import React, { Component } from 'react'
import { View } from 'react-native'
import {getMetricMetaInfo} from '../utils/helpers'
import UdaciSliders from './Udacislider'
import UdaciSteppers from './Udacistepper'
import DateHeader from './Dateheader'


export default class AddEntry extends Component {

    state={
        run:0,
        bike:0,
        swim:0,
        sleep:0,
        eat:0,
    }
    increament( metric ) {
        const { max,step } = getMetricMetaInfo(metric)

        this.setState((state)=>{
            const count = state[metric] + step;

            return{
                ...state,
                [metric]: count > max ? max : count
            }
        })
    }
    decreament( metric ) {

        this.setState((state)=>{
            const count = state[metric] - getMetricMetaInfo(metric).step;

            return{
                ...state,
                [metric]: count < 0 ? 0 : count
            }
        })
    }
    slider(metric,value){
        this.setStep(()=>({
            [metric]: value
        }))
    }
    render(){
        const metainfo = getMetricMetaInfo();
        return(
            <View>
                <DateHeader date={(new Date()).toLocaleDateString()}/>
                {
                    Object.keys(metainfo).map((key)=>{
                        const {getIcon, type , ...rest}=metainfo[key];
                        const value = this.state[key];
                        return (
                            <View key={key}>
                            	{getIcon()}
                                { type == 'slider' ? <UdaciSliders
                                    value={value}
                                    onChange={(value) => this.slider(key, value)}
                                    {...rest}
                                /> : <UdaciSteppers
                                        value={value}
                                        onIncreament={() => this.increament(key)}
                                        onDecreament={() => this.decreament(key)}
                                        {...rest}
                                    />}
                            </View>

                        )
                    })
                }

            </View>
            )
    }
}