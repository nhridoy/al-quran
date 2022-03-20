import React, { PureComponent } from "react";
import { Spin as HamburgerBtn } from "hamburger-react";
import Drawer from "react-drag-drawer";

const HamBurger = () => {
  const [sidebarLeft, setSidebarLeft] = React.useState(false);

  const toggle = (value) => (event) => {
    setSidebarLeft(value);
  };

  return (
    <>
      <button onClick={toggle(true)} className={"Toggle"}>
        <HamburgerBtn size={20} toggled={sidebarLeft} />
      </button>

      <Drawer
        open={sidebarLeft}
        onRequestClose={toggle(false)}
        modalElementClass="bg-white h-screen left-0 absolute"
        direction="left"
      >
        <div className={"Card"}>
          I'm a sidebar drawer
          <button className={"Toggle"} onClick={toggle(false)}>
            Close drawer
          </button>
        </div>
      </Drawer>
    </>
  );
};

export default HamBurger;
