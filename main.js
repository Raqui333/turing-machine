class TuringMachine {
  MAX_INTERACTIONS = 1000;

  constructor(tape, program) {
    this.tape = tape;
    this.head = program.initState;
    this.state = program.states['s0'];
    this.states = program.states;
  }

  move(direction) {
    switch (direction) {
      case 'R':
        ++this.head;
        break;
      case 'L':
        --this.head;
      default:
        break;
    }
  }

  test(state) {
    if (this.tape[this.head] === state.read) {
      this.execute(state.accept);
      return 'accepted';
    }

    if (state.reject === 'halt') return 'halt';

    this.execute(state.reject);
    return 'rejected';
  }

  execute(action) {
    this.tape[this.head] = action.write;
    this.move(action.move);
    this.state = this.states[action.goto];
  }

  run() {
    let result = 'none';
    let interaction = 0; // prevent infinite loop

    while (interaction < this.MAX_INTERACTIONS) {
      result = this.test(this.state);

      if (result === 'accepted' && interaction === this.tape.length) break;

      if (result === 'halt') {
        result = 'rejected';
        break;
      }

      ++interaction;
    }

    return interaction === this.MAX_INTERACTIONS ? 'loop' : result;
  }
}

const program = {
  initState: 0,
  states: {
    s0: {
      read: 'B',
      accept: { write: 'B', move: 'R', goto: 's1' },
      reject: 'halt',
    },
    s1: {
      read: 'A',
      accept: { write: 'A', move: 'R', goto: 's2' },
      reject: 'halt',
    },
    s2: {
      read: 'B',
      accept: { write: 'B', move: 'R', goto: 's1' },
      reject: { write: 'A', move: 'L', goto: 's1' },
    },
  },
};

const tapes = [
  ['B', 'A', 'B', 'A', 'B', 'A'],
  ['A', 'B', 'B', 'A', 'B', 'B'],
  ['A', 'B', 'A', 'A', 'B', 'A'],
  ['B', 'A', 'B', 'A', 'A', 'B'],
];

tapes.forEach((tape) => {
  const Machine = new TuringMachine(tape, program);

  // accepted
  // rejected
  // rejected
  // loop

  console.log(Machine.run());
});
