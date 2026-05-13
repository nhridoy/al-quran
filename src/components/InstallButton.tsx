import React from "react";
import { AiFillCloseCircle } from "react-icons/ai";

export const InstallButton: React.FC = () => {
  const block__install: React.CSSProperties = {
    display: "none",
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    zIndex: 999999,
    background: "white",
    padding: "15px",
    boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.5)",
  };

  const inner: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const close: React.CSSProperties = {};
  const nameStyle: React.CSSProperties = {};
  const title: React.CSSProperties = {
    fontSize: "1.125rem",
    lineHeight: 1,
    fontWeight: 600,
  };
  const cta: React.CSSProperties = {
    marginLeft: "auto",
    background: "#2E0D8A",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "0.5rem",
  };

  return (
    <div className="block__install" style={block__install} id="BlockInstall">
      <div className="inner" style={inner}>
        <div className="close" style={close} id="BlockInstallClose">
          <AiFillCloseCircle
            style={{
              width: "32px",
              height: "32px",
              lineHeight: "32px",
              color: "#2E0D8A",
            }}
          />
        </div>
        <div className="logo">
          <img
            src="https://img.icons8.com/external-others-bzzricon-studio/42/000000/external-quran-ramadan-others-bzzricon-studio.png"
            alt=""
          />
        </div>
        <div className="name" style={nameStyle}>
          <p className="title" style={title}>
            Al Quran
          </p>
          <p className="description">Full Quran with Audio</p>
        </div>
        <div className="cta" style={cta}>
          <button id="BlockInstallButton" className="btn btnoutline">
            Install
          </button>
        </div>
      </div>
    </div>
  );
};
