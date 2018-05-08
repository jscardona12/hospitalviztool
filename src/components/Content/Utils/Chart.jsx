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
        var ctx = document.getElementById(this.props.id).getContext('2d');
        var char = new chart(ctx,{
            type: 'bar',
            options: {
                responsive: true,
                scales: {
                    yAxes: [{
                        // stacked: true,
                        ticks: {
                            beginAtZero: true,
                            // max: 100,
                            // min: 0
                        }
                    }],
                },
                title: {
                    display: true,
                    text: this.props.attr,
                }
            },
            data: this.props.data
        });
        char.render();
    }

    getFGraph(){
        var ctx = document.getElementById(this.props.id).getContext('2d');
        var char = new chart(ctx,{
            type: 'bar',
            options: {
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                       // stacked: true,
                        ticks: {
                            beginAtZero: true,
                            // max: 100,
                            // min: 0
                        }
                    }],
                    xAxes: [{
                        gridLines: {
                            display: false
                        }
                    }]
                }
            },
            data: this.props.data
        });

        char.render();

    }

    render(){
        return(
            <div className="chart-container col-md-12">
                <canvas id={this.props.id }></canvas>
            </div>

        )
    }
}