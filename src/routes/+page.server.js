import prisma from '$lib/server/prisma';

export async function load({ locals }) {
    if (!locals.user) {
        return { user: null, maps: [] };
    }

    const mapsData = await prisma.mindMap.findMany({
        where: { ownerId: locals.user.id },
        orderBy: { updatedAt: 'desc' },
        select: { id: true, title: true, updatedAt: true, content: true }
    });

    const maps = mapsData.map(map => {
        let displayTitle = map.title;
        // Try to extract central topic text
        if (map.content && typeof map.content === 'object') {
            // Assuming structure is content: { tex: "..." } or content: { root: { text: "..." } } depending on storage
            // Based on MindMapNode, it seems content IS the root node
            const root = map.content;
            if (root && root.text) {
                displayTitle = root.text;
            }
        }
        return {
            id: map.id,
            title: displayTitle,
            updatedAt: map.updatedAt
        };
    });

    return { user: locals.user, maps };
}
