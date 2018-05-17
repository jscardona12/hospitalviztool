import React, { Component } from 'react';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';
import Input, { InputLabel } from 'material-ui/Input';

export default class TimeEventMaker extends Component{
    constructor(props){
        super(props);
        this.state ={
            f1:"",
            f2:"",
            periodo: 0,
            nombre: "",
            id:"",
        }
    }

    handleSelectId = e =>{
        this.setState({id : e.target.value});
    }
    handleSelectF1 = e =>{
        this.setState({f1 : e.target.value});
    }
    handleSelectF2 = e =>{
        this.setState({f2 : e.target.value});
    }
    handleSelectPeriod = e =>{
        this.setState({periodo : e.target.value});
    }
    handleSelectNombre = e =>{
        this.setState({nombre : e.target.value});
    }
    handleClickYes = ()=>{
        this.props.calculateTimeEvent(this.props.values,this.state.id,this.state.f1,this.state.f2,this.state.periodo,this.state.nombre);
    };
    handleClickNo = ()=>{
        this.props.setDate(this.props.values);
    };
    render(){
        return(
            <div>
                <h3> A time event is an event that passes between a <span style={{color: "red"}}>start date</span> and a <span style={{color: "blue"}}>end date</span> , within a <span style={{color: "purple"}}>period </span>of time(days) for a same <span style={{color: "green"}}>identificator </span> . </h3>
                <img width={800} src="/tevent.png" alt="Description for time event"/>
                <div className="row" style={{marginTop:"20px"}}>
                    <FormControl className="col-md-2">
                        <InputLabel htmlFor="NameSelector">Time Event Name</InputLabel>
                        <Input value={this.state.nombre} onChange={this.handleSelectNombre} type="text"/>
                        <FormHelperText >Type the name of the Time Event</FormHelperText>
                    </FormControl>
                    <FormControl className="col-md-2" >
                        <InputLabel style={{color:"green"}} htmlFor="Id Selector">Select an Id</InputLabel>
                        <Select
                            value={this.state.id}
                            onChange={this.handleSelectId}
                        >

                            {
                                this.props.keys.map((key,index)=> {
                                    return <MenuItem key = {index}value={key.name}>{key.name}</MenuItem>

                                })
                            }
                        </Select>
                        <FormHelperText style={{color:"green"}}>Select the identificator</FormHelperText>
                    </FormControl>
                    <FormControl className="col-md-2">
                        <InputLabel style={{color:"red"}} htmlFor="start Selector">Select the start date</InputLabel>
                        <Select
                            value={this.state.f1}
                            onChange={this.handleSelectF1}
                        >

                            {
                                this.props.keys.filter((a)=>{return a.type ==="temporal"}).map((key,index)=> {
                                    return <MenuItem key = {index}value={key.name}>{key.name}</MenuItem>

                                })

                            }
                        </Select>
                        <FormHelperText style={{color:"red"}}>Select the start date</FormHelperText>
                    </FormControl>

                    <FormControl className="col-md-2">
                        <InputLabel style={{color:"blue"}} htmlFor="end Selector">Select the end date</InputLabel>
                        <Select
                            value={this.state.f2}
                            onChange={this.handleSelectF2}
                        >

                            {
                                this.props.keys.filter((a)=>{return a.type ==="temporal"}).map((key,index)=> {
                                    return <MenuItem key = {index}value={key.name}>{key.name}</MenuItem>

                                })

                            }
                        </Select>
                        <FormHelperText style={{color:"blue"}}>Select the end date</FormHelperText>
                    </FormControl>
                    <FormControl className="col-md-2">
                        <InputLabel style={{color:"purple"}}htmlFor="period Selector">Select the period(days)</InputLabel>
                        <Input value={this.state.periodo} onChange={this.handleSelectPeriod} type="number"/>
                        <FormHelperText style={{color:"purple"}}>Select the period in days</FormHelperText>
                    </FormControl>
                    {
                        this.state.periodo > 0 && this.state.id && this.state.f1 && this.state.f2 && this.state.nombre?<div  style={{marginTop:"20px"}}>
                            <h5>This process can take a while do you want to calculate the Time Event?</h5>
                            <div className="row col-md-12">
                                <button  type="button" className="move btn btn-primary btn-xs col-md-4" onClick={ this.handleClickYes}> Yes</button>
                                <button  type="button" className="move btn btn-danger btn-xs col-md-4" onClick={ this.handleClickNo}> No </button>
                            </div>
                        </div>: <div></div>
                    }

                </div>

            </div>
        )
    }
}