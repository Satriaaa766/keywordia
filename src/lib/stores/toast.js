import { writable } from 'svelte/store';

/**
 * @typedef {Object} Toast
 * @property {string} id
 * @property {string} message
 * @property {'info'|'success'|'error'|'warning'} type
 * @property {number} duration
 */

function createToastStore() {
    /** @type {import('svelte/store').Writable<Toast[]>} */
    const { subscribe, update } = writable([]);

    return {
        subscribe,
        /**
         * Add a new toast notification
         * @param {string} message 
         * @param {'info'|'success'|'error'|'warning'} type 
         * @param {number} duration 
         */
        add: (message, type = 'info', duration = 3000) => {
            const id = crypto.randomUUID();
            update((toasts) => [...toasts, { id, message, type, duration }]);

            if (duration > 0) {
                setTimeout(() => {
                    update((toasts) => toasts.filter((t) => t.id !== id));
                }, duration);
            }
        },
        /**
         * Remove a toast by id
         * @param {string} id 
         */
        remove: (id) => {
            update((toasts) => toasts.filter((t) => t.id !== id));
        }
    };
}

export const toasts = createToastStore();
