// ============================================================
// FreshGuard AI — Components: Investigation Graph (v1)
// ============================================================

import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface GraphNodeData {
  id: string;
  label: string;
  type: 'observed' | 'derived' | 'hypothesis' | 'unknown';
  description: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GraphEdgeData {
  id: string;
  source: string;
  target: string;
  label: string;
  type: 'causal' | 'correlation' | 'uncertain';
  description: string;
}

export function InvestigationGraph({
  nodes,
  edges,
  selectedNode,
  onNodeClick,
  onNodeHover,
}: {
  nodes: GraphNodeData[];
  edges: GraphEdgeData[];
  selectedNode: string | null;
  onNodeClick: (id: string) => void;
  onNodeHover?: (id: string | null) => void;
}) {
  // Layout nodes in layers
  const layoutedNodes = React.useMemo(() => {
    const margin = 60;
    const spacingX = 280;
    const spacingY = 120;

    const nodeMap = new Map<string, GraphNodeData>();
    nodes.forEach((n) => nodeMap.set(n.id, n));

    const positions: Record<string, { x: number; y: number }> = {};

    // Group nodes by type for layered layout
    const layerGroups: string[][] = [
      nodes.filter((n) => n.type === 'observed').map((n) => n.id),
      nodes.filter((n) => n.type === 'derived').map((n) => n.id),
      nodes.filter((n) => n.type === 'hypothesis').map((n) => n.id),
      nodes.filter((n) => n.type === 'unknown').map((n) => n.id),
    ].filter((l) => l.length > 0);

    layerGroups.forEach((layer, layerIndex) => {
      layer.forEach((id, idx) => {
        positions[id] = {
          x: margin + idx * spacingX,
          y: margin + layerIndex * spacingY,
        };
      });
    });

    return Object.entries(positions).map(([id, pos]) => {
      const node = nodeMap.get(id)!;
      return {
        ...node,
        x: pos.x,
        y: pos.y,
      };
    });
  }, [nodes]);

  const getNodeColor = (type: GraphNodeData['type']) => {
    switch (type) {
      case 'observed':
        return 'bg-blue-100 border-blue-200';
      case 'derived':
        return 'bg-green-100 border-green-200';
      case 'hypothesis':
        return 'bg-purple-100 border-purple-200';
      case 'unknown':
        return 'bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className="relative w-full overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Graph canvas */}
        <div
          className="relative rounded-md border border-border-subtle bg-surface p-4 cursor-crosshair"
          style={{
            minHeight: '400px',
            backgroundImage: `
              linear-gradient(to right, transparent 0%, transparent 400px),
              linear-gradient(to bottom, transparent 0%, transparent 400px)
            `,
            backgroundSize: '400px 400px',
          }}
        >
          {/* Edges */}
          {edges.map((edge) => (
            <div
              key={edge.id}
              className="absolute"
              style={{
                left: nodes.find((n) => n.id === edge.source)?.x ?? 0,
                top: nodes.find((n) => n.id === edge.source)?.y ?? 0,
                width: nodes.find((n) => n.id === edge.target)?.x ??
                  (nodes.find((n) => n.id === edge.source)?.x ?? 0) + 280,
                height: nodes.find((n) => n.id === edge.target)?.y ??
                  (nodes.find((n) => n.id === edge.source)?.y ?? 0) + 120,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
              }}
            >
              <ArrowRight className="w-4 h-4 text-blue-600" />
            </div>
          ))}

          {/* Nodes */}
          {layoutedNodes.map((node) => {
            const isSelected = selectedNode === node.id;
            return (
              <button
                key={node.id}
                onClick={() => onNodeClick(node.id)}
                onMouseEnter={() => onNodeHover?.(node.id)}
                onMouseLeave={() => onNodeHover?.(null)}
                className={`
                  absolute rounded-lg border-2 p-3 shadow-sm transition-all duration-150
                  ${isSelected ? 'scale-105 shadow-lg z-10' : 'hover:scale-105'}
                  ${getNodeColor(node.type)}
                  ${isSelected ? 'border-current' : ''}
                `}
                style={{
                  left: node.x,
                  top: node.y,
                  width: node.width,
                  height: node.height,
                }}
                title={node.description}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  {node.type === 'observed' && <span>[OBS]</span>}
                  {node.type === 'derived' && <span>[DER]</span>}
                  {node.type === 'hypothesis' && <span>[HYP]</span>}
                  {node.type === 'unknown' && <span>[UNC]</span>}
                  <span className="text-xs font-semibold truncate">{node.label}</span>
                </div>
                <p className="text-xs mt-1 opacity-80 truncate">{node.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
