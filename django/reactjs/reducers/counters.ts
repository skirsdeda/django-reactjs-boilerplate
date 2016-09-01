import * as sampleActions from "../actions/counterActions"
import * as _ from "lodash"
import { Action } from "redux"

const initialState = {
  clicks: 0,
}

export default function submissions(state=initialState, action: Action) {
  switch (action.type) {
    case sampleActions.INCREASE:
      return _.assign({}, state, {clicks: state.clicks + 1})
    default:
      return state
    }
}
