import React, { Component } from "react";
import "./Die.css";

class Die extends Component {
  value() {
    return this.props.val === 1
      ? "one"
      : this.props.val === 2
      ? "two"
      : this.props.val === 3
      ? "three"
      : this.props.val === 4
      ? "four"
      : this.props.val === 5
      ? "five"
      : this.props.val === 6
      ? "six"
      : null;
  }

  render() {
    return (
      <button
        className={
          this.props.locked
            ? `Die fas fa-dice-${this.value()} Die-locked`
            : this.props.isRolling
            ? `Die Die-rolling fas fa-dice-${this.value()}`
            : `Die fas fa-dice-${this.value()}`
        }
        onClick={() => {
          this.props.isRolling ? null : this.props.handleClick(this.props.idx);
        }}
      ></button>
    );
  }
}

export default Die;
