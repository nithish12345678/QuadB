import React, { Component } from 'react';
import { Header } from "./Header";
import { Footer } from "./Footer";

import cookie from 'react-cookies'
import 'react-circular-progressbar/dist/styles.css';
import ReactGA from 'react-ga';


const API_URL = process.env.REACT_APP_API_URL;

const TRACKING_ID = process.env.REACT_APP_GOOGLE_ANALYTICS_ID;
ReactGA.initialize(TRACKING_ID);

ReactGA.pageview(window.location.pathname + window.location.search);

export class MainPage extends Component {

    getCountDown = () => {
        setInterval(() => {
            this.setState((oldState) => {
                return {
                    countDownTimer: oldState.countDownTimer > 0 ? oldState.countDownTimer - 1 : 60
                }
            })
        }, 1000)
    }

    _getData = (clicked) => {

        clicked && ReactGA.event({
            category: "ASSET/CURRENCY",
            action: "Loaded",
            label: this.state.asset + '/' + this.state.currency
        });
        this.state.socket.emit('Event1', {
            "url": API_URL,
            "asset": this.state.asset,
            "currency": this.state.currency
        });
        this.state.socket.on("FromAPI", data => {
            let lastPriceArray = Object.keys(data).map(item => {
                return data[item].netPrice;
            }).filter(function (element) {
                return element !== undefined && element !==null;
            });
            let lastPriceSum = lastPriceArray.reduce((a, b) => a + b, 0);
            let averageLastPrice = lastPriceArray.length > 0 ? (lastPriceSum / lastPriceArray.length).toFixed(0) : 0;
            data && this.setState({
                countDownTimer: 60,
                data: data,
                firstPrice: lastPriceArray.length > 0 ? Math.min(...lastPriceArray) : 0,
                averagePrice: averageLastPrice,
                randomObj: this.getRandomObj()
            }, () => {
                document.title = "HodlInfo |" + " " + this._getSymbol() + this._formatPrice(Math.abs(parseInt(this.state.data.best_trade_price).toFixed(0)));
            });
        });
    };

    componentDidMount() {
        this._getData(false);
    }


    _formatPrice = (num) => {
        // return (parseFloat(num)).toFixed(1).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        var x= num;
    x=num.toString();
    var lastThree = x.substring(x.length-3);
    var otherNumbers = x.substring(0,x.length-3);
    if(otherNumbers !=='')
        lastThree = ',' + lastThree;
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    // alert(res);
        return (res)
    }
    _formatPriceusdt = (num) => {
        return (parseFloat(num)).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        // return (num.toLocaleString())
    }

    _getDifference = (netPrice, index) => {
        let difference = (netPrice - this.state.averagePrice).toFixed(0);
        let differencePercent = (((difference * 100) / this.state.averagePrice)).toFixed(0);
        if (differencePercent > 0) {
            return <span className={this.state.buyMode ? "color-red" : "color-green"}>{this.state.buyMode ? "-" : ""}{differencePercent + " %"}</span>;
        }
        else if (differencePercent < 0) {
            return <span className={this.state.buyMode ? "color-green" : "color-red"}>{!this.state.buyMode ? "-" : ""}{(Math.abs(differencePercent)).toFixed(0) + " %"}</span>;
        }
        else {
            return <span className={"color-green"}>{(Math.abs(differencePercent)).toFixed(0) + " %"}</span>;
        }
    };

    _getSavings = (netPrice, index) => {
        let difference = parseInt((netPrice - this.state.averagePrice).toFixed(0));
        if (difference > 0) {
            return <div className={this.state.buyMode ? "color-red d-flex align-items-center " : "color-green d-flex align-items-center "}>
                <div className="arrow">▼</div>
                <div>{this._getSymbol()}{this._formatPrice(difference)}</div>
            </div>;
        }
        else if (difference < 0) {
            return <div className={this.state.buyMode ? "color-green d-flex align-items-center " : "color-red d-flex align-items-center "}>
                <div className="arrow">▲</div>
                <div>{this._getSymbol()}{this._formatPrice(parseInt(Math.abs(difference)))}</div>
            </div>;
        }
        else {
            return <div className={"color-green d-flex align-items-center "}>{this._getSymbol()}{this._formatPrice(parseInt(Math.abs(difference)))}</div>;
        }
    };

