import React, { Component } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Icon } from 'antd';
//import Menu from './menu/Menu.jsx';
import Content from './Content/Content.jsx';
import * as d3 from "d3";
import Display from './Content/Display';
import Schema from './js/schema';
import Recommender from './js/recommender';


const DEFAULT_DIMENSION_CONFIG = {
    fieldType: null,
    fieldTransformation: null,
    fieldTypeLocked: false,
    fieldTransformationLocked: false,
};
const FIELD_TYPES = ['quantitative', 'temporal', 'ordinal', 'nominal'];
const FIELD_TRANSFORMATIONS = {
    'quantitative': ['none', 'bin', 'mean', 'sum'],
    'temporal': ['none', 'bin'],
    'ordinal': ['none'],
    'nominal': ['none']
};


class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            data:[],
            loaded: false,
            showModal: false,
            attributes: [],
            ids: [],
            id: "",
            loading:false,
            exportData:[],
            closed:false,
        }
        this.schema = null;
        console.log(this.schema);
        this.recommender = new Recommender();
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.data !== this.state.data) {
            this.schema = new Schema(nextState.data);
        }
    }


    componentWillMount(){

    }
    getAttributesType(data,atts){
        this.schema = new Schema(data);
        this.schema.setAttr(atts);
    }
    createId(data,atts){
        console.log(data,atts);
    }
    isDate(attr){
        var mydate = new Date(attr);
        if(isNaN(mydate.getDate())){
            return false;
        }
        return true;
    }
    setLoading = (loading) => {
        this.setState({loading:loading});
    };
    setData = (data) => {
        console.log('setting data')
        this.setState({originalData:data});
        /*Creates an empty array that will contain the metadata of the attributes*/
        let atts = []
        let ids = []
        for (let prop in data[0]){
            let i = {};
            i.name = prop;
            i.checked = true;
            i.type = "";
            i.id = false;
            atts[i.name]=i;
        }
        console.log(atts,"atts")
        this.getAttributesType(data,atts);
        console.log(data);
        this.setState({
            loaded: true,
            attributes: atts,
            ids: ids,
            data: data,
            exportData:data,
            id: ids[0],
        })
        console.log('end setting data')
    }
    setId = (id) => {
        console.log('setID');
        this.setState({id:id})
    }
    setFile(file){
        console.log('setFile');
    }
    setAttributes(attrs){
        console.log('setatts');
        this.setState({attributes:attrs})
    }
    changeTypeStatus = (attr,type) => {
        console.log(attr,type,'changeTypeStatus');
        let attrs = this.state.attributes;
        attrs.forEach(a=> {
            if(a.name === attr.name){
                a.type = type;
            }
        })
        this.setState({attributes:attrs});
    }
    onChangeAtt = (attChange) => {
        this.setState({attChange});
    }
    changeCheckStatus = (attr, checked) => {

        console.log(attr,checked,this.state);
        let attrs = this.state.attributes;
        attrs.forEach(a=>{
            if(a.name === attr.name){
                a.checked = checked;
            }
        })
        this.setState({attributes:attrs, attChange:true});
    }
    updateCallback = (callback) => {
        console.log('updateCallback',callback);
        this.setExportData(callback);
    }
    setExportData = (exportData) => {
        this.setState({exportData})
    }
    toggleModal = () => {
        console.log('toggleModal')
        this.setState({
            showModal: !this.state.showModal,
        })
    }
    setLoaded = () => {
        this.setState({
            loaded:false,
            loading:false,
        });
    }
    setClosed = (closed) => {
        this.setState({closed})
    }
    getModal(){
        return (
            <div id="openModal" className="modalDialog">
                <div>
                    <a href="#close" title="Close" className="close">X</a>
                    <h2>Viztool</h2>
                    <p></p>
                    {/*<iframe title="demo" width="100%" height="315" src="https://www.youtube.com/embed/Co074RJXzdk" frameBorder="0" allow="encrypted-media" allowFullScreen></iframe>*/}
                </div>
            </div>
        );
    }
    render() {
        return (
            <div>
                {
                    !this.state.showModal?
                        this.getModal()
                        : ''
                }
                <div className="container">
                    <div className="header">
                        {/*<div className="logo"> <Icon type="compass" /> </div>*/}
                        <div> Viztool</div>

                        <div className="info"> <a href="#openModal">  <i className="fas fa-info-circle" ></i> </a></div>
                    </div>


                    <Content
                        closed={this.state.closed}
                        onChangeAtt={this.onChangeAtt}
                        attChange={this.state.attChange}
                        setLoaded={this.setLoaded}
                        setLoading={this.setLoading}
                        loading={this.state.loading}
                        datasets={this.state.datasets}
                        setData={this.setData}
                        loaded={this.state.loaded}
                        data={this.state.data}
                        updateCallback={this.updateCallback}
                        exportData={this.state.exportData}
                        attributes={this.state.attributes}
                        ids={this.state.ids}
                        id={this.state.id}
                    />

                </div>
            </div>
        );
    }
}

export default App;