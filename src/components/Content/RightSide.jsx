import React, { Component } from 'react';
import Display from './Display.js'
import Navio from "./Utils/Navio.js";

let d3 = require("d3");
let d3_chromatic = require("d3-scale-chromatic");


export default class Rightide extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: "",
            keys: [],
            attr:null,
            disable:false,
        }

    }

    componentWillUpdate(newProps) {
       /* if(newProps.exportData.length === this.props.exportData.length){
            if(newProps.attChange !== this.props.attChange){
                this.deleteWidget();
                this.props.onChangeAtt(false);
                this.setUpNodeNavigator();
            }
            else {
                this.setUpNodeNavigator();
            }
        }*/

    }
    deleteWidget = () => {
        var myNode = document.getElementById("vis");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
    }

    setAttr = (key)=>{
        if(key){
            this.setState({attr:key,disable:true});
        }
        else
            this.setState({attr:key,disable:false});

    }
    handleSelect = (e)=>{
        console.log(e.target.value);
        this.setState({key:e.target.value})
        console.log(this.state.key);
    }
    setUpNodeNavigator = () => {
        this.nn = new Navio("#"+this.props.id, 300)
        // the next line is commented because the node navigator creates a sequential id
        // .id(this.props.id)
            .updateCallback(this.props.updateCallback);
        this.props.keys.forEach((data,i)=>{
            var d = this.props.attributes[data];
            if(d.checked){
                console.log(this.props.data)
                console.log("------------");

                if(d.type === 'ordinal' || d.type ==='nominal'){
                    console.log('cat',d.name);
                    this.nn.addCategoricalAttrib(d.name);
                }else if(d.type === 'temporal'||d.type ==='quantitative'){
                    console.log('seq',d.name);
                    if(d.type=== "temporal"){
                        console.log('date')
                        this.nn.addSequentialAttrib(d.name,
                            d3.scalePow()
                                .exponent(0.25)
                                .range([d3_chromatic.interpolatePurples(0), d3_chromatic.interpolatePurples(1)]))
                    }
                    else {
                        this.nn.addSequentialAttrib(d.name);
                    }

                }

                console.log("------------");
            }
        })

        if (this.props.data) {
            this.nn.data(this.props.data);
        }
    }
    componentDidMount() {
        //this.props.setLoading(true);
        this.setUpNodeNavigator();

    }

    render(){

        return (
            <div className="col-md-12 row">

                <div id={this.props.id}></div>
                {/*{*/}
                    {/*this.props.attr?*/}
                        {/*<div className="col-md-6">*/}
                            {/*<Display*/}
                                {/*data = {this.props.data}*/}
                                {/*attr = {this.props.attributes}*/}
                                {/*fieldNames = {[this.state.key ,this.state.attr]}*/}
                                {/*schema = {this.props.schema}*/}
                            {/*/>*/}
                        {/*</div>: <div></div>*/}
                {/*}*/}

            </div>

        );
    }
}