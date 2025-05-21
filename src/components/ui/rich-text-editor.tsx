
import { useState, useEffect, forwardRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "katex/dist/katex.min.css";
import BlotFormatter from "quill-blot-formatter";
import ImageUploader from "quill-image-uploader";
import { cn } from "@/lib/utils";

// Import Katex module for formula support
const Quill = typeof window !== "undefined" ? require("quill") : null;
let Parchment = null;
if (Quill) {
  Parchment = Quill.import("parchment");
  
  // Add Katex formula module
  const BlockEmbed = Quill.import("blots/block/embed");
  
  class FormulaBlot extends BlockEmbed {
    static create(value) {
      const node = super.create();
      // Set formula value and render using KaTeX
      if (value) {
        node.setAttribute("data-formula", value);
        katex.render(value, node, {
          throwOnError: false,
          displayMode: true
        });
      }
      return node;
    }

    static value(node) {
      return node.getAttribute("data-formula");
    }
  }
  FormulaBlot.blotName = "formula";
  FormulaBlot.tagName = "DIV";
  FormulaBlot.className = "ql-formula";
  
  Quill.register(FormulaBlot);
  Quill.register("modules/blotFormatter", BlotFormatter);
  Quill.register("modules/imageUploader", ImageUploader);
}

// Define the toolbar modules for our editor
const toolbarOptions = [
  [{ 'header': [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
  [{ 'indent': '-1' }, { 'indent': '+1' }],
  ['formula'], // Mathematical formulas
  [{ 'color': [] }, { 'background': [] }],
  ['link', 'image'],
  ['clean']
];

// Mock image upload handler
const imageHandler = () => {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();
  
  input.onchange = async () => {
    if (input.files) {
      const file = input.files[0];
      // In a real app, you would upload to a server and get a URL
      // Here we're using a placeholder for demonstration
      const mockImageUrl = `https://source.unsplash.com/random/800x600?${Math.random()}`;
      
      const quill = quillRef.current;
      const range = quill.getSelection(true);
      
      // Insert the image at the cursor position
      quill.insertEmbed(range.index, 'image', mockImageUrl);
      
      // Move cursor after the image
      quill.setSelection(range.index + 1);
    }
  };
};

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}

const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(
  ({ value, onChange, placeholder = "Write something...", className, readOnly = false }, ref) => {
    const [quillRef, setQuillRef] = useState<any>(null);
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) {
      return <div className={cn("border rounded-md h-48", className)} ref={ref} />;
    }

    const modules = {
      toolbar: toolbarOptions,
      blotFormatter: {},
      imageUploader: {
        upload: (file: File) => {
          return new Promise((resolve, reject) => {
            // Mock image upload with a random unsplash image
            const mockImageUrl = `https://source.unsplash.com/random/800x600?${Math.random()}`;
            resolve(mockImageUrl);
          });
        }
      },
      clipboard: {
        matchVisual: false
      }
    };

    return (
      <div className={cn("rich-text-editor", className)} ref={ref}>
        <ReactQuill
          ref={setQuillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          placeholder={placeholder}
          readOnly={readOnly}
        />
      </div>
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";

export { RichTextEditor };
