declare module "react-resizable" {
  import * as React from "react";

  interface ResizableBoxProps {
    width: number;
    height: number;
    minConstraints?: [number, number];
    maxConstraints?: [number, number];
    handle?: React.ReactNode;
    resizeHandles?: Array<"s" | "w" | "e" | "n" | "sw" | "nw" | "se" | "ne">;
    children?: React.ReactNode;
  }

  export class ResizableBox extends React.Component<ResizableBoxProps> {}
}
