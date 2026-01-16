import { json } from "@sveltejs/kit";
import prisma from "$lib/server/prisma";

export async function PUT({ params, request, locals }) {
    if (!locals.user) {
        return json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const { isEditable } = await request.json();

    const map = await prisma.mindMap.findUnique({
        where: { id },
    });

    if (!map) {
        return json({ error: "Map not found" }, { status: 404 });
    }

    if (map.ownerId !== locals.user.id) {
        return json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedMap = await prisma.mindMap.update({
        where: { id },
        data: { isEditable },
    });

    return json(updatedMap);
}
