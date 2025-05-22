
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
      
      if (typeof window !== "undefined") {
        // Dynamic imports to avoid SSR issues
        import("quill").then(module => {
          const Quill = module.default;
          
          // Register Katex formula module
          const BlockEmbed = Quill.import("blots/block/embed");
          
          class FormulaBlot extends BlockEmbed {
            static create(value: string) {
              const node = super.create();
              if (value) {
                node.setAttribute("data-formula", value);
                katex.render(value, node, {
                  throwOnError: false,
                  displayMode: true
                });
              }
              return node;
            }
            
            static value(node: HTMLElement) {
              return node.getAttribute("data-formula");
            }
          }
          
          // Add static properties to FormulaBlot class
          // @ts-ignore - We know these properties exist for Quill blots
          FormulaBlot.blotName = "formula";
          // @ts-ignore
          FormulaBlot.tagName = "DIV";
          // @ts-ignore
          FormulaBlot.className = "ql-formula";
          
          Quill.register(FormulaBlot, true);
          
          // We're not using these modules for now as they're causing issues
          // They can be added back later if needed with proper configuration
        });
      }
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
