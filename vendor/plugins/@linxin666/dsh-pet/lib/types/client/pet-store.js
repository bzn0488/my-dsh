/**
 * Browser-side pet store: the pet state snapshot plus transient UI feedback
 * (reaction bubbles), written only through the store's audit actions. The
 * RPC polling and interactions live in the plugin apply body; components
 * only ever read snapshots.
 * @module @linxin666/dsh-pet/client/pet-store
 */
import { defineStore } from '@deepseek-ai/dsh-client-runtime/client';
/** Create the pet store handle (apply world only; never module-level). */
export function createPetStore() {
    return defineStore({
        init: () => ({
            snapshot: null,
            state: 'loading',
            error: null,
            feedback: null,
        }),
        actions: {
            setSnapshot: (draft, snapshot) => {
                draft.snapshot = snapshot;
                draft.state = 'ready';
                draft.error = null;
            },
            setState: (draft, state, error) => {
                draft.state = state;
                draft.error = error;
            },
            setFeedback: (draft, feedback) => {
                draft.feedback = feedback;
            },
        },
    });
}
