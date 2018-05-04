import React, { Component } from 'react';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';
export default class Filter extends Component{

    constructor(props){
        super(props);
        this.state={
            checked: false,
            value: "No",
        }
    }
    handleChange =  event => {
            console.log(event.target.value);
            this.setState({value:event.target.value})
            this.props.setFilter(event.target.value);
    };
    render(){

        //console.log(this.props.key);
        return(
            <div className="col-md-12 ">
                <FormControl component="fieldset" required>
                    {/*<FormLabel component="legend">Filter</FormLabel>*/}
                    <RadioGroup
                        aria-label="filter"
                        name="filter"
                        //className={classes.group}
                        value={this.state.value}
                        onChange={this.handleChange}
                    >
                        <FormControlLabel value=">18" control={<Radio color="primary" />} label=">18" />
                        <FormControlLabel value="<18" control={<Radio color="primary" />} label="<18" />
                        <FormControlLabel value="No" control={<Radio color="primary" />} label="No Filter" />
                    </RadioGroup>
                    <FormHelperText>Select Filter</FormHelperText>
                </FormControl>

            </div>

        )
    }

}