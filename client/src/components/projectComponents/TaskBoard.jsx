import { useEffect, useState } from "react";
import {
  MoreHorizontal,
  Plus,
  CheckCircle2,
  Circle,
  Calendar,
  ClipboardList,
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
import toast from "react-hot-toast";
import api from "../../api/axios";
import CreateTaskModal from "../../Modals/CreateTaskModal";

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

function formatDate(date) {

  if (date === null) {
    return "No data"
  }
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}


function TaskCard({ task, isOverlay = false }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task._id, data: task });

  const style = transform
    ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    }
    : undefined;

  const done = task.status === "done";

  return (

    //Task card
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`group touch-none select-none flex w-full h-35 bg-white border border-slate-300 rounded-l-md shadow-sm hover:border-slate-300 hover:shadow-md transition-all duration-150 cursor-grab active:cursor-grabbing ${isDragging && !isOverlay ? "opacity-30" : ""
        } ${isOverlay ? "shadow-lg" : ""}`}
    >

      <div
        className="w-2 rounded-l-md"
        style={{ backgroundColor: task.color }}
      />

      <div className="flex-1 p-3">
        <div className="flex items-center justify-between mb-1">
          <p className="min-w-0 text-md font-semibold text-slate-800 leading-snug pr-2 wrap-break-word">
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

        <div className="flex items-center justify-between h-14">
          <div className="min-w-0 text-gray-400 text-[14px] wrap-break-word">
            {task.description}
          </div>
        </div>

        <div className="h-px bg-gray-200 rounded-full" />

        <div className="flex items-center mt-1 py-1">
          {done ? (
            <div className="flex justify-between w-full">
              <div className="flex gap-1 items-center text-[12px] text-gray-400">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Finished</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-400 line-through">
                <Calendar className="h-3.5 w-3.5" />
                <span className="text-xs">
                  Done: {formatDate(task.dueDate)}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-between w-full">
              <div
                className={`text-[11px] font-medium px-2 py-1 rounded-md ${PRIORITY_STYLES[task.priority]}`}
              >
                {task.priority}
              </div>

              <div className="flex items-center gap-1.5 text-slate-400">
                <Calendar className="h-3.5 w-3.5" />
                <span className="text-xs">
                  Due: {formatDate(task.dueDate)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
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
          <TaskCard key={task._id} task={task} />
        ))}
        {children}
      </div>
    </div>
  );
}

export default function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [loadingTasks, setLoadingTasks] = useState(false);

  const setTaskForm = useWorkspaceStore((state) => state.setTaskForm);
  const workspaceData = useWorkspaceStore((state) => state.workspaceData);
  const taskForm = useWorkspaceStore((state) => state.taskForm);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 10 },
    })
  );

  const todoTasks = tasks.filter((t) => t.status === "todo");
  const doneTasks = tasks.filter((t) => t.status === "done");

  function handleDragStart(event) {
    const task = tasks.find((t) => t._id === event.active.id);
    setActiveTask(task);
  }

  async function handleDragEnd(event) {
    const { active, over } = event;

    setActiveTask(null);

    if (!over) return;

    const draggedTask = tasks.find(t => t._id === active.id);

    if (!draggedTask) return;

    const oldStatus = draggedTask.status;
    const newStatus = over.id;

    // No change don't do anything optimizes api call
    if (oldStatus === newStatus) return;

    // Optimistic update fro the card even if backend didnot set to done
    setTasks(prev =>
      prev.map(task =>
        task._id === active.id
          ? { ...task, status: newStatus }
          : task
      )
    );

    try {
      const response = await api.patch(
        `/api/tasks/${active.id}/${workspaceData}/status`,
        { status: newStatus },
        { withCredentials: true }
      );

      toast.success(response.data.message);
    } catch (err) {
      switch (err.response.status) {
        case 400:
          toast.error(err.response.data.message);
          break;
        case 500:
          toast.error("Internal Server Error");
          break;
        default:
          toast.error("Something went wrong");
      }
      handleGetTaskCards();
    }
  }

  async function handleGetTaskCards() {
    setLoadingTasks(true);
    try {
      const response = await api.get(`/api/workspaces/get-task/${workspaceData}`);
      setTasks(response.data.projectData);
    }
    catch (err) {
      switch (err.response.status) {
        case 400:
          toast.error(err.response.data.message);
          break;

        case 500:
          toast.error("Internal Server Error");
          break;

        default:
          toast.error("Something went wrong");
      }
    }
    finally{
      setLoadingTasks(false);
    }
  }

  useEffect(() => {
    handleGetTaskCards();
  }, []);

  return (
    <div className="bg-gray-200 animate-fade-in-up border border-slate-300 rounded-sm p-4 overflow-y-auto h-120 md:h-175 scrollbar-hide">
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
        {
          taskForm && <CreateTaskModal handleGetTaskCards={handleGetTaskCards} />
        }
      </div>


      {
        loadingTasks ? (
          <div className="flex h-125 items-center justify-center" >
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>
          </div>
        ) :
          tasks.length === 0 ? (
            <div className="w-full">
              <div className="hidden xl:flex flex-col sm:flex-row gap-6">
                <Column
                  id="todo"
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
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 border border-slate-200">
                  <ClipboardList className="w-8 h-8 text-slate-400" />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-700">
                  No tasks yet
                </h3>

                <p className="mt-2 max-w-xs text-sm text-slate-500">
                  Create your first task or drag one here when you're ready.
                </p>
              </div>
            </div>
          )
            :
            (
              <DndContext

                modifiers={[restrictToWindowEdges, snapCenterToCursor]}
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  <Column
                    id="todo"
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
                </div >

                <DragOverlay>
                  {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
                </DragOverlay>
              </DndContext >
            )
      }

      <style>{`
                @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(8px); }
                to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fadeInUp 0.4s ease-out both; }
        `}</style>

    </div >
  );
}