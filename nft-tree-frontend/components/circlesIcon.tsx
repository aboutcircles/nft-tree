"use client";

import React, { useEffect, useState } from "react";
import Spline from "@splinetool/react-spline";
import { Application } from "@splinetool/runtime";

export default function CirclesIcon() {

  return <Spline onLoad={(spline: Application) => spline.setZoom(window.innerWidth < 640 ? 0.04 : window.innerWidth < 640 ? 0.08 : 0.1)} scene="https://prod.spline.design/w63oKWTzHV3jCmqS/scene.splinecode" />;
}
