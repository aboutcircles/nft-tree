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
  children: Set<Address>;
};

export default function Tree({nodes}: TreeProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const canvaWrapper = document.getElementById('CanvaWrapper');
    if (canvaWrapper) {
      console.log(canvaWrapper.offsetWidth, canvaWrapper.offsetHeight);
      setDimensions({
        width: canvaWrapper.offsetWidth,
        height: canvaWrapper.offsetHeight
      });
    }

    const handleResize = () => {
      setDimensions({
        width: canvaWrapper?.offsetWidth || 0,
        height: canvaWrapper?.offsetHeight || 0
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const sketch: Sketch = (p5) => {
    let paths: Pathfinder[];

    class Pathfinder {
      address: Address;
      lastLocation: p5.Vector;
      location: p5.Vector;
      velocity: p5.Vector;
      diameter: number;
      lifetime: number;
      level: number;

      constructor(address: Address, parent?: Pathfinder) {
        if (parent) {
          this.address = address;
          this.location = parent.location.copy();
          this.lastLocation = parent.lastLocation.copy();
          this.velocity = parent.velocity.copy();
          this.velocity.rotate(p5.random(-p5.QUARTER_PI / 2, p5.QUARTER_PI / 2));
          this.velocity.setMag(p5.random(5, 10));
          this.diameter = parent.diameter * 0.9;
          this.lifetime = 30 - parent.level * 3;
          this.level = parent.level + 1;
        } else {
          this.address = address;
          this.location = p5.createVector(p5.width / 2, p5.height);
          this.lastLocation = this.location.copy();
          this.velocity = p5.createVector(0, -p5.random(1, 5));
          this.diameter = p5.random(0.8, 1);
          this.lifetime = 30;
          this.level = 1;
        }
      }

      update() {
        this.lastLocation.set(this.location.x, this.location.y);
        let bump = p5.createVector(p5.random(-1, 1), p5.random(-1, 1));
        bump.mult(0.1 * (1 / this.level));
        this.velocity.add(bump);
        this.velocity.limit(5);
        this.location.add(this.velocity);
        this.lifetime--;
      }

      draw() {
        p5.strokeWeight(this.diameter);
        p5.stroke(217, 160, 235, 200);
        p5.line(this.lastLocation.x, this.lastLocation.y, this.location.x, this.location.y);
      }
    }

    function drawTree() {
      if (paths) {
        paths.forEach((path, index) => {
          path.draw();
          path.update();
          if (path.lifetime <= 0) {
            const node = nodes.find((n) => n.id === path.address);
            if (node && node.children.size > 0) {
              let pathsTemp = Array.from(node.children).map((childAddress) => new Pathfinder(childAddress, path));
              paths.push(...pathsTemp);
            }
            paths.splice(index, 1);
          }
        });
      }
    }

    p5.setup = () => {
      p5.createCanvas(dimensions.width, dimensions.height); //TODO find a way to resize responsively the canva
      p5.smooth();
      const rootNode = nodes.find((n) => n.id === treasuryAddress);
      if (rootNode) {
        paths = Array.from(rootNode.children).map((childAddress) => new Pathfinder(childAddress));
      }
    };

    p5.draw = () => {
      // p5.background(0, 30);
      drawTree();
    };
  };

  return <div className="w-full h-full" id="CanvaWrapper"><NextReactP5Wrapper sketch={sketch} /></div>;
}
