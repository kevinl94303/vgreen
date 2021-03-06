import React from 'react'
import ReactDOM from 'react-dom';
import { WEBGL } from './globe/third-party/WebGL.js'
import { TWEEN } from './globe/third-party/Tween.js'
import * as THREE from 'three';
import DAT from './globe/globe.js';
import styled from 'styled-components';

const GlobeContainer = styled.div`
    width: 66vw;
    height: calc(100vh - 50px);
    display: inline-block;
`

const GlobeInfo = styled.div`
    position: absolute;
    width: 66vw;
    left: 10px;
    bottom: 10px;
`

class WebGLGlobe extends React.Component {
    constructor(props){
        super(props)
        this.globe = null;
        this.refsArray = {}
        this.setRef = (key, el) => {
            this.refsArray[key] = el
        }
    }

    render(){
        return (
            <div className="globe-wrapper">
                <GlobeContainer className="container" ref={(el) => {this.setRef("container", el)}}/> 
                <GlobeInfo>
                    <h2>Data Center World Map</h2>
                    <h3>Each pillar represents one data center. Its height represents how much power it consumes, and its color represents its CO2 emissions per kWH.</h3>
                </GlobeInfo>
            </div>
        )
    }

    shouldComponentUpdate(){
        return false;
    }

    componentDidMount(){
        var _this = this;
        var container = ReactDOM.findDOMNode(_this.refsArray["container"]);
        if ( !WEBGL.isWebGLAvailable() ) {
            var warning = WEBGL.getWebGLErrorMessage();
            container.appendChild( warning );
            return;
        }

        var colorFn = function(x) {
            let scaled = (x - 0.6) / 0.9
            var c = new THREE.Color(scaled, 1-scaled, 0);
            return c;
        };

        var opts = {imgDir: 'assets/', colorFn: colorFn};
        var i, tweens = [];

        this.globe = new DAT.Globe(container, opts)

        new TWEEN.Tween(this.globe).to({time: 0},500).easing(TWEEN.Easing.Cubic.EaseOut).start();

        TWEEN.start();
        
        var data = this.props.data;
        console.log(data)
        window.data = data;
        for (i=0;i<data.length;i++) {
            console.log(data[i][1])
            this.globe.addData(data[i][1], {format: 'magnitude', name: data[i][0], animated: true});
        }
        this.globe.createPoints();
        this.globe.animate();
        document.body.style.backgroundImage = 'none'; // remove loading
    }

}export default WebGLGlobe