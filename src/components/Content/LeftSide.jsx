import React, { Component } from 'react';
import Proptypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';
import AttributeIndex from './Utils/AttributeIndex.jsx';
import Display from './Display.js';
import RightSide from './RightSide.jsx';


export default class LeftSide extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: "",
            keys: [],
            attr:null,
            disable:false,
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

    render(){

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
                <div className="col-md-8">
                    <RightSide id = "Navio1"
                               data={this.props.data}
                               attributes={this.props.attributes}
                               keys={this.props.keys} />
                    <RightSide id = "Navio2"
                               data={this.props.data}
                               attributes={this.props.attributes}
                               keys={this.props.keys} />
                    <RightSide id = "Navio3"
                               data={this.props.data}
                               attributes={this.props.attributes}
                               keys={this.props.keys} />
                </div>

            </div>

        );
    }
}