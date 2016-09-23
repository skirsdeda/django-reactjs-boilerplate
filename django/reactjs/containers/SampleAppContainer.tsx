import * as React from "react";

import { connect } from "react-redux";
import * as CSSModules from "react-css-modules";

import * as counterActions from "../actions/counterActions";
import Headline from "../components/Headline";
const styles = require("./SampleAppContainer.css") as any;


export interface CounterProps {
  clicks: number;
  onClick();
}

const mapStateToProps = (state) => {
  return {
    clicks: state.counters.clicks,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onClick: () => {
      dispatch(counterActions.increaseCounter());
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(styles)
export default class SampleAppContainer extends React.Component<CounterProps, {}> {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <Headline>Sample App!</Headline>
            <div styleName="button" onClick={this.props.onClick}>INCREASE</div>
            <p styleName="counter">{this.props.clicks}</p>
          </div>
        </div>
      </div>
    )
  }
}