    _getTableBody = () => {
        // let rank = 0;/
        let rank = 0;
        // let dataKeys = this._getSortedKeysArray();
        return (
            <tbody>
                {this.state.data.maindata.map((index, key) => {
                    // if (this.state.data[key] && this.state.data[key].last) {
                    // index is object and key is value
                    // console.log(index)
                    // console.log(key)
                    // console.log(this.state.data.maindata)

                    // if(this.state.currency ===='INR'){
                    // if(rank < 11){
                        if ((this.state.asset ==='USDT') || (this.state.asset ==='XRP')  || (this.state.asset ==='TRX') || (this.state.asset ==='IOST') || (this.state.asset ==='WIN') || (this.state.asset ==='BTT') || (this.state.asset ==='WRX')) {
                        // alert("helo")
                        return (

                            <tr key={key}>
                                <td className="align-middle">
                                    <h4 className="table-text">{++rank}</h4>
                                </td>
                                <td className="align-middle">
                                    <a  target="_blank" href={"/"}>
                                        <h4 className={"table-text"} >
                                            { (
                                                <img src={""} alt="" className="exchange-logo" />
                                            )}
                                            {  (
                                                <span
                                                    className={"exchange-name "}>{this.state.data.maindata[key].name}
                                                </span>
                                            )}

                                        </h4>
                                    </a>
                                </td>
                                <td className="align-middle"><h4
                                    className="table-text">{this._getSymbol()}{this._formatPriceusdt(Math.abs(parseFloat(this.state.data.maindata[key].last_trade_price).toFixed(2)))}</h4></td>
                                <td className="align-middle">
                                    <h4 className="table-text">
                                        <span>{this._getSymbol()}{this._formatPriceusdt(Math.abs(parseFloat(this.state.data.maindata[key].buy).toFixed(2)))} / {this._getSymbol()}{this._formatPriceusdt(Math.abs(parseFloat(this.state.data.maindata[key].sell).toFixed(2)))}</span>
                                        {/* <span className="commission-percent">{`(${(this.state.data[key].commissionPercent).toFixed(0)} %)`}</span> */}
                                    </h4>
                                </td>
                                {/* <td className="align-middle"><h4
                                                className="table-text">{this._getSymbol()}{this._formatPrice(Math.abs(parseInt(this.state.data.maindata[key].buy).toFixed(0)))}</h4></td> */}
                                <td className="align-middle">
                                    {this.state.data.maindata[key].difference < 0 ?
                                        <h4
                                            className="table-text color-red">{this.state.data.maindata[key].difference} %</h4>
                                        :
                                        <h4
                                            className="table-text color-green">{this.state.data.maindata[key].difference} %</h4>
                                    }

                                </td>
                                <td className="align-middle">
                                    {/* <div className="arrow">▲</div> */}
                                    {this.state.data.maindata[key].difference < 0 ?
                                        <h4 className="table-text color-red">
                                            ▼ {this._getSymbol()}{this._formatPriceusdt(Math.abs(this.state.data.maindata[key].saving))}
                                        </h4>
                                        :
                                        <h4 className="table-text color-green">
                                            ▲ {this._getSymbol()}{this._formatPriceusdt(Math.abs(this.state.data.maindata[key].saving))}
                                        </h4>
                                    }
                                </td>
                            </tr>
                        )

                    } else {
                        return (

                            <tr key={key}>
                                <td className="align-middle">
                                    <h4 className="table-text">{++rank}</h4>
                                </td>
                                <td className="align-middle">
                                    <a  target="_blank" href={""}>
                                        <h4 className={"table-text"} >
                                            
                                            {(
                                                <span
                                                    className={"exchange-name "}>{this.state.data.maindata[key].name}
                                                </span>
                                            )}

                                        </h4>
                                    </a>
                                </td>
                                <td className="align-middle"><h4
                                    className="table-text">{this._getSymbol()}{this._formatPrice(Math.abs(parseInt(this.state.data.maindata[key].last_trade_price).toFixed(0)))}</h4></td>
                                <td className="align-middle">
                                    <h4 className="table-text">
                                        <span>{this._getSymbol()}{this._formatPrice(Math.abs(parseInt(this.state.data.maindata[key].buy).toFixed(0)))} / {this._getSymbol()}{this._formatPrice(Math.abs(parseInt(this.state.data.maindata[key].sell).toFixed(0)))}</span>
                                        {/* <span className="commission-percent">{`(${(this.state.data[key].commissionPercent).toFixed(0)} %)`}</span> */}
                                    </h4>
                                </td>
                                {/* <td className="align-middle"><h4
                                                className="table-text">{this._getSymbol()}{this._formatPrice(Math.abs(parseInt(this.state.data.maindata[key].buy).toFixed(0)))}</h4></td> */}
                                <td className="align-middle">
                                    {this.state.data.maindata[key].difference < 0 ?
                                        <h4
                                            className="table-text color-red">{this.state.data.maindata[key].difference} %</h4>
                                        :
                                        <h4
                                            className="table-text color-green">{this.state.data.maindata[key].difference} %</h4>
                                    }

                                </td>
                                <td className="align-middle">
                                    {/* <div className="arrow">▲</div> */}
                                    {this.state.data.maindata[key].difference < 0 ?
                                        <h4 className="table-text color-red">
                                            ▼ {this._getSymbol()}{this._formatPrice(Math.abs(parseInt(this.state.data.maindata[key].saving).toFixed(0)))}
                                        </h4>
                                        :
                                        <h4 className="table-text color-green">
                                            ▲ {this._getSymbol()}{this._formatPrice(Math.abs(parseInt(this.state.data.maindata[key].saving).toFixed(0)))}
                                        </h4>
                                    }
                                </td>
                            </tr>
                        )
                    }

                    // }

                    // } 

                    // }
                })
                }
            </tbody>
        )
    };

