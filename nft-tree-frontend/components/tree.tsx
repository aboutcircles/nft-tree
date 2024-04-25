import React, { useEffect, useState } from "react";
import { type Sketch } from "@p5-wrapper/react";
import { NextReactP5Wrapper } from "@p5-wrapper/next";
import { Address } from "viem";
import { fetchFilesData } from "@/actions/fetchDatas";

export const treasuryAddress = "0x8B8b4BedBea9345be8E2477ADB80Db7D4aA59811";

export type Node = {
  id: Address;
  level: number;
  children: Set<Address>;
  x: number;
  y: number;
};

export default function Tree() {
  const [nodes, setNodes] = useState<Node[]>([]);

  const sketch: Sketch = (p5) => {
    p5.setup = () => {
      p5.createCanvas(350, 400);
      initializeNodes();
    };
  
    function initializeNodes() {
      if (nodes.length === 0) return;
      const maxLevel = Math.max(...nodes.map(n => n.level));
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

  async function loadData() {
    const data = await fetchFilesData();
    setNodes(data)
    console.log(data);
  }

  useEffect(() => {
    loadData();
  }, []);
  return <NextReactP5Wrapper sketch={sketch} />;
}
