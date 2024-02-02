export class CounterValueState {
  state: DurableObjectState
  value: number = 0

  constructor(state?: DurableObjectState) {
    this.state = state || ({} as DurableObjectState)
    // [] stateのイニシャライズ
    // this.initializeState()
  }

  async initializeState() {
    await this.state.blockConcurrencyWhile(async () => {
      const stored = await this.state.storage?.get<number>('value')
      this.value = stored || 0
    })
  }

  async increment() {
    const currentValue = ++this.value
    await this.state.storage?.put('value', this.value)
    return currentValue
  }

  async decrement() {
    const currentValue = --this.value
    await this.state.storage?.put('value', this.value)
    return currentValue
  }
}