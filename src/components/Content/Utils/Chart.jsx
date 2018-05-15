import React,{Component} from 'react';
import chart from 'chart.js';
//import c3 from 'c3';
import 'chartjs-plugin-zoom';
import 'vega-tooltip';
import {render} from '../../js/util.js'
//const C3Chart = require("c3-react");
export default class Chart extends Component{
    constructor(props){
        super(props);

    }
    componentDidMount(){
        //console.log(this.props.dataset)
        if(this.props.first){
            this.getFGraph()
        }
        else
            this.getSGraph();
    }

    getSGraph(){
        var ctx = document.getElementById(this.props.id).getContext('2d');
        var char = new chart(ctx,{
            type: 'horizontalBar',
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
        var columns = [
            ['x', this.props.data.labels[0]],

        ]
        this.props.data.datasets.forEach((d)=>{
            var t = [d.label]
            t.push(d.data);
            columns.push(t);
        })

        // var cha = c3.generate({
        //     bindto: '#chart',
        //     data: {
        //         x : 'x',
        //         columns: columns,
        //         // groups: [
        //         //     ['download', 'loading']
        //         // ],
        //         type: 'bar'
        //     },
        //     legend: {
        //         show: false
        //     },
        //     tooltip: {
        //         grouped: false // Default true
        //     },
        //     zoom: {
        //         enabled: true,
        //         //rescale: true
        //     },
        //     axis: {
        //         x: {
        //             type: 'category' // this needed to load string x value
        //         }
        //     }
        // });
        var spec = {};
        console.log(this.props.numCat,"###");
        if(this.props.numCat <50 ||((this.props.type === "quantitative"|| this.props.type === "key"))){
            spec = {
                $schema: "https://vega.github.io/schema/vega-lite/v2.json",
                description: "Graph",
                width: 500,
                autosize: {
                    type: "pad"
                },
                data: {
                    values: this.props.dataset
                },
                selection: {
                    grid: {
                        type: "interval", bind: "scales",
                        zoom: "wheel!"
                    }
                },
                mark: "bar",
                encoding: {
                    y:{aggregate: "count", type: "quantitative",
                        axis: {grid: false}},
                    x: {field: this.props.attr, type:  this.props.type !=="key"?this.props.type:"quantitative",axis: {title: this.props.attr},
                        sort: this.props.type !== "quantitative"|| this.props.type !== "key"||this.props.type !== "temporal"?{op:"count",field:this.props.attr,order:"descending"}:false,bin:this.props.type === "quantitative"|| this.props.type === "key"?{maxbins:15}:false},
                    tooltip:[
                        {field: this.props.attr, type: this.props.type},
                        {aggregate: "count", type:"quantitative"}
                        ],
                    color: {field: this.props.attr, type: this.props.type !=="key"?this.props.type:"quantitative", legend:null}
                },
                config:{
                    legend:null
                }
            };
        }
        else{
            spec = {
                $schema: "https://vega.github.io/schema/vega-lite/v2.json",
                data: {
                    values: this.props.dataset
                },
                transform:this.props.type !== "temporal"?[]:[ {
                    aggregate: [{
                        op: "count",
                        as: "sumTemp"
                    }],
                    groupby:[this.props.attr]
                }],

                vconcat: [
                    {
                        width: 500,
                        mark: "bar",
                        selection: {
                            brush: {
                                type: "interval",
                                encodings: ["x","y"],
                                on: "[mousedown, window:mouseup] > window:mousemove!",
                                translate: "[mousedown, window:mouseup] > window:mousemove!",
                                zoom: "wheel!",
                                mark: {fill: "#333", fillOpacity: 0.125, stroke: "white"},
                                resolve: "global"
                            }
                        },
                        encoding: {
                            x: {
                                field: this.props.attr,
                                type:  this.props.type !=="key"?this.props.type:"quantitative",
                                axis: {labels: this.props.type === "temporal"?true:false, title: this.props.attr,format: this.props.type === "temporal"?"%Y":false},
                                sort: this.props.type !== "quantitative" || this.props.type !== "key"|| this.props.type !== "temporal"?{op:"count",field:this.props.attr,order:"descending"}:false,
                                bin:this.props.type === "quantitative"|| this.props.type === "key"?{maxbins:15}:false
                            },
                            y: {
                                aggregate:this.props.type === "temporal"?"sum":"count", field:this.props.type === "temporal"?"sumTemp":null, type: "quantitative",
                                axis: {tickCount: 10, title: "count", grid: false}
                            },
                            color: this.props.type === "temporal"?null: {field: this.props.attr, type:  this.props.type !=="key"?this.props.type:"quantitative", legend: null}
                        },
                        config:{
                            legend:null
                        }
                    },
                {
                    width: 500,
                    mark: "bar",
                    encoding: {
                        x: {
                            field: this.props.attr,
                            type:  this.props.type !=="key"?this.props.type:"quantitative",
                            scale: {domain: {selection: "brush",encoding: "x"}},
                            axis: {title: ""},
                            sort: this.props.type !== "quantitative" || this.props.type !== "key"||this.props.type !== "temporal"?{op:"count",field:this.props.attr,order:"descending"}:false,
                            bin:this.props.type === "quantitative"|| this.props.type === "key"?{maxbins:15}:false
                        },
                        y: {aggregate:this.props.type === "temporal"?"sum":"count", field:this.props.type === "temporal"?"sumTemp":null, type: "quantitative",
                            axis: {title: "count", grid: false},scale: {domain: {selection: "brush",encoding: "y"}},},
                        tooltip:[
                            {field: this.props.attr, type: this.props.type},
                            { aggregate:this.props.type === "temporal"?"sum":"count", field:this.props.type === "temporal"?"sumTemp":null, type:"quantitative"}
                        ],
                        color:  this.props.type === "temporal"?null:{field: this.props.attr, type: this.props.type !=="key"?this.props.type:"quantitative", legend:null},
                    },
                    config:{
                        legend:null
                    }
                }

            ],
                config: {axisY: {"minExtent": 30}}
            };
        }


        render(spec,()=>{
            console.log("Finish rendering");
        })

       /* var ctx = document.getElementById(this.props.id).getContext('2d');
         var char = new chart(ctx,{
         type: 'bar',
         options: {
         responsive: true,
         maintainAspectRatio: false,
         legend: {
         display :false,
         position: 'bottom',
         },
         pan: {
         enabled: true,
         mode: 'xy',
         },
         zoom: {
         enabled: true,
         mode: 'xy',
         },
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

         char.render();*/

    }

    render(){

        return(

            <div>

                <div id="view"></div>
                {/*<div className="chart-container col-md-12">
                    <canvas id={this.props.id }></canvas>
                </div>*/}

            </div>

        )
    }
}