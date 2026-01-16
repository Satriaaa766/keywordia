import { writable, get } from 'svelte/store';

export const mindMap = writable({
    id: 'root',
    text: 'Central Topic',
    children: []
});

export const isReadOnly = writable(false);
export const layout = writable('top-down'); // 'top-down' or 'left-to-right'
export const focusedNodeId = writable(null); // Track node to auto-focus

// Theme based on OS preference
export const theme = writable('light');
if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = (e) => {
        const newTheme = e.matches ? 'dark' : 'light';
        theme.set(newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };
    updateTheme(mediaQuery); // Initial set
    mediaQuery.addEventListener('change', updateTheme);
}

// Helper to find and update a node in the tree
const updateNodeRecursive = (node, id, updater) => {
    if (node.id === id) {
        return updater(node);
    }
    if (node.children) {
        return {
            ...node,
            children: node.children.map(child => updateNodeRecursive(child, id, updater))
        };
    }
    return node;
};

// Helper to add a child
const addChildRecursive = (node, parentId, newChild) => {
    if (node.id === parentId) {
        return {
            ...node,
            children: [...(node.children || []), newChild]
        };
    }
    if (node.children) {
        return {
            ...node,
            children: node.children.map(child => addChildRecursive(child, parentId, newChild))
        };
    }
    return node;
};

export const updateNodeText = (id, text) => {
    mindMap.update(tree => updateNodeRecursive(tree, id, n => ({ ...n, text })));
};

export const addChild = (parentId) => {
    const id = crypto.randomUUID();
    const newChild = { id, text: 'New Node', children: [] };
    mindMap.update(tree => addChildRecursive(tree, parentId, newChild));
    focusedNodeId.set(id); // Set focus to the new node
};

export const setMap = (data) => {
    mindMap.set(data);
}
