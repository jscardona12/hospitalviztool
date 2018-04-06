import React, { Component } from 'react';
import Proptypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';


export default class LeftSide extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: "",
        }

    }


    render(){

        return (
            <div>
                <FormControl >
                    <InputLabel htmlFor="Id Selector">Select an Id</InputLabel>
                <Select
                    value={this.state.key}
                    onChange={(e)=> this.setState({key:e.target.value})}
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
        );
    }
}