import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';

export async function GET({ params, locals }) {
    const { id } = params;

    const map = await prisma.mindMap.findUnique({
        where: { id },
    });

    if (!map) {
        return json({ error: 'Not found' }, { status: 404 });
    }

    // Allow if owner or public (or just allow all for guests)
    // if (map.ownerId !== locals.user?.id && !map.isPublic) {
    //    return json({ error: 'Unauthorized' }, { status: 403 });
    // }

    const isOwner = map.ownerId === locals.user?.id;

    return json({ map, isReadOnly: !isOwner });
}

export async function PUT({ params, request, locals }) {
    if (!locals.user) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { content, title, isPublic } = await request.json();

    const map = await prisma.mindMap.findUnique({ where: { id } });

    if (!map || map.ownerId !== locals.user.id) {
        return json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedMap = await prisma.mindMap.update({
        where: { id },
        data: {
            content: content !== undefined ? content : undefined,
            title: title !== undefined ? title : undefined,
            isPublic: isPublic !== undefined ? isPublic : undefined,
        },
    });

    return json({ map: updatedMap });
}
