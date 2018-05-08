import React, { Component } from 'react';
import { Upload, Icon, Button, Modal, Card } from 'antd';
import * as vega from 'vega';
import * as d3 from "d3";
import './load.css';
import moment from 'moment';

const Dragger = Upload.Dragger;
class Load extends Component {
    state = {
        confirmLoading: false,
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }


    handleFile(file){
        console.log('handleFile')
        const reader = new FileReader();
        if(file == null){
            alert('No file selected.');
            return;
        }
        reader.onload = (lEvent) => {
            console.log('onload')
            const format = file.name.split('.').pop();
            let values;
            try {
                console.log('try')
                if(format === "txt") throw true
                values = vega.read(lEvent.target.result, {type: format});
                var rehosp = {};
                var count = 0;
                values.forEach((touple)=>{

                    if(touple["TIPO_INGRESO"] === "HOSPITALARIO") {
                        if (rehosp[touple["id"]]) {
                            // console.log("EXISTS")
                            var feini = rehosp[touple["id"]]["FECHA_DE_INGRESO"];
                            if (feini !== touple["FECHA_DE_INGRESO"]) {
                                //   console.log("DIFF")
                                // console.log(rehosp[touple["id"]]);
                                var feinicio = moment(touple["FECHA_DE_INGRESO"], 'MM-DD-YYYY HH:mm:ss');
                                var diff = feinicio.diff(rehosp[touple["id"]].fefin, "days");

                                if (diff <= 30) {
                                    // console.log(diff);
                                    count++;
                                    touple["RE-HOSPITALIZACION"] = 1;
                                    var feini = moment(touple["FECHA_DE_INGRESO"], 'MM-DD-YYYY HH:mm:ss')
                                    var fefin = null;
                                    if (touple["FECHA_EGRESO"])
                                        fefin = moment(touple["FECHA_EGRESO"], 'MM-DD-YYYY HH:mm:ss')
                                    rehosp[touple["id"]] = {
                                        "FECHA_DE_INGRESO": touple["FECHA_DE_INGRESO"],
                                        "FECHA_EGRESO": touple["FECHA_EGRESO"],
                                        feini,
                                        fefin,
                                        "key": touple["id"],
                                    };
                                }
                                else {
                                    touple["RE-HOSPITALIZACION"] = 0;
                                    var feini = moment(touple["FECHA_DE_INGRESO"], 'MM-DD-YYYY HH:mm:ss')
                                    var fefin = null;
                                    if (touple["FECHA_EGRESO"])
                                        fefin = moment(touple["FECHA_EGRESO"], 'MM-DD-YYYY HH:mm:ss')
                                    rehosp[touple["id"]] = {
                                        "FECHA_DE_INGRESO": touple["FECHA_DE_INGRESO"],
                                        "FECHA_EGRESO": touple["FECHA_EGRESO"],
                                        feini,
                                        fefin,
                                        "key": touple["id"],
                                    };
                                }
                            }
                            else {
                                touple["RE-HOSPITALIZACION"] = 0;
                            }
                        }
                        else {
                            var feini = moment(touple["FECHA_DE_INGRESO"], 'MM-DD-YYYY HH:mm:ss')
                            var fefin = null;
                            if (touple["FECHA_EGRESO"])
                                fefin = moment(touple["FECHA_EGRESO"], 'MM-DD-YYYY HH:mm:ss')
                            rehosp[touple["id"]] = {
                                "FECHA_DE_INGRESO": touple["FECHA_DE_INGRESO"],
                                "FECHA_EGRESO": touple["FECHA_EGRESO"],
                                feini,
                                fefin,
                                "key": touple["id"],
                            };
                            touple["RE-HOSPITALIZACION"] = 0;
                        }
                    }
                    else{
                        touple["RE-HOSPITALIZACION"] = 0;
                    }

                });

                //console.log(count);
                //console.log('try2');
                values = this.setBinDate(values,"FECHA_DE_INGRESO");
                values = this.setBinDate(values,"FECHA_EGRESO");
                values = this.setBinDate(values,"FECHA_NACIMIENTO");
                values = this.setBinAges(values,"EDAD_PACIENTE");
                console.log(values);
                this.props.setData(values);
                this.setState({loading:false})
            } catch (err) {
                console.log(err);
                console.log('err')
                let ssv = d3.dsvFormat(";");
                console.log('err2');
                values = ssv.parse(lEvent.target.result);
                //console.log(values);
                this.props.setData(values);
                this.setState({loading:false});
            }
        };

        reader.readAsText(file);
    }
    setBinAges = (data,attr) =>{
        var catArr =[];
        var cat ={};
        var categories = data.forEach((d)=>{
            var val = d[attr];
            if(!cat[val]) {
                cat[val] = 1;
                catArr.push(val);
            }
            else{
                cat[val] ++;
            }
        });
        var cate = Object.entries(cat);
        var len = cate.length;
        var max =  cate[0][0];
        var min =  cate[0][0];
        cate.forEach((k,e)=>{
            var t = k
            if(t > max){
                max = t;
            }
            if(t < min){
                min = t;
            }
        });
        var binArr = [0,1,5,12,18,20,30,40,50,60,70,80,90,100,110,120];
        data.forEach((touple)=>{
            var val = touple[attr];
            for(var i=0; i < binArr.length -1; i++){
                var ind = binArr[i];
                if(val - ind >=0 && val - binArr[i+1]<0){
                    touple[attr] = ind;
                    break;
                }
            }
        });
        return data;

    };
    setBinDate = (data,attr)=>{
        var catArr =[];
        var cat ={};
        var categories = data.forEach((d)=>{
            var val = d[attr];
            if(!cat[val]) {
                cat[val] = 1;
                catArr.push(val);
            }
            else{
                cat[val] ++;
            }
        });
        var cate = Object.entries(cat);
        var len = cate.length;
        var max =  moment(cate[0][0], 'MM-DD-YYYY HH:mm:ss');
        var min =  moment(cate[0][0], 'MM-DD-YYYY HH:mm:ss');
        cate.forEach((k,e)=>{
            var t = moment(k, 'MM-DD-YYYY HH:mm:ss');
            if(t.diff(max)>0){
                max = t;
            }
            if(t.diff(min)<0){
                min = t;
            }
        })
        var first = min.format('L');
        var last  = max.format('L');
        var binArr = [first];
        var temp = min;
        console.log(temp.diff(moment(cate[len-1][0], 'MM-DD-YYYY HH:mm:ss')));
        while(temp.diff(max) < 0){
            temp.add(3,'month');
            var a = temp.format('L');
            binArr.push(a);
        }
        console.log(binArr);
        var bin = {};
        var i = 0;
        var j = 0;
        data.forEach((touple)=>{
            var val = touple[attr];
            for(var i=0; i < binArr.length -1; i++){
                var ind = binArr[i];
                if(moment(val, 'MM-DD-YYYY HH:mm:ss').diff(moment(binArr[i], 'MM-DD-YYYY'))>=0 && moment(val, 'MM-DD-YYYY HH:mm:ss').diff(moment(binArr[i+1], 'MM-DD-YYYY'))<0){
                    touple[attr] = binArr[i];
                    break;
                }
            }
        });
        return data;

    };
    beforeUpload = (e) => {
        this.props.setLoading(true);
        this.handleFile(e);
        return false;
    }
    render() {
        const { visible, confirmLoading } = this.state;
        return (
            <div>
                <div className="dragger">
                    <div>
                        {!this.props.loading?
                            <div>
                                <Dragger accept=".csv,.tsv,.txt" beforeUpload={this.beforeUpload} name={'file'} multiple={false} onChange={this.onChange}>
                                    <p className="ant-upload-drag-icon">
                                        <Icon type="upload" />
                                    </p>
                                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                    <p className="ant-upload-hint">*.csv, *.tsv and *.txt files allowed.</p>
                                    {this.state.loading?"loading":''}
                                </Dragger>
                            </div>
                            :
                            <div>
                                <Icon type="loading" />
                            </div>
                        }


                    </div>

                    {/*<input type="file" name="file-5[]" id="file-5" className="inputfile inputfile-4" data-multiple-caption="{count} files selected" onChange={this.onChange.bind(this)} />
                    <label htmlFor="file-5"><figure><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/></svg></figure> <span>{this.state.fileName}</span></label>
                    */}
                </div>

            </div>
        );
    }
}

export default Load;