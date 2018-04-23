import React, { Component } from 'react';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';
import AttributeIndex from './Utils/AttributeIndex.jsx';
import {getCategories,getRelations,binTemp,binQuant} from "../js/categories";
import Chart from "./Utils/Chart.jsx";
import chart from "chart.js";
import { Spin } from 'antd';


const chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};


const COLORS = [
        '#4dc9f6',
        '#f67019',
        '#f53794',
        '#537bc4',
        '#acc236',
        '#166a8f',
        '#00a950',
        '#58595b',
        '#8549ba'
        ];

export default class LeftSide extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: "",
            keyCat: "",
            keys:null,
            cateObj:null,
            cats:null,
            attr:null,
            disable:false,
            charts:[],
            relations:null,
            catArr:null,
            chartsF : [],
            loading: false,

        }
        this.charts = [];

    }

    componentDidMount(){

        console.log(this.props.attributes);
    }
    setAttr = (key)=>{

        var self = this;
        if(key){
            var cr = this.createRelationGraphs;
            this.setState({attr:key,disable:true,charts:[]},function(){
                setTimeout(function()
                {
                    cr(key);
                }, 1000);
            });

        }
        else
            this.setState({attr:key,disable:false,charts:[]},function(){
                setTimeout(function()
                {
                    console.log("deselect");
                    self.setState({charts:self.state.chartsF});
                }, 1000);
            });

    };
    componentWillUpdate(){
        //this.setState({charts})
    }
    handleSelect = (e)=>{


        var cr = this.createKeyChart;
        var self = this;
        this.setState({charts:[],disable:false,loading:true,keys:null,cats:null},function() {
            setTimeout(function()
            {
                cr(e);
            }, 2000);
        });

    };
    handleSelectCat = (e)=>{
        this.setState({keyCat:e.target.value});

        var keys = this.props.keys.map(k =>{
            if(k !== this.state.key) {

                var max = Object.entries(this.state.relations[k]);
                max = max.filter((a)=>{return a[1][e.target.value]}).sort(function (a, b) {
                    return b[1][e.target.value]- a[1][e.target.value]
                });

                //console.log((max[0][1][e.target.value]/this.state.cateObj[e.target.value]) * 100);
                var key = {
                    name: k,
                    perc: (max[0][1][e.target.value]/this.state.cateObj[e.target.value]) * 100,
                }
                return key;
            }

        });
        keys.sort(function(a, b){return b.perc-a.perc});
        keys.pop();
        console.log(keys);
        this.setState({keys:keys});

    };

    createKeyChart = (e)=>{
        console.log(e.target.value);
        this.setState({key:e.target.value});
        //console.log(this.state.key);
        var arr1 = []
        if(this.props.attributes[e.target.value].type == 'temporal'){
            arr1 = binTemp(this.props.data, e.target.value);
        }
        else
            arr1 = getCategories(this.props.data,e.target.value);
        var cat = arr1[1];
        this.setState({catArr:cat});
        //console.log(cat);
        var ch = [];
        console.log(arr1);
        cat.forEach((cate,index)=>{
            console.log(cate);
            var data = cate.map(([k, e]) => {
                return e;
            });
            var labels = cate.map(([k, e]) => {
                return k;
            });
            //console.log(data,labels)

            var char = <Chart key={index}id={'f' + index} labels={labels} attr={e.target.value} first={true} data={data}/>
            ch.push(char);
        })

        this.charts = ch;
        var relations = this.createRelations(e);
        var l = Object.entries(arr1[0]).map(([k, e]) => {
            return k;
        });
        this.setState({charts:ch,relations:relations,cateObj:arr1[0],cats:l,chartsF:ch,loading:false})
        console.log(relations);
    };
    createRelations = () =>{
      return getRelations(this.props.data,this.props.keys,this.state.key)
    };

    createRelationGraphs = (key)=>{
        var cr = this.genRGraphs;
        this.setState({charts:[]},function() {
            setTimeout(function()
            {
               cr(key);
            }, 1000);
        });

    };
    genRGraphs = (key)=>{
        var ch =[];
        var self = this;
        this.state.catArr.forEach((cate,index)=> {
            var labels = cate.map(([k, e]) => {
                return k;
            });

            var cat = Object.entries(self.state.relations[key]);
            cat = cat.sort(function (a, b) {
                if(b[1][self.state.keyCat] && a[1][self.state.keyCat])
                    return b[1][self.state.keyCat]- a[1][self.state.keyCat];
                else if(!b[1][self.state.keyCat] && a[1][self.state.keyCat])
                    return 0 - a[1][self.state.keyCat];
                else if(b[1][self.state.keyCat] && !a[1][self.state.keyCat])
                    return b[1][self.state.keyCat]- 0;
                else
                    return b;

            });
            // cat.filter((a)=>{return a[1][self.state.keyCat]}).sort(function (a, b) {
            //     return b[1][self.state.keyCat]- a[1][self.state.keyCat];
            //
            // });
            var ret = [cat];
            if (cat.length > 10) {
                ret = [];
                var temp = [];
                var count = 0;
                cat.map(d => {
                    if (count == 10) {
                        ret.push(temp);
                        temp = [];
                        temp.push(d);
                        count = 1;
                    }
                    else {
                        count++;
                        temp.push(d);
                    }
                })
            }
            //REVISAR BIEN NO ESTA FUNCIONANDO
            //console.log(ret,"ret");

            //console.log(ret,'ret');
            ret.forEach((r, index) => {
                var data = {
                    labels: labels,
                    datasets: []
                };
               // console.log(r);
                r.forEach((k,e,index) => {
                    var obj = [self.state.relations[key][k[0]]]
                    //console.log(obj,"obj");
                    var values = [];
                    labels.forEach((l)=>{
                        //console.log(l,'l');
                        if(obj[0][l]){
                            values.push(obj[0][l]);
                        }
                        else
                            values.push(0);
                    });
                    //console.log(values);
                        this.addDataset(data, k[0], values);

                    });
                var char = <Chart key={index}id={'s' + index} labels={self.state.cats} attr={self.state.key} first={false} data={data}/>
                ch.push(char);
                });

            this.setState({charts: ch});
        });
    };
    addDataset = (data,attr,values)=>{
        var color = chart.helpers.color;
        var colorNames = Object.keys(chartColors);
        var colorName = colorNames[data.datasets.length % colorNames.length];
        var dsColor = chartColors[colorName];
        var newDataset = {
            label: attr,
            backgroundColor: color(dsColor).alpha(0.2).rgbString(),
            borderColor: dsColor,
            borderWidth: 1,
            hoverBackgroundColor: color(dsColor).alpha(0.4).rgbString(),
            hoverBorderColor: color(dsColor).alpha(1).rgbString(),
            data: []
        };

       newDataset.data = values;
        data.datasets.push(newDataset);
    };

    render(){
        console.log(this.state);
        return (
            <div className="col-md-12 row">
                <div className="col-md-4">
                      {/*  KEY FORM CONTROL*/}
                        <div>
                            <FormControl >
                                <InputLabel htmlFor="Id Selector">Select an Id</InputLabel>
                                <Select
                                    value={this.state.key}
                                    onChange={this.handleSelect}
                                >

                                    {
                                        this.props.keys.map((key,index)=> {
                                            return <MenuItem key = {index}value={key}>{key}</MenuItem>

                                        })

                                    }
                                </Select>
                                <FormHelperText>Select an attribute to analize</FormHelperText>
                            </FormControl>
                        </div>
                    {/*CAT FORM CONTROL*/}
                    {
                        this.state.cats?
                            <div>
                                <FormControl >
                                    <InputLabel htmlFor="Cat Selector">Select a category</InputLabel>
                                    <Select
                                        value={this.state.keyCat}
                                        onChange={this.handleSelectCat}
                                    >

                                        {
                                            this.state.cats.map((key,index)=> {
                                                return <MenuItem key = {index}value={key}>{key}</MenuItem>

                                            })

                                        }
                                    </Select>
                                    <FormHelperText>Select a category to analize</FormHelperText>
                                </FormControl>
                            </div>: <div></div>
                    }


                    {this.state.key !=="" && this.state.keyCat !=="" && this.state.keys?
                        <div className="fix">
                            <h6>Select an attribute to compare</h6>
                            {
                                this.state.keys.map((key, index) => {
                                        if (key !== this.state.key) {
                                           return(
                                               <div key={index} style={{borderColor:'red'}}>
                                                   <AttributeIndex key={index} disable={this.state.disable} attr={key.name}
                                                                   setAttr={this.setAttr}/>
                                                   <div  className="progress">
                                                       <div className="progress-bar" role="progressbar" style={{width:key.perc +'%'}}>
                                                           {key.perc}%
                                                       </div>
                                                    </div>
                                               </div>)

                                        }
                                    }
                                )
                            }
                        </div>: <div></div>
                    }

                </div>
                {/*RigthSide*/}
                {
                    this.state.loading?
                        <div className="center">
                            <Spin size="large" tip="Analizing data..."/>
                        </div>:  <div className="col-md-8 row">
                            {
                                this.state.charts !== []? this.state.charts: <div></div>
                            }

                        </div>
                }

            </div>

        );
    }
}