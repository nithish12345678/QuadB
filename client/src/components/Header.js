import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Container, Row, Col } from 'reactstrap';

import { CircularProgressbar } from 'react-circular-progressbar';

import ReactGA from 'react-ga';
const TRACKING_ID = process.env.REACT_APP_GOOGLE_ANALYTICS_ID;
ReactGA.initialize(TRACKING_ID);
ReactGA.pageview(window.location.pathname + window.location.search);
export class Header extends Component {
    constructor(props) {
        super(props);
        // console.log(props.asset)
        // let urls = this.props.match.params && this.props.match.params.id && this.props.match.params.id.toUpperCase().split("-");
        this.state = {
            dropdownOpen: false,
            dropdownOpenAsset: false,
            dropdownButton: false,
            dropdownBuySell: false
        };
    }

    toggle = () => {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    };

    toggleAsset = () => {
        this.setState({
            dropdownOpenAsset: !this.state.dropdownOpenAsset
        });
    };

    toggleButton = () => {
        this.setState({
            dropdownButton: !this.state.dropdownButton
        });
    };

    toggleBuySell = () => {
        this.setState({
            dropdownBuySell: !this.state.dropdownBuySell
        });
    };

    onAssetClick = (ast) => {
        this.props.onAssetClick(ast);
    };

    onCurrencyClick = (curr) => {
        this.props.onCurrencyClick(curr);
    };

    renderTelegramButton = () => {
        return (
            <Link to='/connect/telegram' className="color-white" onClick={() => {
                ReactGA.event({
                    category: "Telegram Button",
                    action: "click",
                    label: "Telegram button Click"
                });
            }}>
                <div className={("d-flex telegram-logo-text header-telegram-button btn align-items-center pointer color-white")}>
                    <div className="d-inline-block"><img src={"shake"} alt="telegram" className="telegram-logo" /></div>
                    <div className="text-nowrap d-inline-block color-white">Connect Telegram</div>
                </div>
            </Link>

        )
    }

    render() {
        let homeLink = '/';
        return (
            <div style={{ padding: "20px 30px 0px 30px" }}  >
                {/* <a target="_blank" href="https://youtube.com/c/Finstreet">
                    <img style={{ width: "100%" }} src={banneradsone} />
                </a> */}
                <Row className="align-items-center justify-content-sm-center">

                    <Col xs="12" sm="7" md="5" lg="4" className="text-center-sm">
                        <Link to={homeLink} replace onClick={() => {
                            ReactGA.event({
                                category: "Logo",
                                action: "click",
                                label: "Logo click"
                            });
                        }}>
                            <Col xs="12" sm="12" md="11" lg="11" className="padding-none text-center-xs">
                                <img src={this.props.isLightTheme ? "https://hodlinfo.com/static/media/HODLINFO_white.8f78fc06.png" : "https://hodlinfo.com/static/media/HODLINFO.8f78fc06.png"}
                                    className="fiat-logo"
                                    style={{ padding: "10px" }} />
                            </Col>
                        </Link>
                        {/* <p className="col-12 text-center-xs" style={{ fontFamily: "'Oswald', sans-serif", marginTop: "-18px", opacity: "0.8", fontSize: "18px", color: "gray" }}>Powered By <a className="footer-text-link" rel="nofollow" target="_blank" style={{ color: "#3dc6c1" }} href="https://www.finstreet.in/"> Finstreet</a> </p> */}
                    </Col>

                    <Col xs="12" sm="12" md="2" lg="4" className="text-center padding-none">
                        {!this.props.hideAssetCurrencyButtons && (
                            <React.Fragment>

                                <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                                    <DropdownToggle caret className={"header-button"}>
                                        {this.props.currency}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        {Object.keys().map((curr) => {
                                            return (
                                                <DropdownItem
                                                    key={curr}
                                                    tag={Link}
                                                    replace={true}
                                                    to={this.props.asset + "-" + curr}
                                                    value={curr}
                                                    onClick={this.onCurrencyClick.bind(null, curr)}>
                                                    {curr}
                                                </DropdownItem>
                                            )
                                        })
                                        }
                                    </DropdownMenu>
                                </ButtonDropdown>

                                <ButtonDropdown isOpen={this.state.dropdownOpenAsset} toggle={this.toggleAsset}>
                                    <DropdownToggle caret className={"header-button"}>
                                        {this.props.asset}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        {Object.keys().map((ast) => {
                                            return (
                                                <DropdownItem
                                                    key={ast}
                                                    tag={Link}
                                                    to={ast + "-" + this.props.currency}
                                                    replace={true}
                                                    value={ast}
                                                    onClick={this.onAssetClick.bind(null, ast)}>
                                                    {ast}
                                                </DropdownItem>
                                            )
                                        })
                                        }
                                    </DropdownMenu>
                                </ButtonDropdown>

                                <div className="btn-group">
                                    <a target="_blank" href="https://wazirx.com/invite/sp7pvbt6?utm_source=finstreet&utm_medium=affiliate&utm_campaign=regnow-btn" type="button" aria-haspopup="true" aria-expanded="false" className="header-button btn btn-secondary">BUY {this.props.asset}</a>
                                </div>

                            </React.Fragment>
                        )}
                    </Col>
                    <Col xs="12" sm="12" md="5" lg="4" className="right-header">
                        <div className="d-inline-flex flex-wrap align-items-center justify-content-center">
                            {!this.props.hideAssetCurrencyButtons && (
                                <div className="progress-bar-wrapper">
                                    <CircularProgressbar value={parseFloat(this.props.countDownTimer * 100 / 60.0)} text={`${this.props.countDownTimer}`} />
                                </div>
                            )}
                            {!this.props.isTelegramPage && this.renderTelegramButton()}
                            <div className="margin-10 d-inline-block">
                                <label className="switch">
                                    <input type="checkbox" checked={!this.props.isLightTheme} onChange={this.props.onThemeButtonClick} />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}