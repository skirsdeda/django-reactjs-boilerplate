import * as React from "react"
import * as Radium from "radium"

import { connect } from "react-redux"

import * as counterActions from "../actions/counterActions"
import Headline from "../components/Headline"

const styles = {
  button: {
    cursor: "pointer",
  },
  counter: {
    color: "blue",
    fontSize: "20px",
  }
}

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
@Radium
export default class SampleAppContainer extends React.Component<CounterProps, {}> {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <Headline>Sample App!</Headline>
            <div style={[styles.button]} onClick={this.props.onClick}>INCREASE</div>
            <p style={[styles.counter]}>{this.props.clicks}</p>
          </div>
        </div>
      </div>
    )
  }
}
