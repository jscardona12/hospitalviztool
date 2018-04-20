import React,{Component} from 'react';
import chart from 'chart.js';

export default class Chart extends Component{
    constructor(props){
        super(props);

    }
    componentDidMount(){
        if(this.props.first){
            this.getFGraph()
        }
        else
            this.getSGraph();
    }

    getSGraph(){
        var ctx = document.getElementById("chart" +this.props.id).getContext('2d');
        var char = new chart(ctx,{
            type: 'bar',
            options: {
                responsive: true,

                title: {
                    display: true,
                    text: this.props.attr,
                }
            },
            data: this.props.data
        });
    }

    getFGraph(){
        var data = {
            labels: this.props.labels,
            datasets: [{
                label: this.props.attr,
                backgroundColor: "rgba(255,99,132,0.2)",
                borderColor: "rgba(255,99,132,1)",
                borderWidth: 2,
                hoverBackgroundColor: "rgba(255,99,132,0.4)",
                hoverBorderColor: "rgba(255,99,132,1)",
                data: this.props.data,
            }]
        };

        var options = {
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    stacked: true,
                    gridLines: {
                        display: true,
                        color: "rgba(255,99,132,0.2)"
                    }
                }],
                xAxes: [{
                    gridLines: {
                        display: false
                    }
                }]
            }
        };

        var ctx = document.getElementById("chart" +this.props.id).getContext('2d');
        var char = new chart(ctx,{
            type: 'bar',
            options: options,
            data: data
        });

    }

    render(){
        return(
            <div className="chart-container col-md-12">
                <canvas id={"chart"+this.props.id }></canvas>
            </div>

        )
    }
}