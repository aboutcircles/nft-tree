import React from "react";
import { type Sketch } from "@p5-wrapper/react";
import { NextReactP5Wrapper } from "@p5-wrapper/next";
import { Address } from "viem";

type Node = {
  id: Address;
  level: number;
  children: Address[];
  x: number;
  y: number;
};

const sketch: Sketch = (p5) => {
  let nodes: Node[] = [];
  let maxLevel = 0;

  p5.setup = () => {
    p5.createCanvas(350, 400);
    initializeNodes();
  };

  function initializeNodes() {
    nodes.push({ id: "0xtreasury", level: 0, children: ["0x0"], x: 0, y: 0 });
    nodes.push({ id: "0x0", level: 1, children: ["0x1", "0x2"], x: 0, y: 0 });
    nodes.push({ id: "0x1", level: 2, children: [], x: 0, y: 0 });
    nodes.push({ id: "0x2", level: 2, children: [], x: 0, y: 0 });
    nodes.forEach((node) => (maxLevel = Math.max(maxLevel, node.level)));

    const levelHeight = p5.height / (maxLevel + 1);
    let levelCounts = Array.from({ length: maxLevel + 1 }, () => 0);

    nodes.forEach((node) => {
      levelCounts[node.level]++;
    });

    let xPos = Array.from({ length: maxLevel + 1 }, () => 0);

    const rootNode = nodes.find((n) => n.id === "0xtreasury");
    if (rootNode) {
      rootNode.x = p5.width / 2;
      rootNode.y = p5.height;
    }

    nodes.forEach((node) => {
      if (node.id !== "0xtreasury") {
        const xStep = p5.width / levelCounts[node.level];
        node.x = xPos[node.level] * xStep + xStep / 2;
        node.y = p5.height - (node.level * levelHeight + levelHeight / 2);
        xPos[node.level]++;
      }
    });
  }

  function drawNodes() {
    p5.fill(255);
    nodes.forEach((node) => {
      p5.ellipse(node.x, node.y, 5, 5);
    });
  }

  function drawEdges() {
    p5.stroke(0, 100, 255);
    p5.strokeWeight(2);
    nodes.forEach((node) => {
      node.children.forEach((childId) => {
        const childNode = nodes.find((n) => n.id === childId);
        if (childNode) {
          p5.line(node.x, node.y, childNode.x, childNode.y);
        }
      });
    });
  }

  p5.draw = () => {
    p5.background(0);
    drawEdges();
    drawNodes();
  };
};

export default function Tree() {
  return <NextReactP5Wrapper sketch={sketch} />;
}
