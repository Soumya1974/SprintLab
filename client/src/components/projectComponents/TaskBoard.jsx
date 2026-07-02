import { useState } from "react";
import {
  MoreHorizontal,
  Plus,
  CheckCircle2,
  Circle,
} from "lucide-react";

import { restrictToWindowEdges, snapCenterToCursor } from "@dnd-kit/modifiers";

import {
  DndContext,
  useDraggable,
  useDroppable,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import useWorkspaceStore from "../../store/workspaceStore";

const PRIORITY_STYLES = {
  High: "bg-rose-50 text-rose-600",
  Medium: "bg-amber-50 text-amber-600",
  Low: "bg-emerald-50 text-emerald-600",
};

const AVATAR_COLORS = [
  "bg-blue-400",
  "bg-violet-400",
  "bg-emerald-400",
  "bg-amber-400",
  "bg-rose-400",
];

const INITIAL_TASKS = [
  { id: 1, title: "Research & Analysis", date: "May 25", priority: "High", status: "tasks" },
  { id: 2, title: "Create Wireframes", date: "May 27", priority: "Medium", status: "tasks" },
  { id: 3, title: "Competitor Review", date: "May 30", priority: "Low", status: "tasks" },
  { id: 4, title: "Competitor Review", date: "May 30", priority: "Low", status: "tasks" },
  { id: 5, title: "UI/UX Design", date: "May 24", priority: "High", status: "done" },
  { id: 6, title: "Develop Homepage", date: "May 26", priority: "Medium", status: "done" },
  { id: 7, title: "API Integration", date: "May 28", priority: "High", status: "done" },
  { id: 8, title: "API Integration", date: "May 28", priority: "High", status: "done" },
];

function TaskCard({ task, isOverlay = false }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id, data: task });

  const style = transform
    ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    }
    : undefined;

  const done = task.status === "done";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}

      // touch-none is the key fix: without it, mobile browsers treat the
      // gesture as a page-scroll and dnd-kit never sees it as a drag.

      className={`group touch-none select-none bg-white border border-slate-200 rounded-md p-3 shadow-sm hover:border-slate-300 hover:shadow-md transition-all duration-150 cursor-grab active:cursor-grabbing ${isDragging && !isOverlay ? "opacity-30" : ""
        } ${isOverlay ? "shadow-lg rotate-2" : ""}`}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-slate-800 leading-snug pr-2">
          {task.title}
        </p>
        {!done && (
          <button
            aria-label="Task options"
            onPointerDown={(e) => e.stopPropagation()}
            className="text-slate-300 hover:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div
          className={`h-6 w-6 rounded-full ${AVATAR_COLORS[task.id % AVATAR_COLORS.length]
            } shrink-0`}
        />
        {done ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        ) : (
          <span
            className={`text-[11px] font-medium px-2 py-1 rounded-md ${PRIORITY_STYLES[task.priority]}`}
          >
            {task.priority}
          </span>
        )}
      </div>

      <p className="text-xs text-slate-400 mt-2">{task.date}</p>
    </div>
  );
}

function Column({ id, title, dot, icon: Icon, count, tasks, children }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex flex-col flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-3">
        {Icon ? (
          <Icon className="h-4 w-4 text-slate-400" />
        ) : (
          <span className={`h-2 w-2 rounded-full ${dot}`} />
        )}
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
        <span className="text-xs text-slate-400 bg-slate-100 rounded-full px-1.5 py-0.5">
          {count}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2.5 min-h-30 rounded-xl p-2 -m-2 transition-colors duration-150 ${isOver ? "bg-blue-50/60 ring-2 ring-blue-200 ring-inset" : ""
          }`}
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {children}
      </div>
    </div>
  );
}

export default function TaskBoard() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [activeTask, setActiveTask] = useState(null);

  const setTaskForm = useWorkspaceStore((state) => state.setTaskForm);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 8 },
    })
  );

  const todoTasks = tasks.filter((t) => t.status === "tasks");
  const doneTasks = tasks.filter((t) => t.status === "done");

  function handleDragStart(event) {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const newStatus = over.id; // "tasks" or "done"
    setTasks((prev) =>
      prev.map((t) => (t.id === active.id ? { ...t, status: newStatus } : t))
    );
  }

  return (
    <div className="bg-gray-200 animate-fade-in-up  border border-slate-200 rounded-sm p-4 overflow-y-scroll h-120 md:h-175 scrollbar-hide">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5 rounded-md">
        <h2 className="text-base font-semibold text-slate-800">
          Tasks Overview
        </h2>

        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:scale-95 px-3.5 py-2 rounded-lg hover:cursor-pointer transition-all duration-150"
            onClick={() => setTaskForm(true)}
          >
            <Plus className="h-4 w-4" />
            Add Task
          </button>
        </div>
      </div>

      <DndContext
        // snapCenterToCursor keeps the overlay centered exactly under the
        // pointer/finger, regardless of where on the card you grabbed it —
        // this is what fixes the "grabbed from a different position" jump.
        modifiers={[restrictToWindowEdges, snapCenterToCursor]}
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col sm:flex-row gap-6">
          <Column
            id="tasks"
            title="Tasks"
            icon={Circle}
            count={todoTasks.length}
            tasks={todoTasks}
          >
            <button className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:cursor-pointer hover:text-slate-600 px-1 py-1.5 transition-colors duration-150"
              onClick={() => setTaskForm(true)}
            >
              <Plus className="h-4 w-4" />
              Add Task
            </button>
          </Column>

          <Column
            id="done"
            title="Done"
            dot="bg-emerald-500"
            count={doneTasks.length}
            tasks={doneTasks}
          />
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
        </DragOverlay>
      </DndContext>

      <style>{`
                @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(8px); }
                to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fadeInUp 0.4s ease-out both; }
        `}</style>

    </div>
  );
}