    onThemeButtonClick = () => {
        ReactGA.event({
            category: "Theme Button",
            action: "click",
            label: "Theme"
        });
        this.setState((oldState) => {
            return {
                isLightTheme: !oldState.isLightTheme
            }
        }, () => {
            let val = this.state.isLightTheme ? 1 : 0;
            cookie.save('isLightTheme', val, { path: '/' })
        })
    };

    onCurrencyClick = (curr) => {
        ReactGA.event({
            category: "Currency",
            action: "Currency Click",
            label: curr
        });
        document.title = "HodlInfo";
        this.state.socket.close();
        this.setState({
            data: null,
            firstPrice: 0,
            currency: curr,
            socket: this.socketConnection()
        }, () => {
            this._getData(true);
        })
    };

    onAssetClick = (ast) => {
        ReactGA.event({
            category: "Asset",
            action: "Asset Click",
            label: ast
        });
        this.state.socket.close();
        document.title = "HodlInfo";
        this.setState({
            data: null,
            firstPrice: 0,
            asset: ast,
            socket: this.socketConnection()
        }, () => {
            this._getData(true);
        })
    };

    onModeChange = (mode) => {
        this.setState({
            sortType: mode ? "buy" : "sell",
            buyMode: mode
        })
    }

    getRandomObj = () => {
        let random5mins = parseInt((Math.random()).toFixed(0));
        let random1hour = parseInt((random5mins + parseInt((Math.random()).toFixed(0))).toFixed(0));
        let random1day = parseInt((random1hour + parseInt((Math.random() * (9.9)).toFixed(0))).toFixed(0));
        let random7days = parseInt((random1hour + parseInt((Math.random() * (9.9)).toFixed(0))).toFixed(0));
        return {
            "random5mins": random5mins,
            "random1hour": random1hour,
            "random1day": random1day,
            "random7days": random7days,
        }
    }

