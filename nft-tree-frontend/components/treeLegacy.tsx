import React, { useEffect, useState } from "react";
import { type Sketch } from "@p5-wrapper/react";
import { NextReactP5Wrapper } from "@p5-wrapper/next";
import { Address } from "viem";
import { fetchFilesData } from "@/actions/fetchDatas";
import p5 from "p5";

export const treasuryAddress = "0x8B8b4BedBea9345be8E2477ADB80Db7D4aA59811";

export type Node = {
  id: Address;
  level: number;
  children: Set<Address>;
  x: number;
  y: number;
};

export default function TreeLegacy() {
  const [nodes, setNodes] = useState<Node[]>([]);

  const sketch: Sketch = (p5) => {
    let paths: Pathfinder[];

    class Pathfinder {
      lastLocation: p5.Vector;
      location: p5.Vector;
      velocity: p5.Vector;
      diameter: number;
      lifetime: number;

      constructor(parent?: Pathfinder) {
        if (parent) {
          this.location = parent.location.copy();
          this.lastLocation = parent.location.copy();
          this.velocity = p5.createVector(p5.random(-1, 1), p5.random(-1, 1));
          this.velocity.setMag(p5.random(10, 20));
          this.diameter = parent.diameter;
          this.lifetime = 200;
        } else {
          this.location = p5.createVector(p5.width / 2, p5.height);
          this.lastLocation = this.location.copy();
          this.velocity = p5.createVector(0, -p5.random(1, 5));
          this.diameter = p5.random(0.1, 1);
          this.lifetime = 200;
        }
      }

      update() {
        if (this.lifetime > 0) {
          this.lastLocation.set(this.location.x, this.location.y);
          let bump = p5.createVector(p5.random(-1, 1), p5.random(-1, 1));
          bump.mult(0.2);
          this.velocity.add(bump);
          this.velocity.limit(5);
          this.location.add(this.velocity);
          this.lifetime--;
        }
      }

      draw() {
        if (this.lifetime > 0) {
          p5.strokeWeight(this.diameter);
          p5.stroke(217, 160, 235, 200);
          p5.line(this.lastLocation.x, this.lastLocation.y, this.location.x, this.location.y);
        }
      }
    }

    p5.setup = () => {
      p5.createCanvas(450, 900); //TODO find a way to resize responsively the canva
      p5.smooth();
      const rootNode = nodes.find((n) => n.id === treasuryAddress);
      const rootSize = rootNode?.children.size || 0;
      paths = new Array(rootSize).fill(null).map(() => new Pathfinder());
      // initializeNodes();
    };

    function initializeNodes() {
      if (nodes.length === 0) return;
      const maxLevel = Math.max(...nodes.map((n) => n.level));
      const levelHeight = p5.height / (maxLevel + 1);
      let levelCounts = Array.from({ length: maxLevel + 1 }, () => 0);

      nodes.forEach((node) => {
        levelCounts[node.level]++;
      });

      let xPos = Array.from({ length: maxLevel + 1 }, () => 0);

      const rootNode = nodes.find((n) => n.id === treasuryAddress);
      if (rootNode) {
        rootNode.x = p5.width / 2;
        rootNode.y = p5.height;
      }

      nodes.forEach((node) => {
        if (node.id !== treasuryAddress) {
          const xStep = p5.width / levelCounts[node.level];
          node.x = xPos[node.level] * xStep + xStep / 2;
          node.y = p5.height - (node.level * levelHeight + levelHeight / 2);
          xPos[node.level]++;
        }
      });
    }

    function updateNodes() {
      nodes.forEach((node) => {
        let bump = p5.createVector(p5.random(-1, 1), p5.random(-1, 1));
        bump.mult(0.5);
        node.x += bump.x;
        node.y += bump.y;
      });
    }

    function drawEdges() {
      p5.stroke(217, 160, 235, 200);
      p5.strokeWeight(1);
      nodes.forEach((node) => {
        node.children.forEach((childId) => {
          const childNode = nodes.find((n) => n.id === childId);
          if (childNode) {
            p5.line(node.x, node.y, childNode.x, childNode.y);
          }
        });
      });
    }

    function drawNodes() {
      p5.fill(217, 160, 235, 200);
      nodes.forEach((node) => {
        p5.ellipse(node.x, node.y, 1, 1);
      });
    }

    p5.draw = () => {
      // p5.background(0);
      for (let i = 0; i < paths.length; i++) {
        let loc = paths[i].location;
        let lastLoc = paths[i].lastLocation;
        if (paths[i].lifetime > 0) {
          p5.stroke(217, 160, 235, 200);
          p5.strokeWeight(paths[i].diameter);
          p5.line(lastLoc.x, lastLoc.y, loc.x, loc.y);
          paths[i].update();
        }
      }
      // updateNodes();
      // drawEdges();
      // drawNodes();
    };
  };

  async function loadData() {
    const data = await fetchFilesData();
    setNodes(data);
    console.log(data);
  }

  useEffect(() => {
    loadData();
  }, []);
  return <NextReactP5Wrapper sketch={sketch} />;
}
