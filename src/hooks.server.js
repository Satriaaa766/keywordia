import { verifySession } from '$lib/server/auth';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    const token = event.cookies.get('session');

    if (token) {
        const user = verifySession(token);
        if (user) {
            event.locals.user = user;
        }
    }

    const response = await resolve(event);
    return response;
}
