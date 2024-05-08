"use client";

import { type Sketch } from "@p5-wrapper/react";
import { NextReactP5Wrapper } from "@p5-wrapper/next";
import { Address } from "viem";
import p5 from "p5";
import { useEffect, useState } from "react";

interface TreeProps {
  nodes: Node[];
}

export const treasuryAddress = "0x8B8b4BedBea9345be8E2477ADB80Db7D4aA59811";

export type Node = {
  id: Address;
  level: number;
  parents: Set<Address>;
  children: Set<Address>;
};

export default function Tree({ nodes }: TreeProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const canvaWrapper = document.getElementById("CanvaWrapper");
    if (canvaWrapper) {
      console.log(canvaWrapper.offsetWidth, canvaWrapper.offsetHeight);
      setDimensions({
        width: canvaWrapper.offsetWidth,
        height: canvaWrapper.offsetHeight,
      });
    }

    const handleResize = () => {
      setDimensions({
        width: canvaWrapper?.offsetWidth || 0,
        height: canvaWrapper?.offsetHeight || 0,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const sketch: Sketch = (p5) => {
    let pathfindersMap = new Map();
    let rootPathfinder: Pathfinder;
    let allPathfinder: Pathfinder[] = [];

    class Pathfinder {
      node: Node;
      location: p5.Vector;
      velocity: p5.Vector;
      diameter: number;
      level: number;
      updated: boolean;

      constructor(node: Node, parent?: Pathfinder) {
        this.node = node;
        if (parent) {
          this.location = parent.location.copy();
          this.velocity = parent.velocity.copy();
          this.velocity.rotate(p5.random(-p5.QUARTER_PI / 2, p5.QUARTER_PI / 2));
          this.level = parent.level + 1;
          this.velocity.setMag(p5.random(100 * Math.pow(0.8, this.level), 120 * Math.pow(0.8, this.level)));
        } else {
          this.location = p5.createVector(p5.width / 2, p5.height);
          this.velocity = p5.createVector(0, -p5.random(1, 5));
          this.level = 1;
        }
        this.diameter = Math.max(0.8, 1 - 0.1 * this.level);
        this.updated = false;
      }

      update() {
        let bump = p5.createVector(p5.random(-1, 1), p5.random(-1, 1));
        bump.mult(0.1 * (1 / this.level));
        this.velocity.add(bump);
        this.location.add(this.velocity);
        this.updated = true;
      }

      // adjust() {
      //   let drift = p5.createVector(p5.random(-0.2, 0.2), p5.random(-0.2, 0.2));
      //   this.location.add(drift);
      // }

      draw() {
        // this.adjust();
        let bottomColor = p5.color(231, 179, 210);
        let topColor = p5.color(141, 132, 139);
        let inter = p5.map(this.location.y, dimensions.height, 0, 0, 1);
        let c = p5.lerpColor(bottomColor, topColor, inter);
        p5.strokeWeight(this.diameter);
        p5.stroke(c);
        p5.point(this.location.x, this.location.y);
      }
    }

    function setupTree(node: Node, pathfinder: Pathfinder) {
      if (node && node.children.size > 0) {
        node.children.forEach((childAddress) => {
          let childNode = nodes.find((n) => n.id === childAddress);
          if (childNode) {
            let newBranch;
            if (pathfindersMap.has(childAddress)) {
              newBranch = pathfindersMap.get(childAddress);
            } else {
              newBranch = new Pathfinder(childNode, pathfinder);
              pathfindersMap.set(childAddress, newBranch);
              allPathfinder.push(newBranch);
            }
            newBranch.update();
            setupTree(childNode, newBranch);
          }
        });
      }
    }

    p5.setup = () => {
      p5.createCanvas(dimensions.width, dimensions.height);
      p5.smooth();
      p5.randomSeed(95);
      const rootNode = nodes.find((n) => n.id === treasuryAddress);
      if (rootNode) {
        rootPathfinder = new Pathfinder(rootNode);
        pathfindersMap.set(treasuryAddress, rootPathfinder);
        setupTree(rootNode, rootPathfinder);
      }
    };

    p5.draw = () => {
      p5.background(0);
      allPathfinder.forEach((path) => {
        path.draw();
      });
      allPathfinder.forEach((pathfinder) => {
        pathfinder.node.parents.forEach((parent) => {
          let parentPathfinder = pathfindersMap.get(parent);
          if (parentPathfinder) {
            p5.stroke(231, 179, 210);
            p5.line(parentPathfinder.location.x, parentPathfinder.location.y, pathfinder.location.x, pathfinder.location.y);
          }
        });
      });
    };
  };

  return (
    <div className="w-full h-full" id="CanvaWrapper">
      <NextReactP5Wrapper sketch={sketch} />
    </div>
  );
}
