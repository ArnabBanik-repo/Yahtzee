import React, { Component } from "react";
import "./RuleRow.css";

class RuleRow extends Component {
  state = {
    isDisabled: false,
  };

  handleClick = (e) => {
    this.setState((st) => ({
      isDisabled: !st.isDisabled,
    }));
    this.props.doScore();
  };

  render() {
    let cn = "RuleRow";
    this.state.isDisabled
      ? (cn += " RuleRow-disabled")
      : (cn += " RuleRow-active");
    return (
      <tr
        className={cn}
        onClick={(e) => {
          !this.state.isDisabled && this.handleClick();
        }}
      >
        <td className="RuleRow-name">{this.props.name}</td>
        <td className="RuleRow-score">
          {this.state.isDisabled ? this.props.score : this.props.desc}
        </td>
      </tr>
    );
  }
}

export default RuleRow;
