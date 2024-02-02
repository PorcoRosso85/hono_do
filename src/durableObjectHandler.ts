import { Hono } from 'hono'
import { CounterValueState } from './counter'

export class DurableObjectHandler {
  counterValueState: CounterValueState
  app: Hono = new Hono()

  constructor() {
    this.counterValueState = new CounterValueState(this.app, undefined,)

  }

  async fetch(request: Request) {
    return this.app.fetch(request)
  }
}