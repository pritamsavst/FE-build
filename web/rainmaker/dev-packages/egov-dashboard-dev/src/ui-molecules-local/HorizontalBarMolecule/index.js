import React, { Component } from "react";
import { Doughnut, Polar } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { Scatter } from 'react-chartjs-2';
import Grid from "@material-ui/core/Grid";
import HorizontalBarChart from './HorizontalBarChart';
import Card from '@material-ui/core/Card';
import './index.css'

class HorizontalBarMolecule extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
        AllDataRes : []
    }
  }

  componentDidMount(){
    //
    // const allRes = AllRes.allResponse;
    const allRes = this.props.data;
    this.setState({
        AllDataRes : allRes
    })
    
  }

  componentDidUpdate(){
    //
    // const allRes = AllRes.allResponse;
    const allRes = this.props.data;
    if(JSON.stringify(this.state.AllDataRes) !== JSON.stringify(allRes)){
      this.setState({
        AllDataRes : allRes
      })
    }
  }

  render() {
       
    return (
      <div>
        {/* Doughnut Chart */}
        <div style={{display:"flex"}}> 
          {
            this.state.AllDataRes.length > 0 ?
            this.state.AllDataRes.map((graphData)=>{
              return(
                <Card id="cardSpacing">
                  <HorizontalBarChart graphData={graphData} />
                </Card>
              )
            }): null
          }
        </div>
      </div>
    );
  }
}

export default HorizontalBarMolecule;
