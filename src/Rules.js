/** Rule for Yahtzee scoring.
 *
 * This is an "abstract class"; the real rules are subclasses of these.
 * This stores all parameters passed into it as properties on the instance
 * (to simplify child classes so they don't need constructors of their own).
 *
 * It contains useful functions for summing, counting values, and counting
 * frequencies of dice. These are used by subclassed rules.
 */

class Rule {
  constructor(params) {
    // put all properties in params on instance
    Object.assign(this, params);
  }

  sum(dice) {
    // sum of all dice
    return dice.reduce((prev, curr) => prev + curr);
  }

  freq(dice) {
    // frequencies of dice values
    const freqs = new Map();
    for (let d of dice) freqs.set(d, (freqs.get(d) || 0) + 1);
    return Array.from(freqs.values());
  }

  count(dice, val) {
    // # times val appears in dice
    return dice.filter((d) => d === val).length;
  }
}

/** Given a sought-for val, return sum of dice of that val.
 *
 * Used for rules like "sum of all ones"
 */

class TotalOneNumber extends Rule {
  evalRoll = (dice) => {
    return this.val * this.count(dice, this.val);
  };
  desc = `Score ${this.val} for every ${this.val}`;
}

/** Given a required # of same dice, return sum of all dice.
 *
 * Used for rules like "sum of all dice when there is a 3-of-kind"
 */

class SumDistro extends Rule {
  evalRoll = (dice) => {
    // do any of the counts meet of exceed this distro?
    return this.freq(dice).some((c) => c >= this.count) ? this.sum(dice) : 0;
  };
  desc =
    this.count !== 0
      ? `Sum all dice if ${this.count} are same`
      : `Sum of all dice`;
}

/** Check if full house (3-of-kind and 2-of-kind) */

class FullHouse extends Rule {
  // TODO
  evalRoll = (dice) => {
    const x = this.freq(dice).sort();
    return x[0] === 2 && x[1] === 3 ? 25 : 0;
  };
  desc = `25 points for a full house`;
}

/** Check for small straights. */

class SmallStraight extends Rule {
  // TODO
  evalRoll = (dice) => {
    dice.sort();
    dice = new Set(dice);
    dice = Array.from(dice);
    const s1 = dice[0] + dice[1] + dice[2] + dice[3];
    const s2 = dice[1] + dice[2] + dice[3] + dice[4];
    return s1 === 10 ||
      s1 === 14 ||
      s1 === 18 ||
      s2 === 10 ||
      s2 === 14 ||
      s2 === 18
      ? 30
      : 0;
  };
  desc = `30 points for a small straight`;
}

/** Check for large straights. */

class LargeStraight extends Rule {
  evalRoll = (dice) => {
    const d = new Set(dice);

    // large straight must be 5 different dice & only one can be a 1 or a 6
    return d.size === 5 && (!d.has(1) || !d.has(6)) ? this.score : 0;
  };
  desc = `40 points for a large straight`;
}

/** Check if all dice are same. */

class Yahtzee extends Rule {
  evalRoll = (dice) => {
    // all dice must be the same
    return this.freq(dice)[0] === 5 ? this.score : 0;
  };
  desc = `50 points for yahtzee`;
}

// ones, twos, etc score as sum of that value
const ones = new TotalOneNumber({ val: 1 });
const twos = new TotalOneNumber({ val: 2 });
const threes = new TotalOneNumber({ val: 3 });
const fours = new TotalOneNumber({ val: 4 });
const fives = new TotalOneNumber({ val: 5 });
const sixes = new TotalOneNumber({ val: 6 });

// three/four of kind score as sum of all dice
const threeOfKind = new SumDistro({ count: 3 });
const fourOfKind = new SumDistro({ count: 4 });

// full house scores as flat 25
const fullHouse = new FullHouse();

// small/large straights score as 30/40
const smallStraight = new SmallStraight();
const largeStraight = new LargeStraight({ score: 40 });

// yahtzee scores as 50
const yahtzee = new Yahtzee({ score: 50 });

// for chance, can view as some of all dice, requiring at least 0 of a kind
const chance = new SumDistro({ count: 0 });

export {
  ones,
  twos,
  threes,
  fours,
  fives,
  sixes,
  threeOfKind,
  fourOfKind,
  fullHouse,
  smallStraight,
  largeStraight,
  yahtzee,
  chance,
};
