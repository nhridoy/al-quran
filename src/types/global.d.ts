declare module "react-drag-drawer" {
  import React from "react";
  interface DrawerProps {
    open: boolean;
    onRequestClose: () => void;
    modalElementClass?: string;
    direction?: string;
    children?: React.ReactNode;
  }
  const Drawer: React.FC<DrawerProps>;
  export default Drawer;
}
