import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Calendar,
  ClipboardList,
  Minimize2,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  UserRound,
  Search,
  LayoutGrid,
  List,
  FileSpreadsheet,
  Clock,
  RefreshCcw,
} from "lucide-react";

import {
  DndContext,
  useDraggable,
  useDroppable,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import useWorkspaceStore from "../../store/workspaceStore";
import toast from "react-hot-toast";
import api from "../../api/axios";
import CreateTaskModal from "../../Modals/CreateTaskModal";


const STAGES = [
  { id: "todo", title: "Todo" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Done" },
];


const STATUS_LABEL = STAGES.reduce((acc, s) => ({ ...acc, [s.id]: s.title }), {});

function formatDate(date) {
  if (!date) return "No date";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isDueSoon(date) {
  if (!date) return false;
  const due = new Date(date).getTime();
  const now = new Date().getTime();
  const diffDays = (due - now) / (1000 * 60 * 60 * 24);
  return diffDays >= -1 && diffDays <= 7;
}

function TaskCard({ task, onMove }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task._id, data: task });

  const [showDescription, setShowDescription] = useState(false);

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  const stageIndex = STAGES.findIndex((s) => s.id === task.status);
  const canGoPrev = stageIndex > 0;
  const canGoNext = stageIndex < STAGES.length - 1;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative bg-white border border-slate-200 rounded-md p-3 touch-none select-none ${isDragging ? "opacity-40" : ""
        }`}
    >
      <div {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="min-w-0 text-sm font-semibold text-slate-800 leading-snug">
            {task.title}
            {task.priority && (
              <span
                className={`ml-1.5 text-[11px] font-medium px-1.5 py-0.5 rounded "bg-slate-100 text-slate-600"
                  }`}
              >
                ({task.priority})
              </span>
            )}
          </p>

          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              setShowDescription((v) => !v);
            }}
            aria-label="Toggle description"
            className={`shrink-0 flex h-5 px-1.5 items-center justify-center rounded transition-colors text-[11px] font-medium ${showDescription
              ? "bg-blue-50 text-blue-600"
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              }`}
          >
            Description
          </button>
        </div>

        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <UserRound className="h-3.5 w-3.5 text-slate-400" />
            {task.assignedTo?.name || "Team"}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Calendar className="h-3 w-3" />
            {formatDate(task.dueDate)}
          </span>
        </div>
      </div>

      {showDescription && (
        <div className="absolute right-2 top-9 z-20 w-56 max-w-[calc(100%-1rem)] rounded-md border border-slate-200 bg-white p-2.5 shadow-lg">
          <p className="text-xs text-slate-600 leading-relaxed">
            {task.description || "No description provided"}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <button
          type="button"
          disabled={!canGoPrev}
          onClick={() => onMove(task, STAGES[stageIndex - 1]?.id)}
          className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Previous
        </button>
        <button
          type="button"
          disabled={!canGoNext}
          onClick={() => onMove(task, STAGES[stageIndex + 1]?.id)}
          className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function Column({ id, title, count, tasks, onMove, children }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex flex-col flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
        <span className="text-xs text-slate-400 bg-slate-100 rounded-full px-1.5 py-0.5">
          {count}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2 min-h-24 rounded-md p-1.5 -m-1.5 transition-colors ${isOver ? "bg-blue-50" : ""
          }`}
      >
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} onMove={onMove} />
        ))}
        {children}
      </div>
    </div>
  );
}

