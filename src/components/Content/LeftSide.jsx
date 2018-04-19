import React, { Component } from 'react';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';
import AttributeIndex from './Utils/AttributeIndex.jsx';
import {getCategories,getRelations} from "../js/categories";
import Chart from "./Utils/Chart.jsx";

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

        }
        this.charts =[];

    }

    componentDidMount(){
        console.log(this.props.attributes);
    }
    setAttr = (key)=>{

        if(key){
            this.setState({attr:key,disable:true,charts:[]});
        }
        else
            this.setState({attr:key,disable:false,charts:this.charts});

    };
    componentWillUpdate(){
        //this.setState({charts})
    }
    handleSelect = (e)=>{
        var cr = this.createKeyChart;
        this.setState({charts:[],disable:false},function() {
            setTimeout(function()
            {
                cr(e);
            }, 1000);
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

                console.log((max[0][1][e.target.value]/this.state.cateObj[e.target.value]) * 100);
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
        var arr1 = getCategories(this.props.data,e.target.value);
        var cat = arr1[1];
        //console.log(cat);
        var ch = [];
        cat.forEach((cate,index)=>{
            console.log(cate);
            var data = cate.map(([k, e]) => {
                return e;
            });
            var labels = cate.map(([k, e]) => {
                return k;
            });
            this.setState({cats:labels})
            //console.log(data,labels)

            var char = <Chart key={index}id={index} labels={labels} data={data}/>
            ch.push(char);
        })

        this.charts = ch;
        var relations = this.createRelations(e);
        this.setState({charts:ch,relations:relations,cateObj:arr1[0]})
        console.log(relations);
    };
    createRelations = () =>{
      return getRelations(this.props.data,this.props.keys,this.state.key)
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
                                    <InputLabel htmlFor="Cat Selector">Select a categorie</InputLabel>
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
                                    <FormHelperText>Select a categorie to analize</FormHelperText>
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
                <div className="col-md-8 row">
                    {
                        this.state.charts !== []? this.state.charts: <div></div>
                    }

                </div>

            </div>

        );
    }
}