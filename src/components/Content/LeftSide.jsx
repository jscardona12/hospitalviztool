import React, { Component } from 'react';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';
import AttributeIndex from './Utils/AttributeIndex.jsx';
import {getCategories} from "../js/categories";
import Chart from "./Utils/Chart.jsx";

export default class LeftSide extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: "",
            keys: [],
            attr:null,
            disable:false,
            charts:[],

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

    createKeyChart = (e)=>{
        console.log(e.target.value);
        this.setState({key:e.target.value})
        //console.log(this.state.key);
        var cat = getCategories(this.props.data,e.target.value);
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
            //console.log(data,labels)

            var char = <Chart id={index} labels={labels} data={data}/>
            ch.push(char);
        })
        this.setState({charts:ch});
        this.charts = ch;
    }

    render(){
        console.log(this.state);
        return (
            <div className="col-md-12 row">
                <div className="col-md-4">
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

                    {this.state.key !==""?
                        <div className="fix">
                            <h6>Select an attribute to compare</h6>
                            {
                                this.props.keys.map((key, index) => {
                                    if (key !== this.state.key)
                                        return <AttributeIndex key={index} disable={this.state.disable} attr={key} setAttr={this.setAttr}/>

                                })
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