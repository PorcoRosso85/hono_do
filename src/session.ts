import { SessionStore } from '../../infrastructure/src/session'

export class SessionValueState {
    state: DurableObjectState
    sessionStore: SessionStore

    constructor(state?: DurableObjectState) {
        this.state = state || ({} as DurableObjectState)
        // this.initializeState()
    }

    async initializeState() {
        const stored = await this.state.storage?.get<SessionStore>('sessionStore')
        // [] 型の握りつぶし
        this.sessionStore = stored || {} as SessionStore
    }

    async addSession(sessionId: string, sessionData: SessionStore['sessionData']) {
        this.sessionStore = {
            sessionId,
            sessionData
        }
        await this.state.storage?.put('sessionStore', this.sessionStore)
    }
}