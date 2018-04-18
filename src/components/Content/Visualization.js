import React, { Component } from 'react';
import { vl2svg, equals } from '../js/util';

import '../css/Visualization.css';

class Visualization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      svg: null,
      showDetailed: false
    };
     this.updateSvg(this.props.vlSpec);
  }
  componentDidMount(){
      this.updateSvg(this.props.vlSpec);
  }
  updateSvg = (vlSpec) => {
      var s = null;
    vl2svg(vlSpec).then(
      (svg) => {
          //console.log(svg);
          console.log("getting view")
        this.setState({
          svg: svg,
        });
        // s = svg;
      }
    );
    /*return s;*/
  }

  componentWillReceiveProps(nextProps) {
    if (!equals(this.props, nextProps)) {
      this.updateSvg(nextProps.vlSpec);
    }
  }

  render() {
    console.log("RENDERED")
    return (
      <div className="fix">
              <div id="view" >


                  {/*<span dangerouslySetInnerHTML={{__html: this.state.svg}} />*/}
              </div>


      </div>
    );
  }


}

export default Visualization;