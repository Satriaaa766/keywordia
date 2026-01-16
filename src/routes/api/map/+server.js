import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';

export async function GET({ locals }) {
    if (!locals.user) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const maps = await prisma.mindMap.findMany({
        where: { ownerId: locals.user.id },
        orderBy: { updatedAt: 'desc' },
        select: { id: true, title: true, updatedAt: true, isPublic: true } // Don't fetch content for list
    });

    return json({ maps });
}

export async function POST({ request, locals }) {
    if (!locals.user) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title } = await request.json();

    const newMap = await prisma.mindMap.create({
        data: {
            title: title || 'Untitled Map',
            ownerId: locals.user.id,
            content: { id: 'root', text: 'Central Topic', children: [] },
        },
    });

    return json({ map: newMap });
}