function MoveButtons({ task, onMove }) {
  const stageIndex = STAGES.findIndex((s) => s.id === task.status);
  const canGoPrev = stageIndex > 0;
  const canGoNext = stageIndex < STAGES.length - 1;

  return (
    <div className="flex items-center gap-1 shrink-0">
      <button
        type="button"
        disabled={!canGoPrev}
        onClick={() => onMove(task, STAGES[stageIndex - 1]?.id)}
        className="flex h-6 w-6 items-center justify-center rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        aria-label="Move to previous stage"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        disabled={!canGoNext}
        onClick={() => onMove(task, STAGES[stageIndex + 1]?.id)}
        className="flex h-6 w-6 items-center justify-center rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        aria-label="Move to next stage"
      >
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function ListView({ tasks, onMove }) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="flex items-center gap-3 border border-slate-200 rounded-md p-2.5"
          >
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded shrink-0 "bg-slate-100 text-slate-600"
                }`}
            >
              {task.priority || "None"}
            </span>

            <p className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">
              {task.title}
            </p>

            <span className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
              <UserRound className="h-3.5 w-3.5 text-slate-400" />
              {task.assignedTo?.name || "Team"}
            </span>

            <span className="hidden sm:flex items-center gap-1 text-xs text-slate-400 shrink-0">
              <Calendar className="h-3 w-3" />
              {formatDate(task.dueDate)}
            </span>

            <span className="text-[11px] font-medium text-slate-500 bg-slate-100 rounded-full px-2 py-0.5 shrink-0">
              {STATUS_LABEL[task.status] || task.status}
            </span>

            <MoveButtons task={task} onMove={onMove} />
          </div>
        ))}
        {tasks.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8">No tasks match your filters</p>
        )}
      </div>
    </div>
  );
}

function ExcelView({ tasks, onMove }) {
  return (
    <div className="flex-1 overflow-auto border-2 border-slate-300">
      <table className="w-full text-left border-collapse min-w-150 table-fixed">
        <thead>
          <tr className="bg-slate-200/90 text-slate-600 text-[11px] font-bold select-none">
            <th className="w-8 text-center py-1 border-b border-r border-slate-300 bg-slate-200">#</th>
            <th className="py-1 px-2.5 border-b border-r border-slate-300">Title</th>
            <th className="w-24 py-1 px-2.5 border-b border-r border-slate-300">Priority</th>
            <th className="w-32 py-1 px-2.5 border-b border-r border-slate-300">Assigned</th>
            <th className="w-28 py-1 px-2.5 border-b border-r border-slate-300">Due Date</th>
            <th className="w-28 py-1 px-2.5 border-b border-r border-slate-300">Status</th>
            <th className="w-20 text-center py-1 px-2.5 border-b border-slate-300">Move</th>
          </tr>
        </thead>
        <tbody className="text-[12px]">
          {tasks.map((task, index) => (
            <tr key={task._id} className="hover:bg-blue-50/60 transition-colors">
              <td className="w-8 text-center py-1.5 text-[10px] font-semibold text-slate-500 bg-slate-100 border-b border-r border-slate-300">
                {index + 1}
              </td>
              <td className="py-1.5 px-2.5 border-b border-r border-slate-200 font-semibold text-slate-800 truncate">
                {task.title}
              </td>
              <td className="py-1.5 px-2.5 border-b border-r border-slate-200">
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-sm || "bg-slate-100 text-slate-600"
                    }`}
                >
                  {task.priority || "None"}
                </span>
              </td>
              <td className="py-1.5 px-2.5 border-b border-r border-slate-200 text-slate-600 truncate">
                {task.assignedTo?.name || "Team"}
              </td>
              <td className="py-1.5 px-2.5 border-b border-r border-slate-200 text-slate-600 text-[10px]">
                {formatDate(task.dueDate)}
              </td>
              <td className="py-1.5 px-2.5 border-b border-r border-slate-200 text-slate-600">
                {STATUS_LABEL[task.status] || task.status}
              </td>
              <td className="py-1 px-2.5 border-b border-slate-200 text-center">
                <MoveButtons task={task} onMove={onMove} />
              </td>
            </tr>
          ))}
          {tasks.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center text-sm text-slate-400 py-8 border-b border-slate-200">
                No tasks match your filters
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function TaskBoard({ onToggle, maximized }) {
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [viewMode, setViewMode] = useState("board");
  const [search, setSearch] = useState("");
  const [dueSoonOnly, setDueSoonOnly] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [revisionsOnly, setRevisionsOnly] = useState(false);

  const setTaskForm = useWorkspaceStore((state) => state.setTaskForm);
  const workspaceData = useWorkspaceStore((state) => state.workspaceData);
  const taskForm = useWorkspaceStore((state) => state.taskForm);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 8 },
    })
  );

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (search && !task.title?.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (dueSoonOnly && !isDueSoon(task.dueDate)) {
        return false;
      }
      if (priorityFilter !== "All" && task.priority !== priorityFilter) {
        return false;
      }
      if (revisionsOnly && !task.revisions) {
        return false;
      }
      return true;
    });
  }, [tasks, search, dueSoonOnly, priorityFilter, revisionsOnly]);

  const tasksByStage = (stageId) => filteredTasks.filter((t) => t.status === stageId);

  async function updateTaskStatus(taskId, newStatus) {
    const previousTasks = tasks;

    setTasks((prev) =>
      prev.map((task) =>
        task._id === taskId ? { ...task, status: newStatus } : task
      )
    );

    try {
      const response = await api.patch(
        `/api/tasks/${taskId}/${workspaceData}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      toast.success(response.data.message);
    } catch (err) {
      setTasks(previousTasks);
      switch (err.response?.status) {
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
  }

  function handleMoveButton(task, newStatus) {
    if (!newStatus || newStatus === task.status) return;
    updateTaskStatus(task._id, newStatus);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    const draggedTask = tasks.find((t) => t._id === active.id);
    if (!draggedTask) return;

    const newStatus = over.id;
    if (draggedTask.status === newStatus) return;

    updateTaskStatus(draggedTask._id, newStatus);
  }

  async function handleGetTaskCards() {
    setLoadingTasks(true);
    try {
      const response = await api.get(`/api/workspaces/get-task/${workspaceData}`);
      setTasks(response.data.projectData);
    } catch (err) {
      switch (err.response?.status) {
        case 400:
          toast.error(err.response.data.message);
          break;
        case 500:
          toast.error("Internal Server Error");
          break;
        default:
          toast.error("Something went wrong");
      }
    } finally {
      setLoadingTasks(false);
    }
  }

  useEffect(() => {
    if (!workspaceData) {
      setTasks([]);
      return;
    }
    setTasks([]);
    handleGetTaskCards();
  }, [workspaceData]);

  return (
    <div className="flex h-full w-full min-h-0 flex-col overflow-hidden border border-slate-200 bg-white p-4">
      <div className="flex shrink-0 items-center justify-between flex-wrap gap-3 mb-3">
        <h2 className="text-base font-semibold text-slate-800">Tasks Overview</h2>

        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-2 rounded-md transition-colors"
            onClick={() => setTaskForm(true)}
          >
            <Plus className="h-4 w-4" />
            Add Task
          </button>

          <button
            onClick={onToggle}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            {maximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>

        {taskForm && <CreateTaskModal handleGetTaskCards={handleGetTaskCards} />}
      </div>

      <div className="flex shrink-0 items-center justify-between flex-wrap gap-2 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="pl-8 pr-3 py-1.5 text-sm rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-40 sm:w-52"
            />
          </div>

          <button
            type="button"
            onClick={() => setDueSoonOnly((v) => !v)}
            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md border transition-colors ${dueSoonOnly
              ? "bg-blue-50 border-blue-200 text-blue-600"
              : "border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
          >
            <Clock className="h-3.5 w-3.5" />
            Due ≤ 7 days
          </button>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs font-medium px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <button
            type="button"
            onClick={() => setRevisionsOnly((v) => !v)}
            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md border transition-colors ${revisionsOnly
              ? "bg-blue-50 border-blue-200 text-blue-600"
              : "border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            Revisions
          </button>
        </div>

        <div className="flex items-center gap-1 border border-slate-200 rounded-md p-0.5">
          <button
            type="button"
            onClick={() => setViewMode("board")}
            aria-label="Board view"
            className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${viewMode === "board" ? "bg-slate-200 text-slate-800" : "text-slate-400 hover:text-slate-600"
              }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            aria-label="List view"
            className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${viewMode === "list" ? "bg-slate-200 text-slate-800" : "text-slate-400 hover:text-slate-600"
              }`}
          >
            <List className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("excel")}
            aria-label="Excel view"
            className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${viewMode === "excel" ? "bg-slate-200 text-slate-800" : "text-slate-400 hover:text-slate-600"
              }`}
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {loadingTasks ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 border border-slate-200">
            <ClipboardList className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="mt-5 text-lg font-semibold text-slate-700">No tasks yet</h3>
          <p className="mt-2 max-w-xs text-sm text-slate-500">
            Create your first task to get started.
          </p>
        </div>
      ) : viewMode === "list" ? (
        <ListView tasks={filteredTasks} onMove={handleMoveButton} />
      ) : viewMode === "excel" ? (
        <ExcelView tasks={filteredTasks} onMove={handleMoveButton} />
      ) : (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="flex flex-1 flex-col gap-6 overflow-y-auto sm:flex-row">
            {STAGES.map((stage) => (
              <Column
                key={stage.id}
                id={stage.id}
                title={stage.title}
                count={tasksByStage(stage.id).length}
                tasks={tasksByStage(stage.id)}
                onMove={handleMoveButton}
              >
                {stage.id === "todo" && (
                  <button
                    className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 px-1 py-1.5 transition-colors"
                    onClick={() => setTaskForm(true)}
                  >
                    <Plus className="h-4 w-4" />
                    Add Task
                  </button>
                )}
              </Column>
            ))}
          </div>
        </DndContext>
      )}
    </div>
  );
}