    _getAverageHeader = () => {
        if ((this.state.asset ==='USDT') || (this.state.asset ==='BTT') ||  (this.state.asset ==='WIN') ) {
            return (
                <div className="Container-fluid " style={{ padding: "0px 30px" }}>
                    <div style={{ padding: "10px 0px" }} className="d-flex justify-content-around align-items-center average-header">
                        <div className="text-center">
                            {this.state.data.previousdata && this.state.data.previousdata.last5Mins ?
                                <div className="average-header-maintext color-green">
                                    {this.state.data.previousdata.last5Mins} %
                            </div>
                                :
                                <div className="average-header-maintext color-red">{parseInt(this.state.randomObj.random5mins).toFixed(0)} %</div>
                            }
                            <div className="average-header-subHeading">5 Mins</div>
                        </div>

                        <div className="text-center">
                            {this.state.data.previousdata && this.state.data.previousdata.last1Hour ?
                                <div className="average-header-maintext color-green">
                                    {this.state.data.previousdata.last1Hour} %
                            </div>
                                :
                                <div className="average-header-maintext color-red">{parseInt(this.state.randomObj.random1hour).toFixed(0)} %</div>
                            }
                            <div className="average-header-subHeading">1 Hour</div>
                        </div>

                        <div style={{ maxWidth: "40%" }}>
                            <div className="text-center font-32 average-block">
                                <div className="average-subText">
                                    <span className="subText-heading">Best Price to Trade</span>
                                </div>
                                <div className="average-heading" style={{ paddingBottom: "10px" }}>
                                    {this._getSymbol()}
                                    {this._formatPriceusdt(Math.abs(parseFloat(this.state.data.best_trade_price).toFixed(2)))}
                                </div>
                                <div className="average-subText">
                                    Average {this.state.asset}/{this.state.currency} net price including commission
                            </div>
                            </div>
                        </div>

                        <div className="text-center">
                            {this.state.data.previousdata && this.state.data.previousdata.last24Hours ?
                                <div className="average-header-maintext color-green">
                                    {this.state.data.previousdata.last24Hours} %
                            </div>
                                :
                                <div className="average-header-maintext color-red">{parseInt(this.state.randomObj.random1day).toFixed(0)} %</div>
                            }
                            <div className="average-header-subHeading">1 Day</div>
                        </div>

                        <div className="text-center">
                            {this.state.data.previousdata && this.state.data.previousdata.last7Days ?
                                <div className="average-header-maintext color-green">
                                    {this.state.data.previousdata.last7Days} %
                            </div>
                                :
                                <div className="average-header-maintext color-green">{parseInt(this.state.randomObj.random7days).toFixed(0)} %</div>
                            }
                            <div className="average-header-subHeading">7 Days</div>
                        </div>

                    </div>
                    {/* <a target="_blank" href="https://finstreet.in/">
                        <img style={{ width: "100%", padding: "0px 0px 20px 0px" }} src={banneradstwo} />
                    </a> */}
                </div>
            )
        } else {
            return (
                <div className="Container-fluid " style={{ padding: "0px 30px" }}>
                    <div style={{ padding: "10px 0px" }} className="d-flex justify-content-around align-items-center average-header">
                        <div className="text-center">
                            {this.state.data.previousdata && this.state.data.previousdata.last5Mins ?
                                <div className="average-header-maintext color-green">
                                    {this.state.data.previousdata.last5Mins} %
                            </div>
                                :
                                <div className="average-header-maintext color-red">{parseInt(this.state.randomObj.random5mins).toFixed(0)} %</div>
                            }
                            <div className="average-header-subHeading">5 Mins</div>
                        </div>

                        <div className="text-center">
                            {this.state.data.previousdata && this.state.data.previousdata.last1Hour ?
                                <div className="average-header-maintext color-green">
                                    {this.state.data.previousdata.last1Hour} %
                            </div>
                                :
                                <div className="average-header-maintext color-red">{parseInt(this.state.randomObj.random1hour).toFixed(0)} %</div>
                            }
                            <div className="average-header-subHeading">1 Hour</div>
                        </div>

                        <div style={{ maxWidth: "40%" }}>
                            <div className="text-center font-32 average-block">
                                <div className="average-subText">
                                    <span className="subText-heading">Best Price to Trade</span>
                                </div>
                                <div className="average-heading" style={{ paddingBottom: "10px" }}>
                                    {this._getSymbol()}
                                    {this._formatPrice(Math.abs(parseInt(this.state.data.best_trade_price).toFixed(0)))}
                                </div>
                                <div className="average-subText">
                                    Average {this.state.asset}/{this.state.currency} net price including commission
                            </div>
                            </div>
                        </div>

                        <div className="text-center">
                            {this.state.data.previousdata && this.state.data.previousdata.last24Hours ?
                                <div className="average-header-maintext color-green">
                                    {this.state.data.previousdata.last24Hours} %
                            </div>
                                :
                                <div className="average-header-maintext color-red">{parseInt(this.state.randomObj.random1day).toFixed(0)} %</div>
                            }
                            <div className="average-header-subHeading">1 Day</div>
                        </div>

                        <div className="text-center">
                            {this.state.data.previousdata && this.state.data.previousdata.last7Days ?
                                <div className="average-header-maintext color-green">
                                    {this.state.data.previousdata.last7Days} %
                            </div>
                                :
                                <div className="average-header-maintext color-green">{parseInt(this.state.randomObj.random7days).toFixed(0)} %</div>
                            }
                            <div className="average-header-subHeading">7 Days</div>
                        </div>
                    </div>
                    {/* <a target="_blank" href="https://finstreet.in/">
                        <img style={{ width: "100%", padding: "0px 0px 20px 0px" }} src={banneradstwo} />
                    </a> */}
                </div>
            )
        }

    }

