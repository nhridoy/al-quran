import { createElement } from "react";
import logo from "../../logo.svg";

export default function SplashImage() {
  return (
    <div className="relative">
      {createElement("lottie-player", {
        rel: "preconnect",
        src: "https://assets9.lottiefiles.com/packages/lf20_5mpwodai.json",
        background: "transparent",
        speed: "1",
        style: { width: 300, height: 300 },
        loop: true,
        autoplay: true,
      })}
      <img src={logo} className="absolute inset-0 p-16 w-full" alt="logo" />
    </div>
  );
}
