import React, { Component } from 'react';
import './App.css';
import 'antd/dist/antd.css';
//import Menu from './menu/Menu.jsx';
import Content from './Content/Content.jsx';
import Schema from './js/schema';
import LeftSide from "./Content/LeftSide";
import $ from "jquery";
import TimeEventMaker from "./Content/TimeEventMaker";

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            data:null,
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
        this.data = null;
        var self = this;
       /* $.getJSON("./datos1.json",function( d ) {
            let atts = [];
            for (let prop in d[0]){
                let i = {};
                i.name = prop;
                i.checked = true;
                i.type = "";
                i.id = false;
                atts[i.name]=i;
            }
            self.getAttributesType(d,atts);
            console.log(atts);
            self.setState({data: d,attributes:atts}) ;

            console.log("done");
        });*/
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
        //console.log(atts,"atts")
        this.getAttributesType(data,atts);
        //console.log(data);
        this.setState({
            loaded: true,
            attributes: atts,
            ids: ids,
            data: data,
            exportData:data,
            id: ids[0],
        });
        console.log('end setting data')
    }

    setAttributes(attrs){
        console.log('setatts');
        this.setState({attributes:attrs})
    }

    download = (content, fileName, contentType) =>{
        var a = document.createElement("a");
        var file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }

    setLoaded = () => {
        this.setState({
            loaded:false,
            loading:false,
        });
    }
    render() {
        var data = this.state.data;
        console.log(this.state.attributes);
        return (
            <div>

                <div className="row">
                    <div className="col-md-1"></div>
                    <div className="header">
                        {/*<div className="logo"> <Icon type="compass" /> </div>*/}
                        <div><img src="/logo2.png" alt="logo"/></div>
                    </div>
                    {this.state.loaded?
                        <div className="col-md-12 row">
                            <div className="col-md-1"></div>
                            <LeftSide data={data}
                                      attributes={this.state.attributes}
                                      keys={Object.keys(data[0])}/>
                        </div>: <Content

                            setLoaded={this.setLoaded}
                            setLoading={this.setLoading}
                            loading={this.state.loading}
                            setData={this.setData}
                            loaded={this.state.loaded}
                            data={this.state.data}
                            attributes={this.state.attributes}
                            schema = {this.schema}

                        />}



                </div>
            </div>
        );
    }
}

export default App;