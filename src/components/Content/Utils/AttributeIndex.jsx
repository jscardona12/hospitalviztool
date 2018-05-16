import React, { Component } from 'react';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
export default class AttributeIndex extends Component{

    constructor(props){
        super(props);
        this.state={
            checked: false,


        }
    }
    handleChange = name => event => {
        this.setState({ [name]: event.target.checked });
        if(event.target.checked){
            this.props.setAttr(this.props.attr);
        }
        else{
            this.props.setAttr(null);
        }
    };
    render(){

        //console.log(this.props.key);
        return(
            <div className="col-md-7 ">
                <div>
                    {
                        !this.state.checked && this.props.disable?
                            <FormControlLabel
                                disabled
                                control={
                                    <Checkbox
                                        checked={this.state.checked}
                                        onChange={this.handleChange('checked')}
                                        value="checkedB"
                                        color="primary"

                                    />
                                }
                                label = {this.props.attr}

                            />: <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.state.checked}
                                        onChange={this.handleChange('checked')}
                                        value="checkedB"
                                        color="primary"

                                    />
                                }
                                label = {this.props.attr}

                            />
                    }

                </div>

            </div>

        )
    }

}