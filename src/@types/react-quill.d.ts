declare module "react-quill" {
  import { ComponentType } from "react";

  export interface ReactQuillProps {
    value: string;
    onChange: (value: string) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }

  const ReactQuill: ComponentType<ReactQuillProps>;
  export default ReactQuill;
}
