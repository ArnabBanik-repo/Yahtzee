import React, { Component } from "react";
import Dice from "./Dice";
import ScoreTable from "./ScoreTable";
import "./Game.css";

const NUM_DICE = 5;
const NUM_ROLLS = 2;

class Game extends Component {
  constructor(props) {
    super(props);
    const d = [];
    for (let i = 0; i < NUM_DICE; i++)
      d.push(Math.floor(Math.random() * 6) + 1);
    this.state = {
      dice: d,
      locked: Array(NUM_DICE).fill(false),
      rollsLeft: NUM_ROLLS,
      scores: {
        ones: undefined,
        twos: undefined,
        threes: undefined,
        fours: undefined,
        fives: undefined,
        sixes: undefined,
        threeOfKind: undefined,
        fourOfKind: undefined,
        fullHouse: undefined,
        smallStraight: undefined,
        largeStraight: undefined,
        yahtzee: undefined,
        chance: undefined,
      },
      isRolling: false,
      score: 0,
      plays: 0,
      over: false,
    };
    this.roll = this.roll.bind(this);
    this.doScore = this.doScore.bind(this);
  }

  restart = () => {
    window.location = "/";
  };

  roll(evt) {
    // roll dice whose indexes are in reroll
    this.setState((st) => ({
      dice: st.dice.map((d, i) =>
        st.locked[i] ? d : Math.ceil(Math.random() * 6)
      ),
      // locked: st.rollsLeft > 1 ? st.locked : Array(NUM_DICE).fill(true),
      rollsLeft: st.rollsLeft - 1,
      isRolling: true,
    }));
    setTimeout(() => {
      this.setState({
        isRolling: false,
      });
    }, 1000);
  }

  toggleLocked = (idx) => {
    // toggle whether idx is in locked or not
    this.setState((st) => ({
      locked: [
        ...st.locked.slice(0, idx),
        !st.locked[idx],
        ...st.locked.slice(idx + 1),
      ],
    }));
  };

  async doScore(rulename, ruleFn) {
    // evaluate this ruleFn with the dice and score this rulename
    await this.setState((st) => ({
      scores: { ...st.scores, [rulename]: ruleFn(this.state.dice) },
      rollsLeft: NUM_ROLLS,
      locked: Array(NUM_DICE).fill(false),
      score: (st.score += ruleFn(this.state.dice)),
      plays: (st.plays += 1),
    }));
    this.state.plays === 13 ? this.setState({ over: true }) : this.roll();
  }

  render() {
    return (
      <div className="Game">
        <header className="Game-header">
          <h1 className="App-title">Yahtzee!</h1>

          <section className="Game-dice-section">
            <Dice
              dice={this.state.dice}
              locked={this.state.locked}
              handleClick={this.toggleLocked}
              isRolling={this.state.isRolling}
            />
            <div className="Game-button-wrapper">
              <button
                className="Game-reroll"
                disabled={this.state.rollsLeft <= 0}
                onClick={() => {
                  this.state.over ? this.restart() : this.roll();
                }}
              >
                {this.state.over
                  ? `Restart`
                  : `${this.state.rollsLeft} Rerolls Left`}
              </button>
            </div>
          </section>
        </header>
        <ScoreTable doScore={this.doScore} scores={this.state.scores} />
        <p>Score: {this.state.score}</p>
      </div>
    );
  }
}

export default Game;
