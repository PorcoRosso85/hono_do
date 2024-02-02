import { Hono } from 'hono'
export { DurableObjectHandler } from './durableObjectHandler'

type Bindings = {
  DO: DurableObjectNamespace

}

const app = new Hono<{ Bindings: Bindings }>()

app.get('*', async (c) => {
  const id = c.env.DO.idFromName('A')
  const obj = c.env.DO.get(id)
  const resp = await obj.fetch(c.req.url)

  if (resp.status === 404) {
    return c.text('404 Not Found', 404)
  }

  const count = parseInt(await resp.text())
  return c.text(`Count is ${count}`)
})

export default app