    setSort = (key) => {
        switch (key) {
            case "platform": this.setState(oldState => {
                if (oldState.sortType === "platformUp")
                    return { sortType: "platformDown" }
                return { sortType: "platformUp" }
            });
                break;
            case "price": this.setState(oldState => {
                if (oldState.sortType === "priceUp")
                    return { sortType: "priceDown" }
                return { sortType: "priceUp" }
            });
                break;
            case "commission": this.setState(oldState => {
                if (oldState.sortType === "commissionUp")
                    return { sortType: "commissionDown" }
                return { sortType: "commissionUp" }
            });
                break;
            case "netPrice": this.setState(oldState => {
                if (oldState.sortType === "netPriceUp")
                    return { sortType: "netPriceDown" }
                return { sortType: "netPriceUp" }
            });
                break;
            case "difference": this.setState(oldState => {
                if (oldState.sortType === "buy")
                    return { sortType: "sell" }
                return { sortType: "buy" }
            });
                break;
        }
    }
    render() {
        return (
            <div className={("theme-") + (this.state.isLightTheme ? "light" : "dark")}>
                <Header isLightTheme={this.state.isLightTheme} onThemeButtonClick={this.onThemeButtonClick}
                    asset={this.state.asset} currency={this.state.currency} onCurrencyClick={this.onCurrencyClick}
                    onAssetClick={this.onAssetClick} onModeChange={this.onModeChange} buyMode={this.state.buyMode}
                    countDownTimer={this.state.countDownTimer}
                />

                {this.state.data && (
                    <div className="padding-bottom-50">
                        {this._getAverageHeader()}

                        <div className="fiat-crypto-table table-responsive" style={{ margin: "0 auto" }}>
                            <table className="table table-borderless text-center">
                                <thead>
                                    <tr>
                                        <th>
                                            <h4>
                                                <span className="pointer">
                                                    #
                                                    </span>
                                            </h4>
                                        </th>
                                        <th>
                                            <h4>
                                                <span className="pointer" onClick={this.setSort.bind(null, "platform")}>
                                                    Platform
                                                    </span>
                                            </h4>
                                        </th>
                                        <th>
                                            <h4>
                                                <span className="pointer" onClick={this.setSort.bind(null, "price")}>
                                                    Last Traded Price
                                                    </span>
                                            </h4>
                                        </th>
                                        <th>
                                            <h4>
                                                <span className="pointer" onClick={this.setSort.bind(null, "commission")}>
                                                    Buy / Sell Price
                                                    </span>
                                            </h4>
                                        </th>
                                        {/* <th>
                                            <h4>
                                                <span className="pointer" onClick={this.setSort.bind(null, "netPrice")}>
                                                    Net
                                                    Price
                                                    </span>
                                            </h4>
                                        </th> */}
                                        <th>
                                            <h4>
                                                <span className="pointer" onClick={this.setSort.bind(null, "difference")}>
                                                    Difference
                                                    </span>
                                            </h4>
                                        </th>
                                        <th>
                                            <h4>
                                                <span className="pointer" onClick={this.setSort.bind(null, "difference")}>
                                                    Savings
                                                    </span>
                                            </h4>
                                        </th>
                                    </tr>
                                </thead>
                                {this._getTableBody()}
                            </table>
                        </div>
                        {/* <div className="padding-header" style={{ padding: "20px" }}>
                            <a target="_blank" href="https://www.algorand.com/futurefi/">
                                <img style={{ width: "100%" }} src={banneradsthree} />
                            </a>
                        </div> */}
                    </div>
                )}

                {!this.state.data &&
                    <div className="loader-wrapper padding-bottom-50">
                        <div className="loader" />
                    </div>
                }

                <div className="footer">
                    <Footer />
                </div>
            </div>
        )
    }
}

   