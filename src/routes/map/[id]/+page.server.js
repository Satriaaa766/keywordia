import prisma from '$lib/server/prisma';
import { error } from '@sveltejs/kit';

export async function load({ params, locals }) {
    const map = await prisma.mindMap.findUnique({
        where: { id: params.id }
    });

    if (!map) throw error(404, 'Map not found');

    const isOwner = locals.user && map.ownerId === locals.user.id;

    // Allow access to everyone with the link (read-only for non-owners)
    // if (!map.isPublic && !isOwner) {
    //    throw error(403, 'Unauthorized');
    // }

    return {
        map,
        user: locals.user,
        isReadOnly: !isOwner
    };
}
