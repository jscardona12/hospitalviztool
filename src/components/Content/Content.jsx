import React, { Component } from 'react';
//import * as d3 from "d3";
import { Spin } from 'antd';
//import TablePreview from './table/Table.jsx';
import Load from './Load/Load.jsx';

//import Display from "./Display";
//import Visualization from './visualization/Visualization.jsx';
class Content extends Component {
    componentDidUpdate(){
       /* console.log('update',this.props.closed, this.props.loaded)
        if(this.props.loaded){
            d3.select("#content")
                .style("transition","margin-left 1s")
                .style("margin-left", 0);
        }
        else{
            d3.select("#content")
                .style("margin-left", "-50%");
        }*/
    }
    render(){
        return(
            <div >
                { !this.props.loaded?
                    <div className="load">
                        {!this.props.loading?
                            <Load
                                setLoading={this.props.setLoading}
                                loading={this.props.loading}
                                datasets={this.props.datasets}
                                setData={this.props.setData.bind(this)}
                            />
                            :
                            <div className="center">
                                <Spin size="large" tip="Loading dataset..."/>
                            </div>

                        }

                    </div>
                    :
                    <div className="container col-md-12">


                        {/*<Display*/}
                            {/*data = {this.props.data}*/}
                            {/*attr = {this.props.attributes}*/}
                            {/*fieldNames = {["id" ,"RE-HOSPITALIZACION"]}*/}
                            {/*schema = {this.props.schema}*/}
                        {/*/>*/}
                    </div>
                }

            </div>
        )
    }
}
export default Content;