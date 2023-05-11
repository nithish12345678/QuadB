import React, {Component} from 'react';

import ReactGA from 'react-ga';


export class Footer extends  Component {
    constructor(props){
        super(props);
    }

    render() {
        return(
            <div className="d-flex align-items-center text-center">
                <div className="footer-text">Copyright © 2019</div>
                <div className="footer-text">HodlInfo.com</div>
                {/* <div className="footer-text">Developed By <a rel="nofollow" href="https://www.quadbtech.com" target="_blank" style={{color:"#3dc6c1"}}> QuadBTech</a></div> */}
                <div className="footer-text pointer" style={{marginLeft:"auto"}}>
                    <a href="mailto:support@hodlinfo.com" className="footer-text-link"
                        onClick={()=>{
                            ReactGA.event({
                                category: "Support Click",
                                action: "click",
                                label: "Support button Click"
                            });
                        }}
                    >
                        Support
                    </a>
                </div>
            </div>
        )
    }
}