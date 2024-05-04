"use client";

import React from "react";
import Spline from "@splinetool/react-spline";
import { Application } from "@splinetool/runtime";

export default function CirclesIcon() {
  return <Spline onLoad={(spline: Application) => spline.setZoom(0.1)} scene="https://prod.spline.design/w63oKWTzHV3jCmqS/scene.splinecode" />;
}
