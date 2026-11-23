export class StateMachine {
  constructor(initialState, owner) {
    this.state = initialState;
    this.owner = owner;
  }

  update(context) {
    const state = this.state;
    const enter = context[state]?.enter;
    const execute = context[state]?.execute;
    const exit = context[state]?.exit;

    if (this.pendingState && this.pendingState !== state) {
      exit?.(this.owner);
      this.state = this.pendingState;
      this.pendingState = null;
      context[this.state]?.enter?.(this.owner);
    }

    context[this.state]?.execute?.(this.owner);
  }

  transitionTo(stateName) {
    if (stateName !== this.state) {
      this.pendingState = stateName;
    } else {
      this.pendingState = null;
    }
  }
}
