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
  Grid,
  Save,
  RefreshCcw,
} from "lucide-react";
import api from "../../api/axios";
import useWorkspaceStore from "../../store/workspaceStore";
import toast from "react-hot-toast";
import NoteConflictModal from "../../Modals/NoteConflictModal";

const ProjectNotes = () => {
  const [notes, setNotes] = useState("");
  const [grid, setGrid] = useState(1);
  const [version, setVersion] = useState(0);
  const [conflictModal, setConflictModal] = useState(false);
  const [getNotes, setGetNotes] = useState("");

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

    if(notes === getNotes){
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
      switch (err.response.status) {
        case 400:
          toast.error(err.response.data.message);
          break;
        case 409:
          setConflictModal(true);
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
    try {
      const response = await api.get(`/api/get-notes/${workspaceData}`, {
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
  };
  
  useEffect(() => {

    if (workspaceData && editor) {
      fetchNotes();
    }
  }, [workspaceData, editor]);

  if (!editor) return null;

  return (
    <div
      className="mt-6 border border-gray-300 shadow-lg overflow-hidden bg-gray-100"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(203,213,225,0.${grid}) 1px, transparent 1px)`,
        backgroundSize: "40px 30px",
      }}
    >
      {
        conflictModal && <NoteConflictModal onOk={() => setConflictModal(false)}/>
      }
      
      <div className="flex flex-wrap items-center justify-between border-b border-gray-200 bg-white px-3 py-2 sm:px-4 sm:py-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${editor.isActive("bold")
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-200 hover:bg-gray-100"
              }`}
          >
            <Bold size={18} />
            <span className="hidden sm:inline">Bold</span>
          </button>

          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${editor.isActive("italic")
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-200 hover:bg-gray-100"
              }`}
          >
            <Italic size={18} />
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
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${editor.isActive("heading", { level: 1 })
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-200 hover:bg-gray-100"
              }`}
          >
            <Heading1 size={18} />
            <span className="hidden sm:inline">H1</span>
          </button>

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${editor.isActive("bulletList")
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-200 hover:bg-gray-100"
              }`}
          >
            <List size={18} />
            <span className="hidden sm:inline">List</span>
          </button>

          <button
            onClick={() => fetchNotes()}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-200 active:scale-95 transition`}
          >
            <RefreshCcw size={18} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={grid === 1 ? () => setGrid(9) : () => setGrid(1)}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${grid === 1
                ? "bg-white border border-gray-200 hover:bg-gray-100"
                : "bg-blue-600 text-white"
              }`}
          >
            <Grid size={18} />
            <span className="hidden sm:inline">Grid</span>
          </button>

          <button
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium bg-white border border-gray-200 hover:bg-gray-100 transition active:bg-blue-600 active:text-white"
            onClick={handlePostNotes}
          >
            <Save size={18} />
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="min-h-87.5 px-4 py-3 sm:px-6 focus:outline-none text-gray-800"
      />
    </div>
  );
};

export default ProjectNotes;
