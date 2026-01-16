import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';

export async function POST({ params, request, locals }) {
    if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = params;
    const { email } = await request.json();

    const map = await prisma.mindMap.findUnique({ where: { id } });
    if (!map || map.ownerId !== locals.user.id) {
        return json({ error: 'Forbidden' }, { status: 403 });
    }

    const userToAdd = await prisma.user.findUnique({ where: { email } });
    if (!userToAdd) {
        return json({ error: 'User not found' }, { status: 404 });
    }

    if (userToAdd.id === map.ownerId) {
        return json({ error: 'Cannot add owner as collaborator' }, { status: 400 });
    }

    await prisma.mindMap.update({
        where: { id },
        data: {
            collaborators: {
                connect: { id: userToAdd.id }
            }
        }
    });

    return json({ success: true, user: userToAdd });
}

export async function DELETE({ params, request, locals }) {
    if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = params;
    const { userId } = await request.json(); // ID of user to remove

    const map = await prisma.mindMap.findUnique({ where: { id } });
    if (!map || map.ownerId !== locals.user.id) {
        return json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.mindMap.update({
        where: { id },
        data: {
            collaborators: {
                disconnect: { id: userId }
            }
        }
    });

    return json({ success: true });
}
