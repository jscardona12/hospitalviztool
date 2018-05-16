import React, { Component } from 'react';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';
import AttributeIndex from './Utils/AttributeIndex.jsx';
import {getCategories,getRelations,binTemp,binQuant,getRelationsTemp} from "../js/categories";
import Chart from "./Utils/Chart.jsx";
import chart from "chart.js";
import { Spin } from 'antd';
import Pagination from './Utils/Pagination.jsx';
import Filter from './Utils/Filter.jsx';
import moment from 'moment';


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
            pageOfItems: [],
            filter: "No",
            compare:false,
            compCat:"",

        }
        this.charts = [];
        console.log("hola");
    }

    componentDidMount(){
        // console.log(this.props.data);
        // console.log(this.props.keys);
    }
    setAttr = (key)=>{

        var self = this;
        if(key){
            var cr = this.createRelationGraphs;
            this.setState({attr:key,compCat:"",disable:true,charts:[]},function(){
                setTimeout(function()
                {
                    cr(key);
                }, 2000);
            });

        }
        else
            this.setState({attr:key,compCat:"",disable:false,charts:[]},function(){
                setTimeout(function()
                {
                    console.log("deselect");
                    self.setState({charts:self.state.chartsF});
                }, 2000);
            });

    };
    setFilter = (key)=>{

        var self = this;
        if(this.state.key === "")
            this.setState({filter:key});
        else{
            if(key){
                var cr = this.createKeyChart;
                this.setState({charts:[],loading:true,filter:key,pageOfItems:[]},function(){
                    setTimeout(function()
                    {
                        cr(self.state.key);
                    }, 2000);
                });
            }
        }

    };
    componentWillUpdate(){
        //this.setState({charts})
    }
    handleSelect = (e)=>{


        var cr = this.createKeyChart;
        var self = this;
        this.setState({charts:[],compCat:"",disable:false,loading:true,keys:null,cats:null,key:e.target.value,pageOfItems:[]},function() {
            setTimeout(function()
            {
                cr(e.target.value);
            }, 2000);
        });

    };
    handleSelectCatComp = e => {
        var self = this;
            var cr = this.createRelationGraphs;
            this.setState({charts:[],compCat : e.target.value},function(){
                setTimeout(function()
                {
                    cr(self.state.attr);
                }, 2000);
            });

    };
    setFilter = (key)=>{
    };
    handleSelectCat = (e)=>{
        this.setState({keyCat:e.target.value});
        this.setAttr(null);
        var keys = this.props.keys.map(k =>{
            if(k !== this.state.key) {

                var max = Object.entries(this.state.relations[k]);
                max = max.filter((a)=>{return a[1][e.target.value]}).sort(function (a, b) {
                    return b[1][e.target.value]- a[1][e.target.value]
                });

               // console.log((max[0][1][e.target.value]/this.state.cateObj[e.target.value]) * 100);
                var key = {
                    name: k,
                    perc: (max[0][1][e.target.value]/this.state.cateObj[e.target.value]) * 100,
                }
                key.perc =  parseFloat(key.perc.toFixed(2));
                console.log(key);
                return key;
            }

        });
        keys.sort(function(a, b){return b.perc-a.perc});
        keys.pop();
        console.log(keys);
        this.setState({keys:keys});

    };

    onChangePage = (pageOfItems)=> {
        // update state with new page of items
        this.setState({ pageOfItems: pageOfItems });
    };


    createKeyChart = (e)=>{
        //console.log(e.target.value);
        //this.setState({key:e.target.value});
        //console.log(this.state.key);
        var arr1 = []
        var data1 = this.props.data;
        if(this.state.filter === "No")
            data1 =data1;
        else if(this.state.filter === "<18")
            data1 = data1.filter((a)=>{return a["EDAD_PACIENTE"] <18});
        else
            data1 = data1.filter((a)=>{return a["EDAD_PACIENTE"] >=18});
        console.log(data1);
        arr1 = getCategories(data1,e,this.props.attributes);
        var cat = arr1[1];

        /*if(this.state.filter === "No")
            cat = arr1[1];
        else if(this.state.filter === "<18")
            cat = arr1[3];
        else
            cat = arr1[5];*/
        this.setState({catArr:cat});
        //console.log(cat);
        var ch = [];
        //console.log(arr1);
        var l = Object.entries(arr1[0]).map(([k, e]) => {
            return k;
        });
        cat.forEach((cate,index)=>{
            //console.log(cate);
            var data = cate.map(([k, e]) => {
                return e;
            });
            var data = {
                labels: [this.state.key],
                datasets: []
            };
            //console.log(data,labels)

                cate.map(([k, e]) => {
                    var label = k ;

                    this.addDataset(data,label,[e])
                });

            var char = <Chart numCat = {l.length}type={this.props.attributes[e]["type"]}dataset={data1} key={index}id={'f' + this.state.key+ index}  attr={e} first={true} data={data}/>
            ch.push(char);
        });

        this.charts = ch;



        var relations = this.createRelations(data1);

        this.setState({charts:ch,relations:relations,cateObj:arr1[0],cats:l,chartsF:ch,loading:false})
        console.log(relations);
    };
    createRelations = (data) =>{
      return getRelations(data,this.props.keys,this.state.key);
    };

    createRelationGraphs = (key)=>{
        var cr = this.genRGraphs;
        this.setState({charts:[],loading:true},function() {
            setTimeout(function()
            {
               cr(key);
            }, 1000);
        });

    };
    genRGraphs = (key)=>{
        var ch =[];
        var self = this;
        var h = 0;
        var data1 = this.props.data;
        if(this.state.filter === "No")
            data1 =data1;
        else if(this.state.filter === "<18")
            data1 = data1.filter((a)=>{return a["EDAD_PACIENTE"] <18});
        else
            data1 = data1.filter((a)=>{return a["EDAD_PACIENTE"] >=18});
        // this.state.catArr.forEach((cate,index)=> {
        //     h++;
            // var labels = cate.map(([k, e]) => {
            //     return k;
            // });

            var cat = Object.entries(self.state.relations[key]);
            console.log(cat);
/*
            if(this.props.attributes[key].type !=="temporal" && this.props.attributes[key].type !=="quantitative" &&
            key !== "EDAD_PACIENTE") {
                cat = cat.sort(function (a, b) {
                    if (b[1][self.state.keyCat] && a[1][self.state.keyCat])
                        return b[1][self.state.keyCat] - a[1][self.state.keyCat];
                    else if (!b[1][self.state.keyCat] && a[1][self.state.keyCat])
                        return 0 - a[1][self.state.keyCat];
                    else if (b[1][self.state.keyCat] && !a[1][self.state.keyCat])
                        return b[1][self.state.keyCat] - 0;
                    else
                        return b;

                });
            }
            else if(this.props.attributes[key].type ==="temporal" ){
                cat = cat.sort(function(a,b){
                    return moment(a[0], 'MM-DD-YYYY').diff(moment(b[0], 'MM-DD-YYYY'));
                });
            }
*/


            // cat.filter((a)=>{return a[1][self.state.keyCat]}).sort(function (a, b) {
            //     return b[1][self.state.keyCat]- a[1][self.state.keyCat];
            //
            // });
          /*  var ret = [cat];
            if (cat.length > 6) {
                ret = [];
                var temp = [];
                var count = 0;
                var fin = cat[cat.length -1]
                cat.map(d => {
                    if (count === 6) {
                        ret.push(temp);
                        temp = [];
                        temp.push(d);
                        count = 1;
                    }
                    else if(d === fin){
                        temp.push(d);
                        ret.push(temp);
                    }
                    else {
                        count++;
                        temp.push(d);
                    }
                })
            }
*/
           /* ret.forEach((r, index) => {
                var i = index;
                var data = {
                    labels: [self.state.keyCat],
                    datasets: []
                };
               // console.log(r);
                r.forEach((k,e,index) => {
                    var obj = [self.state.relations[key][k[0]]]
                    //console.log(obj,"obj");
                    var values = [];
                        //console.log(l,'l');
                    if(obj[0][self.state.keyCat]){
                        values.push(obj[0][self.state.keyCat]);
                    }
                    else
                        values.push(0);

                    //console.log(values);
                        this.addDataset(data, k[0], values);

                    });
                //console.log(data);
                var char = <Chart dataset={self.props.data} key={h + '' + i}id={'s' + h+ '' + i} labels={self.state.cats} attr={self.state.key} first={false} data={data}/>
                ch.push(char);
                });*/
           var order = "descending";
           if(self.state.keyCat < self.state.compCat)
               order = "ascending"
            var char = <Chart dataset={data1} key={h + '' }id={'s' + h+ '' } labels={self.state.cats} order={order} numCat={cat.length} attr={self.state.key} type={self.props.attributes[self.state.key].type} compAttr={key} typeAttr={self.props.attributes[key].type} compCat = {self.state.compCat} catKey={self.state.keyCat} first={false}/>
            this.setState({charts: [char], loading:false});
        // });
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

    handleClick = ()=>{

        this.setState({compare:!this.state.compare,compCat:""});
    };
    render(){
        console.log(this.state);
        return (
            <div className="col-md-12 row">
                <div className="col-md-5">
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
                    <div>
                        <Filter setFilter = {this.setFilter}/>
                    </div>
                    {this.state.key !=="" && this.state.keyCat !=="" && this.state.keys?
                        <div className="fix">
                            <h6>Select an attribute to compare</h6>
                            {
                                this.state.keys.map((key, index) => {
                                        if (key !== this.state.key) {
                                           return(
                                               <div className="row" key={index} style={{borderColor:'red'}}>
                                                   <AttributeIndex  key={index} disable={this.state.disable} attr={key.name}
                                                                   setAttr={this.setAttr}/>
                                                   <div  className="col-md-5 progress">
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
                <div  className="col-md-7">
                    {/*CAT FORM CONTROL*/}
                    {
                        this.state.cats?
                            <div className="row">
                                <FormControl className="move col-md-4" >
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
                                {this.state.key !=="" && this.state.keyCat !=="" && this.state.keys?
                                    this.state.compare?<button  type="button" className="move btn btn-primary btn-xs col-md-2" onClick={this.handleClick }>VS</button>:
                                        <button  type="button" className="move btn btn-primary btn-xs col-md-2" onClick={this.handleClick }>Compare?</button>:
                                    <div></div>}
                                {this.state.key !=="" && this.state.keyCat !=="" && this.state.keys && this.state.attr?
                                    this.state.compare?
                                        <FormControl className="move col-md-4" >
                                            <InputLabel htmlFor="CatComp Selector">Select a category</InputLabel>
                                            <Select
                                                value={this.state.compCat}
                                                onChange={this.handleSelectCatComp}
                                            >

                                                {
                                                    this.state.cats.map((key,index)=> {
                                                        return <MenuItem key = {index}value={key}>{key}</MenuItem>

                                                    })

                                                }
                                            </Select>
                                            <FormHelperText>Select a category to compare</FormHelperText>
                                        </FormControl>: <div></div>: <div></div>}

                            </div>: <div></div>
                    }
                    {
                        this.state.loading?
                            <div className="center">
                                <Spin size="large" tip="Analizing data..."/>
                            </div>:
                            <div className="col-md-7">
                                <div className="col-md-12">
                                    <Pagination items = {this.state.charts} initialPage={1} onChangePage={this.onChangePage}/>
                                </div>
                                <div className="col-md-12 row ">
                                    {
                                        this.state.pageOfItems !== []? this.state.pageOfItems: <div> <h3>No Hay Datos</h3></div>
                                    }

                                </div>
                            </div>

                    }
                </div>


            </div>

        );
    }
}