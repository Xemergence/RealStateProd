import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/supabase/supabase";
import { useAuth } from "@/supabase/auth";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  assignee?: {
    name: string;
    avatar: string;
  };
  property_id?: string | null;
}

interface TaskBoardProps {
  tasks?: Task[];
  onTaskMove?: (taskId: string, newStatus: Task["status"]) => void;
  onTaskClick?: (task: Task) => void;
  isLoading?: boolean;
}

const defaultTasks: Task[] = [
  {
    id: "1",
    title: "Design System Updates",
    description: "Update component library with new design tokens",
    status: "todo",
    assignee: {
      name: "Alice Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    },
  },
  {
    id: "2",
    title: "API Integration",
    description: "Integrate new backend endpoints",
    status: "in-progress",
    assignee: {
      name: "Bob Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    },
  },
  {
    id: "3",
    title: "User Testing",
    description: "Conduct user testing sessions",
    status: "done",
    assignee: {
      name: "Carol Williams",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol",
    },
  },
];

const TaskBoard = ({
  tasks,
  onTaskMove = () => {},
  onTaskClick = () => {},
  isLoading = false,
}: TaskBoardProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(isLoading);
  const [internalTasks, setInternalTasks] = useState<Task[]>(tasks ?? []);
  const [propertyIds, setPropertyIds] = useState<string[]>([]);

  const columns = [
    {
      id: "todo",
      title: "To Do",
      color: "bg-gray-50",
      borderColor: "border-gray-200",
    },
    {
      id: "in-progress",
      title: "In Progress",
      color: "bg-blue-50",
      borderColor: "border-blue-100",
    },
    {
      id: "done",
      title: "Done",
      color: "bg-green-50",
      borderColor: "border-green-100",
    },
  ];

  const fetchMemberships = async (userId: string) => {
    const { data, error } = await supabase
      .from("property_members")
      .select("property_id")
      .eq("user_id", userId);
    if (error) return [] as string[];
    return (data || []).map((m: any) => m.property_id as string);
  };

  const fetchTasks = async (u: string | null, pids: string[]) => {
    if (!u) return [] as Task[];
    // Prefer property-scoped tasks; fallback to tasks assigned to the user
    if (pids.length > 0) {
      const { data, error } = await supabase
        .from("tasks")
        .select("id, title, description, status, assignee_user_id, property_id")
        .in("property_id", pids)
        .order("created_at", { ascending: false });
      if (error) return [] as Task[];
      return (data || []).map((t: any) => ({
        id: t.id,
        title: t.title,
        description: t.description || "",
        status: (t.status as Task["status"]) || "todo",
        property_id: t.property_id,
      }));
    } else {
      const { data, error } = await supabase
        .from("tasks")
        .select("id, title, description, status, assignee_user_id, property_id")
        .eq("assignee_user_id", u)
        .order("created_at", { ascending: false });
      if (error) return [] as Task[];
      return (data || []).map((t: any) => ({
        id: t.id,
        title: t.title,
        description: t.description || "",
        status: (t.status as Task["status"]) || "todo",
        property_id: t.property_id,
      }));
    }
  };

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        if (user?.id) {
          const pids = await fetchMemberships(user.id);
          if (!cancelled) setPropertyIds(pids);
          const dbTasks = await fetchTasks(user.id, pids);
          if (!cancelled) setInternalTasks(dbTasks.length ? dbTasks : []);
        } else {
          if (!cancelled) setInternalTasks([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, status: Task["status"]) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    // Update locally
    setInternalTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t)),
    );
    onTaskMove(taskId, status);
    // Persist
    await supabase.from("tasks").update({ status }).eq("id", taskId);
  };

  const handleAddTask = async () => {
    if (!user?.id) return;
    const title = window.prompt("Task title");
    if (!title) return;
    const description = window.prompt("Task description (optional)") || "";
    const pid = propertyIds[0] || null;
    const { data, error } = await supabase
      .from("tasks")
      .insert({
        title,
        description,
        status: "todo",
        assignee_user_id: user.id,
        property_id: pid,
      })
      .select()
      .single();
    if (error) return;
    const newTask: Task = {
      id: data.id,
      title: data.title,
      description: data.description || "",
      status: (data.status as Task["status"]) || "todo",
      property_id: data.property_id,
    };
    setInternalTasks((prev) => [newTask, ...prev]);
  };

  if (loading) {
    return (
      <div className="w-full h-full bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Task Board</h2>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 h-9 shadow-sm transition-colors opacity-50 cursor-not-allowed">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-6 h-[calc(100%-4rem)]">
          {columns.map((column) => (
            <div
              key={column.id}
              className={`${column.color} rounded-xl p-4 border ${column.borderColor}`}
            >
              <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                <span
                  className={`h-2 w-2 rounded-full mr-2 ${column.id === "todo" ? "bg-gray-400" : column.id === "in-progress" ? "bg-blue-400" : "bg-green-400"}`}
                ></span>
                {column.title}
              </h3>
              <div className="space-y-3 flex flex-col items-center justify-center min-h-[200px]">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full border-4 border-gray-100 border-t-blue-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-blue-500/20 animate-pulse" />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-500 mt-3">
                  Loading tasks...
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const visibleTasks = internalTasks.length
    ? internalTasks
    : (tasks ?? defaultTasks);

  return (
    <div className="w-full h-full bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Task Board</h2>
        <Button
          onClick={handleAddTask}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 h-9 shadow-sm transition-colors"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6 h-[calc(100%-4rem)]">
        {columns.map((column) => (
          <div
            key={column.id}
            className={`${column.color} rounded-xl p-4 border ${column.borderColor}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id as Task["status"])}
          >
            <h3 className="font-medium text-gray-900 mb-4 flex items-center">
              <span
                className={`h-2 w-2 rounded-full mr-2 ${column.id === "todo" ? "bg-gray-400" : column.id === "in-progress" ? "bg-blue-400" : "bg-green-400"}`}
              ></span>
              {column.title}
            </h3>
            <div className="space-y-3 min-h-[200px]">
              {visibleTasks.filter((task) => task.status === column.id)
                .length === 0 ? (
                <div className="text-sm text-gray-500 italic">
                  No tasks here yet
                </div>
              ) : null}
              {visibleTasks
                .filter((task) => task.status === column.id)
                .map((task) => (
                  <motion.div
                    key={task.id}
                    layoutId={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e as any, task.id)}
                    onClick={() => onTaskClick(task)}
                  >
                    <Card className="p-4 cursor-pointer hover:shadow-md transition-all duration-200 rounded-xl border-0 bg-white shadow-sm">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {task.title}
                      </h4>
                      {task.description ? (
                        <p className="text-sm text-gray-600 mb-3">
                          {task.description}
                        </p>
                      ) : null}
                      {task.assignee && (
                        <div className="flex items-center mt-3 pt-3 border-t border-gray-100">
                          <img
                            src={task.assignee.avatar}
                            alt={task.assignee.name}
                            className="w-7 h-7 rounded-full mr-2 border border-white shadow-sm"
                          />
                          <span className="text-sm text-gray-700 font-medium">
                            {task.assignee.name}
                          </span>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;
