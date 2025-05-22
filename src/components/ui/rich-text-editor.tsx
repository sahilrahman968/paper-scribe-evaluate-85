
import { useState, useEffect, forwardRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";
import katex from "katex";

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
    
    // Set up Quill and modules on client-side only
    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) {
      return <div className={cn("border rounded-md h-48", className)} ref={ref} />;
    }

    const modules = {
      toolbar: {
        container: toolbarOptions,
        handlers: {
          image: function() {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            input.click();
            
            input.onchange = async () => {
              if (input.files) {
                const file = input.files[0];
                // Mock image URL for demonstration
                const mockImageUrl = `https://source.unsplash.com/random/800x600?${Math.random()}`;
                
                // Now we can use quillRef since we're inside the component
                if (quillRef) {
                  const range = quillRef.getSelection(true);
                  
                  // Insert the image at the cursor position
                  quillRef.insertEmbed(range.index, 'image', mockImageUrl);
                  
                  // Move cursor after the image
                  quillRef.setSelection(range.index + 1);
                }
              }
            };
          }
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
