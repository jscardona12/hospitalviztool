import React, { Component } from 'react';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';
export default class Filter extends Component{

    constructor(props){
        super(props);
        this.state={
            checked: false,
            value: "<18",
        }
    }
    handleChange = name => event => {
        this.setState({ [name]: event.target.checked });
        if(event.target.checked){
            this.props.setFilter(this.props.attr);
        }
        else{
            this.props.setFilter(null);
        }
    };
    render(){

        //console.log(this.props.key);
        return(
            <div className="col-md-12 ">
                <FormControl component="fieldset" required error {/*className={classes.formControl}*/} >
                    <FormLabel component="legend">Filter</FormLabel>
                    <RadioGroup
                        aria-label="gender"
                        name="gender2"
                        //className={classes.group}
                        value={this.state.value}
                        onChange={this.handleChange}
                    >
                        <FormControlLabel value=">18" control={<Radio color="primary" />} label=">18" />
                        <FormControlLabel value="<18" control={<Radio color="primary" />} label="<18" />
                    </RadioGroup>
                    <FormHelperText>You can display an error</FormHelperText>
                </FormControl>

            </div>

        )
    }

}