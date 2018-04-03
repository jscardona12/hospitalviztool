import React, { Component } from 'react';
import { Upload, Icon, Button, Modal, Card } from 'antd';
import * as vega from 'vega';
import * as d3 from "d3";
import './load.css';
const Dragger = Upload.Dragger;
class Load extends Component {
    state = {
        fileName: 'Upload a dataset',
        ModalText: 'Content of the modal',
        visible: false,
        confirmLoading: false,
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleOk = (name) => {
        console.log(name);
        this.setState({
            ModalText: 'The modal will be closed after two seconds',
            confirmLoading: true,
        }, ()=>{
            let response;
            d3.csv(`../datasets/${name}`, (err, data) => {
                if(err) return err;
                console.log(data)
                this.props.setData(data);
                this.setState({
                    visible: false,
                    confirmLoading: false,
                });
            })
        });
    }
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }
    getFileSize = (file) => {
        let fSExt = ['Bytes', 'KB', 'MB', 'GB'];
        let fSize = file.size;
        let i=0;
        while(fSize>900){
            fSize/=1024;
            i++;
        }
        let finalSize = Math.round(fSize*100)/100 +' '+fSExt[i];
        return finalSize
    }
    handleFile(file){
        console.log('handleFile')
        const reader = new FileReader();
        if(file == null){
            alert('No file selected.');
            return;
        }
        reader.onload = (lEvent: any) => {
            console.log('onload')
            const format = file.name.split('.').pop();
            let values;
            try {
                console.log('try')
                if(format === "txt") throw true
                values = vega.read(lEvent.target.result, {type: format});
                console.log('try2')
                this.props.setData(values);
                this.setState({loading:false})
            } catch (err) {
                console.log('err')
                let ssv = d3.dsvFormat(";");
                console.log('err2');
                values = ssv.parse(lEvent.target.result);
                console.log(values);
                this.props.setData(values);
                this.setState({loading:false});
            }
        };

        reader.readAsText(file);
    }
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
                <div>
                    <p> --------- or select one of our datasets --------- </p>
                </div>
                <div>
                    <Button className="button" onClick={this.showModal} type="primary" ghost>Select</Button>
                    <Modal title="Datasets"
                           visible={visible}
                           onOk={this.handleOk}
                           confirmLoading={confirmLoading}
                           onCancel={this.handleCancel}
                           width="80%"
                    >

                    </Modal>
                </div>

            </div>
        );
    }
}

export default Load;