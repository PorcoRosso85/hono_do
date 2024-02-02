import { describe, test, expect } from "vitest";
import fc from 'fast-check'
import { CounterValueState } from "./counter";
import path from "path";

const filePath = path.resolve(__dirname, "counter.ts");
describe(`${filePath} - StateHandler`, () => {
    test("initializeState", async () => {
        let state: DurableObjectState
        const stateHandler = new CounterValueState();
        // await stateHandler.initializeState();
        expect(stateHandler.value).toBe(0);
    })

    test("increment", async () => {
        let state: DurableObjectState
        const stateHandler = new CounterValueState();
        // await stateHandler.initializeState();
        const currentValue = await stateHandler.increment();
        expect(currentValue).toBe(1);
    })

    test("decrement", async () => {
        let state: DurableObjectState
        const stateHandler = new CounterValueState();
        // await stateHandler.initializeState();
        const currentValue = await stateHandler.decrement();
        expect(currentValue).toBe(-1);
    })

    let stateHandler: CounterValueState;
    stateHandler = new CounterValueState();
    test("initializeState", async () => {
        // await stateHandler.initializeState();
        expect(stateHandler.value).toBe(0);
    })
    test("increment", async () => {
        const currentValue = await stateHandler.increment();
        expect(currentValue).toBe(1);
    })
    test("decrement", async () => {
        const currentValue = await stateHandler.decrement();
        expect(currentValue).toBe(0);
    })


    test.skip('CounterValueState increment and decrement', async ({ expect }) => {
        await fc.assert(
            fc.asyncProperty(fc.integer(), async (n) => {
                const stateHandler = new CounterValueState()
                for (let i = 0; i < n; i++) {
                    await stateHandler.increment()
                }
                for (let i = 0; i < n; i++) {
                    await stateHandler.decrement()
                }
                expect(stateHandler.value).toBe(0)
            })
        )
    })
})