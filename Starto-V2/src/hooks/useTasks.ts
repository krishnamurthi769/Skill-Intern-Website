import { useQuery } from "@tanstack/react-query";

interface Task {
    id: string;
    title: string;
    description: string;
    budget: number;
    category: string;
    duration: string;
    startup: {
        id: string;
        name: string;
        valuation: number;
    };
    createdAt: string;
}

export function useTasks(search = "", category = "", myTasks = false) {
    return useQuery({
        queryKey: ["tasks", search, category, myTasks],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (search) params.append("search", search);
            if (category) params.append("category", category);
            if (myTasks) params.append("myTasks", "true");

            const res = await fetch(`/api/tasks?${params.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch tasks");

            // The API returns { tasks: ... }
            const data = await res.json();
            return { items: data.tasks as Task[] };
        }
    });
}

export function useTask(id: string) {
    return useQuery({
        queryKey: ["task", id],
        queryFn: async () => {
            const res = await fetch(`/api/tasks/${id}`);
            if (!res.ok) throw new Error("Failed to fetch task");
            const data = await res.json();
            return data.task as Task & { proposals: any[] };
        },
        enabled: !!id
    });
}
