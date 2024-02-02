import { Hono } from 'hono'

export class CounterValueState {
  state: DurableObjectState
  value = 0
  app: Hono

  constructor(app?: Hono, state?: DurableObjectState,) {
    this.state = state || ({} as DurableObjectState)
    // [] stateのイニシャライズ
    // this.initializeState()
    this.app = app || new Hono()

    this.app
      .get('/increment', async (c) => {
        const currentValue = await this.increment()
        return c.text(currentValue.toString())
      })

      .get('/decrement', async (c) => {
        const currentValue = await this.decrement()
        return c.text(currentValue.toString())
      })

      .get('/', async (c) => {
        return c.text(this.value.toString())
      })
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