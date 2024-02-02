import { Hono } from 'hono'

class StateHandler {
  state: DurableObjectState
  value: number = 0

  constructor(state: DurableObjectState) {
    this.state = state
    this.initializeState()
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

export class Counter {
  stateHandler: StateHandler
  app: Hono = new Hono()

  constructor(state: DurableObjectState) {
    this.stateHandler = new StateHandler(state)

    this.app
      .get('/increment', async (c) => {
        const currentValue = await this.stateHandler.increment()
        return c.text(currentValue.toString())
      })

      .get('/decrement', async (c) => {
        const currentValue = await this.stateHandler.decrement()
        return c.text(currentValue.toString())
      })

      .get('/', async (c) => {
        return c.text(this.stateHandler.value.toString())
      })
  }

  async fetch(request: Request) {
    return this.app.fetch(request)
  }
}