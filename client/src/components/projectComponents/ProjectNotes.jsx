import React, { useEffect, useRef, useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  Code2,
  Code,
  Baseline,
  Highlighter,
  Link2,
  Minus,
  Undo2,
  Redo2,
  RemoveFormatting,
  ChevronDown,
  Save,
  RefreshCcw,
  Minimize2,
  Maximize2,
  Check,
  Loader2,
} from "lucide-react";
import api from "../../api/axios";
import useWorkspaceStore from "../../store/workspaceStore";
import toast from "react-hot-toast";
import NoteConflictModal from "../../Modals/NoteConflictModal";

const SPRINTLAB_STARTER_CONTENT = `
  <h2>SprintLab Workflow</h2>
  <p>This space is for tracking notes, decisions, and context for this project. Here's a quick reference for how work moves through SprintLab.</p>

  <h2>1. Board structure</h2>
  <p>Every project has a Kanban board with three default columns: <strong>To Do</strong>, <strong>In Progress</strong>, and <strong>Done</strong>. Tasks move across columns via drag-and-drop, and status updates sync in real time for all members.</p>

  <h2>2. Creating tasks</h2>
  <ul>
    <li>Click <strong>+ New Task</strong> from any column to add work.</li>
    <li>Assign an owner, set a priority, and add a due date.</li>
    <li>Use labels to group related tasks (e.g. Frontend, Backend, Bug).</li>
  </ul>

  <h2>3. Inviting your team</h2>
  <p>Use the <strong>Invite</strong> flow from the sidebar to add teammates by email. Invited members get access based on their assigned role — Admin, Member, or Viewer.</p>

  <h2>4. Views</h2>
  <p>Switch between <em>Board</em>, <em>List</em>, and <em>Calendar</em> views depending on how you want to plan or review work.</p>

  <blockquote>Tip: use this Notes panel for anything that doesn't belong on a task card — meeting notes, decisions, or context for new teammates.</blockquote>

  <hr>

  <p>Start typing below to replace this with your own notes.</p>
`;

const TEXT_COLORS = [
  { label: "Default", value: null },
  { label: "Slate", value: "#475569" },
  { label: "Red", value: "#dc2626" },
  { label: "Orange", value: "#ea580c" },
  { label: "Green", value: "#16a34a" },
  { label: "Blue", value: "#2563eb" },
  { label: "Purple", value: "#7c3aed" },
];

const HIGHLIGHT_COLORS = [
  { label: "None", value: null },
  { label: "Yellow", value: "#fef08a" },
  { label: "Green", value: "#bbf7d0" },
  { label: "Blue", value: "#bfdbfe" },
  { label: "Pink", value: "#fbcfe8" },
];

const HEADING_OPTIONS = [
  { label: "Paragraph", icon: Pilcrow, level: 0 },
  { label: "Heading 1", icon: Heading1, level: 1 },
  { label: "Heading 2", icon: Heading2, level: 2 },
  { label: "Heading 3", icon: Heading3, level: 3 },
];

