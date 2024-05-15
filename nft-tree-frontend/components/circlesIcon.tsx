"use client";

import React, { useEffect, useState } from "react";
import Spline from "@splinetool/react-spline";
import { Application } from "@splinetool/runtime";

export default function CirclesIcon() {
  const [zoom, setZoom] = useState(0.15);
  
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 640) {
        setZoom(0.1); // Mobile
      } else if (screenWidth < 1024) {
        setZoom(0.12); // Tablette
      } else {
        setZoom(0.15); // Desktop
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <Spline onLoad={(spline: Application) => spline.setZoom(zoom)} scene="https://prod.spline.design/w63oKWTzHV3jCmqS/scene.splinecode" />;
}
