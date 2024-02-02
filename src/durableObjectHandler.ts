import { Hono } from 'hono'
import { CounterValueState } from './counter'

export class DurableObjectHandler {
  stateHandler: CounterValueState
  app: Hono = new Hono()

  constructor(state: DurableObjectState) {
    this.stateHandler = new CounterValueState(state)

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