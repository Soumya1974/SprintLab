import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
// import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Heading1,
  List,
  RefreshCcw,
  LineStyle,
  Plus,
  Download,
  Minimize2,
  Maximize2,
} from "lucide-react";
import api from "../../api/axios";
import useWorkspaceStore from "../../store/workspaceStore";
import toast from "react-hot-toast";
import NoteConflictModal from "../../Modals/NoteConflictModal";
import axios from "axios";

const ProjectNotes = ({ onToggle, maximized }) => {
  const [notes, setNotes] = useState("");
  const [grid, setGrid] = useState(1);
  const [version, setVersion] = useState(0);
  const [conflictModal, setConflictModal] = useState(false);
  const [getNotes, setGetNotes] = useState("");
  const [loadingNotes, setLoadingNotes] = useState(false);

  const workspaceData = useWorkspaceStore((state) => state.workspaceData);

  const editor = useEditor({
    extensions: [
      StarterKit,
      // Underline,
      Placeholder.configure({
        placeholder: "Start writing your document...",
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setNotes(editor.getHTML());
    },
  });

  const handlePostNotes = async () => {

    if (!notes || editor.getText().trim() === "") {
      return;
    }

    if (notes === getNotes) {
      toast.error("Write up somthing to post");
      return;
    }

    try {
      const response = await api.put(`/api/post-notes/${workspaceData}`, {
        notes,
        version
      }, {
        withCredentials: true
      });

      toast.success(response.data.message);
    }
    catch (err) {
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
    }
  }

  const fetchNotes = async () => {
    setLoadingNotes(true);
    try {
      const response = await axios.get(`/api/get-notes/${workspaceData}`, {
        withCredentials: true,
      });

      if (response.data.notes) {
        editor?.commands.setContent(response.data.notes.notes);
        setVersion(response.data.notes.version);
        setGetNotes(response.data.notes.notes);
      }
    } catch (err) {
      console.error(err);
    }
    finally{
      setLoadingNotes(false);
    }
  };

  useEffect(() => {
    if (workspaceData && editor) {
      fetchNotes();
    }
  }, [workspaceData, editor]);

  if (!editor) return null;


  return (
    <div
      className={`flex min-h-0 w-full flex-col overflow-hidden border border-gray-300 bg-gray-100 shadow-lg ${
        maximized ? "mt-0" : "mt-6"
      }`}
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(203,213,225,0.${grid}) 1px, transparent 1px)`,
        backgroundSize: "40px 30px",
      }}
    >
      {
        conflictModal && <NoteConflictModal onOk={() => setConflictModal(false)} />
      }

      <div className="flex flex-wrap items-center justify-between border-b border-gray-200 bg-white px-3 py-2 sm:px-4 sm:py-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition ${editor.isActive("bold")
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-200 hover:bg-gray-100"
              }`}
          >
            <Bold size={17} />
            <span className="hidden sm:inline">Bold</span>
          </button>

          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition ${editor.isActive("italic")
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-200 hover:bg-gray-100"
              }`}
          >
            <Italic size={17} />
            <span className="hidden sm:inline">Italic</span>
          </button>

          {/* <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${editor.isActive("underline")
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-200 hover:bg-gray-100"
              }`}
          >
            <span className="font-bold">U</span>
            <span className="hidden sm:inline">Underline</span>
          </button> */}

          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition ${editor.isActive("heading", { level: 1 })
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-200 hover:bg-gray-100"
              }`}
          >
            <Heading1 size={18} />
            <span className="hidden sm:inline">H1</span>
          </button>

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition ${editor.isActive("bulletList")
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-200 hover:bg-gray-100"
              }`}
          >
            <List size={18} />
            <span className="hidden sm:inline">List</span>
          </button>

          <button
            onClick={() => fetchNotes()}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-200 active:scale-95 transition`}
          >
            <RefreshCcw size={18} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={grid === 9 ? () => setGrid(1) : () => setGrid(9)}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition ${grid === 1
              ? "bg-white border border-gray-200 hover:bg-gray-100"
              : "bg-blue-600 text-white"
              }`}
          >
            <LineStyle size={18} />
            <span className="hidden sm:inline">Lines</span>
          </button>

          <button
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm bg-white border border-gray-200 hover:bg-gray-100 transition active:bg-blue-600 active:text-white"
            onClick={handlePostNotes}
          >
            <Download size={18} />
            <span className="hidden sm:inline">Save</span>
          </button>

           <button
            onClick={onToggle}
            className="group flex px-3 py-2 items-center justify-center rounded-lg border-slate-200 border text-slate-500 transition-all duration-200 hover:scale-105 hover:border-slate-300 hover:text-slate-800  active:scale-95"
          >
            {maximized ? (
              <Minimize2 className="h-4 w-4 transition-transform duration-200 group-hover:rotate-3" />
            ) : (
              <Maximize2 className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-3" />
            )}
          </button>
        </div>
      </div>

      <div className="relative flex-1 min-h-0 overflow-hidden">
        {loadingNotes && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
            <div className="h-7 w-7 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          </div>
        )}

        <EditorContent
          editor={editor}
          className="h-full min-h-0 overflow-y-auto px-4 py-3 sm:px-6 focus:outline-none text-gray-800"
        />
      </div>
    </div>
  );
};

export default ProjectNotes;