function ToolbarButton({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={`flex h-8 w-8 items-center justify-center rounded transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-40 ${active
          ? "bg-blue-50 text-blue-600"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
        }`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" />;
}

function SaveStatusPill({ status }) {
  const config = {
    saving: {
      label: "Saving…",
      dot: "bg-amber-400",
      icon: <Loader2 className="h-3 w-3 animate-spin" />,
    },
    unsaved: {
      label: "Unsaved changes",
      dot: "bg-slate-400",
      icon: null,
    },
    saved: {
      label: "Saved",
      dot: "bg-emerald-500",
      icon: <Check className="h-3 w-3" />,
    },
  }[status];

  return (
    <span className="flex items-center gap-1.5 border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
      {config.icon || <span className={`h-1.5 w-1.5 ${config.dot}`} />}
      {config.label}
    </span>
  );
}

const ProjectNotes = ({ onToggle, maximized }) => {
  const [notes, setNotes] = useState("");
  const [version, setVersion] = useState(0);
  const [conflictModal, setConflictModal] = useState(false);
  const [getNotes, setGetNotes] = useState("");
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // 'heading' | 'color' | 'highlight' | 'link' | null
  const [linkUrl, setLinkUrl] = useState("");

  const toolbarRef = useRef(null);
  const workspaceData = useWorkspaceStore((state) => state.workspaceData);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { class: "text-blue-600 underline underline-offset-2" },
      }),
      TaskList.configure({ HTMLAttributes: { class: "not-prose pl-1" } }),
      TaskItem.configure({ nested: true, HTMLAttributes: { class: "flex items-start gap-2" } }),
      Placeholder.configure({
        placeholder: "Start writing your document…",
      }),
    ],
    content: SPRINTLAB_STARTER_CONTENT,
    onUpdate: ({ editor }) => {
      setNotes(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none",
      },
    },
  });

  // Close any open dropdown when clicking outside the toolbar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Custom shortcut: Ctrl/Cmd + \ clears formatting (not built into Tiptap by default)
  useEffect(() => {
    if (!editor) return;
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "\\") {
        e.preventDefault();
        editor.chain().focus().unsetAllMarks().clearNodes().run();
      }
    };
    const dom = editor.view.dom;
    dom.addEventListener("keydown", handleKeyDown);
    return () => dom.removeEventListener("keydown", handleKeyDown);
  }, [editor]);

  const handlePostNotes = async () => {
    if (!notes || editor.getText().trim() === "") {
      return;
    }

    if (notes === getNotes) {
      toast.error("Write up somthing to post");
      return;
    }

    setIsSaving(true);
    try {
      const response = await api.put(
        `/api/post-notes/${workspaceData}`,
        { notes, version },
        { withCredentials: true }
      );

      setGetNotes(notes);
      setVersion((v) => v + 1);
      toast.success(response.data.message);
    } catch (err) {
      const status = err.response?.status;

      switch (status) {
        case 400:
          toast.error(err.response.data.message);
          break;

        case 409:
          setConflictModal(true);
          toast.error("Version conflict");
          break;

        case 500:
          toast.error("Internal Server Error");
          break;

        default:
          toast.error("Something went wrong");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const fetchNotes = async () => {
    setLoadingNotes(true);
    try {
      const response = await api.get(`/api/get-notes/${workspaceData}`, {
        withCredentials: true,
      });

      if (response.data.notes) {
        editor?.commands.setContent(response.data.notes.notes);
        setVersion(response.data.notes.version);
        setGetNotes(response.data.notes.notes);
        setNotes(response.data.notes.notes);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingNotes(false);
    }
  };

  useEffect(() => {
    if (workspaceData && editor) {
      fetchNotes();
    }
  }, [workspaceData, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const url = linkUrl.trim();

    if (!url) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      const href = /^https?:\/\//i.test(url) ? url : `https://${url}`;
      editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    }
    setLinkUrl("");
    setOpenDropdown(null);
  }, [editor, linkUrl]);

  if (!editor) return null;

  const isDirty = notes !== getNotes;
  const saveStatus = isSaving ? "saving" : isDirty ? "unsaved" : "saved";
  const activeHeading =
    HEADING_OPTIONS.find(
      (h) => h.level !== 0 && editor.isActive("heading", { level: h.level })
    ) || HEADING_OPTIONS[0];

  return (
    <div
      className={`flex min-h-0 w-full flex-col overflow-hidden border border-slate-200 bg-white ${maximized ? "mt-0" : "mt-6"
        }`}
    >
      {conflictModal && <NoteConflictModal onOk={() => setConflictModal(false)} />}

      {/* Toolbar */}
      <div
        ref={toolbarRef}
        className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 py-2 sm:px-4"
      >
        <div className="flex flex-wrap items-center gap-0.5">
          {/* Heading dropdown */}
          <div className="relative">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() =>
                setOpenDropdown(openDropdown === "heading" ? null : "heading")
              }
              title="Text style"
              className="flex h-8 items-center gap-1 px-2 text-sm text-slate-600 transition-colors duration-150 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <activeHeading.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{activeHeading.label}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {openDropdown === "heading" && (
              <div className="absolute left-0 top-9 z-20 w-40 border border-slate-200 bg-white py-1 shadow-lg">
                {HEADING_OPTIONS.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      if (opt.level === 0) {
                        editor.chain().focus().setParagraph().run();
                      } else {
                        editor.chain().focus().toggleHeading({ level: opt.level }).run();
                      }
                      setOpenDropdown(null);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
                  >
                    <opt.icon className="h-4 w-4 text-slate-400" />
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <ToolbarDivider />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
            title="Strikethrough (Ctrl+Shift+X)"
          >
            <Strikethrough className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Text color */}
          <div className="relative">
            <ToolbarButton
              onClick={() => setOpenDropdown(openDropdown === "color" ? null : "color")}
              active={openDropdown === "color"}
              title="Text color"
            >
              <Baseline className="h-4 w-4" />
            </ToolbarButton>

            {openDropdown === "color" && (
              <div className="absolute left-0 top-9 z-20 flex w-40 flex-wrap gap-1.5 border border-slate-200 bg-white p-2 shadow-lg">
                {TEXT_COLORS.map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      if (c.value) {
                        editor.chain().focus().setColor(c.value).run();
                      } else {
                        editor.chain().focus().unsetColor().run();
                      }
                      setOpenDropdown(null);
                    }}
                    title={c.label}
                    className="h-6 w-6 border border-slate-200 transition-transform duration-100 hover:scale-110"
                    style={{ backgroundColor: c.value || "#ffffff" }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Highlight */}
          <div className="relative">
            <ToolbarButton
              onClick={() =>
                setOpenDropdown(openDropdown === "highlight" ? null : "highlight")
              }
              active={editor.isActive("highlight")}
              title="Highlight"
            >
              <Highlighter className="h-4 w-4" />
            </ToolbarButton>

            {openDropdown === "highlight" && (
              <div className="absolute left-0 top-9 z-20 flex w-36 flex-wrap gap-1.5 border border-slate-200 bg-white p-2 shadow-lg">
                {HIGHLIGHT_COLORS.map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      if (c.value) {
                        editor.chain().focus().toggleHighlight({ color: c.value }).run();
                      } else {
                        editor.chain().focus().unsetHighlight().run();
                      }
                      setOpenDropdown(null);
                    }}
                    title={c.label}
                    className="h-6 w-6 border border-slate-200 transition-transform duration-100 hover:scale-110"
                    style={{ backgroundColor: c.value || "#ffffff" }}
                  />
                ))}
              </div>
            )}
          </div>

          <ToolbarDivider />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            title="Bullet list (Ctrl+Shift+8)"
          >
            <List className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            title="Numbered list (Ctrl+Shift+7)"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            active={editor.isActive("taskList")}
            title="Checklist"
          >
            <ListTodo className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
            title="Blockquote (Ctrl+Shift+B)"
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editor.isActive("codeBlock")}
            title="Code block (Ctrl+Alt+C)"
          >
            <Code2 className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive("code")}
            title="Inline code (Ctrl+E)"
          >
            <Code className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Link */}
          <div className="relative">
            <ToolbarButton
              onClick={() => {
                setLinkUrl(editor.getAttributes("link").href || "");
                setOpenDropdown(openDropdown === "link" ? null : "link");
              }}
              active={editor.isActive("link")}
              title="Add link (Ctrl+K)"
            >
              <Link2 className="h-4 w-4" />
            </ToolbarButton>

            {openDropdown === "link" && (
              <div className="absolute left-0 top-9 z-20 w-64 border border-slate-200 bg-white p-2 shadow-lg">
                <div className="flex items-center gap-1.5">
                  <input
                    autoFocus
                    type="text"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setLink();
                      }
                      if (e.key === "Escape") setOpenDropdown(null);
                    }}
                    placeholder="Paste a link…"
                    className="w-full border border-slate-200 px-2 py-1 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={setLink}
                    className="bg-blue-600 px-2.5 py-1 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    {linkUrl ? "Set" : "Remove"}
                  </button>
                </div>
              </div>
            )}
          </div>

          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Divider"
          >
            <Minus className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            title="Clear formatting (Ctrl+\)"
          >
            <RemoveFormatting className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <div className="flex items-center gap-2">
          <SaveStatusPill status={saveStatus} />

          <ToolbarButton onClick={fetchNotes} title="Refresh">
            <RefreshCcw className="h-4 w-4" />
          </ToolbarButton>

          <button
            onClick={handlePostNotes}
            disabled={!isDirty || isSaving}
            className="flex items-center gap-1.5 border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors duration-150 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">Save</span>
          </button>

          <button
            onClick={onToggle}
            className="group flex h-8 w-8 items-center justify-center border border-slate-200 text-slate-500 transition-colors duration-150 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {maximized ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Editor body */}
      <div className="relative flex-1 min-h-0 overflow-hidden bg-white">
        {loadingNotes && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        )}

        <EditorContent
          editor={editor}
          className="prose prose-slate h-full max-w-none min-h-0 overflow-y-auto px-4 py-4 text-[15px] leading-relaxed text-slate-700 focus:outline-none sm:px-8 sm:py-6 prose-headings:font-semibold prose-headings:text-slate-800 prose-p:my-2 prose-blockquote:border-l-2 prose-blockquote:border-slate-300 prose-blockquote:text-slate-500 prose-code:rounded prose-code:bg-slate-100 prose-code:px-1 prose-code:py-0.5 prose-code:text-slate-700 prose-code:before:content-none prose-code:after:content-none prose-pre:bg-slate-800 prose-pre:text-slate-100 [&_hr]:my-6 [&_hr]:border-slate-200 [&_ul[data-type='taskList']]:list-none [&_ul[data-type='taskList']]:pl-0 [&_li[data-checked='true']_p]:text-slate-400 [&_li[data-checked='true']_p]:line-through"
        />
      </div>
    </div>
  );
};

export default ProjectNotes;