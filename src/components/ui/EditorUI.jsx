import { useEffect, useRef } from "react";
import Quill from "quill";
import { useTranslation } from "react-i18next";
import "./editor-ui.css";
import { Flex } from "antd";

export default function EditorUI({value = "", placeholder, onChange, radius = 6}) {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const {t} = useTranslation();

  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    quillRef.current = new Quill(editorRef.current, {
      theme: "snow",
      placeholder: placeholder || t("placeholders.description"),
      modules: {
        toolbar: [
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          ['link'],
          // ["image"],
          ["clean"],
        ],
      },
    });

    if(value) {
      quillRef.current.root.innerHTML = value;
    }

    quillRef.current.on("text-change", () => {
      const html = quillRef.current.root.innerHTML;
      onChange?.(html);
    });

    editorRef.current.style.borderRadius = 4;
  }, [value, onChange, t, placeholder]);

  useEffect(() => {
    if (!quillRef.current) return;
    if (value !== quillRef.current.root.innerHTML) {
      quillRef.current.clipboard.dangerouslyPasteHTML(value);
    }
  }, [value]);

  return (
    <div flex={1} className="w-full">
      <Flex vertical className="editor-ui" style={{ "--editor-radius": `${radius}px` }}>
        <div ref={editorRef} />
      </Flex>
    </div>
  );
}
