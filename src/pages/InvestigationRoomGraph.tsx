// ============================================================
// FreshGuard AI — Investigation Room: Graph Section
// ============================================================

import React from 'react';
import { useParams } from 'react-router-dom';
import { useDemos } from '../hooks/useDemos';
import { InvestigationGraph, type GraphNodeData, type GraphEdgeData } from '../components/InvestigationGraph';
import { InvestigationGraphLegend } from '../components/InvestigationGraphLegend';

export function InvestigationGraphSection() {
  const { issueId } = useParams<{ issueId: string }>();
  const { data } = useDemos();

  const investigation = data?.investigations?.find((i) => i.id === issueId) || null;

  const nodes: GraphNodeData[] = [
    { id: 'e1', label: 'Sales decline', type: 'observed', description: '18% revenue decline', x: 80, y: 100, width: 160, height: 80 },
    { id: 'e2', label: 'Footfall decline', type: 'observed', description: '5% footfall decline', x: 280, y: 100, width: 160, height: 80 },
    { id: 'e3', label: 'Transactions down', type: 'derived', description: '15% transaction drop', x: 480, y: 100, width: 160, height: 80 },
    { id: 'e4', label: 'Stockouts (12)', type: 'derived', description: '12 products below stock', x: 680, y: 100, width: 160, height: 80 },
    { id: 'e5', label: 'Potential lost sales', type: 'hypothesis', description: 'Possible revenue loss', x: 480, y: 240, width: 160, height: 80 },
    { id: 'e6', label: 'Revenue decline', type: 'hypothesis', description: '4-week trend', x: 280, y: 240, width: 160, height: 80 },
    { id: 'e7', label: 'Late delivery', type: 'observed', description: 'PO CF-10482 delayed', x: 80, y: 240, width: 160, height: 80 },
    { id: 'e8', label: 'Availability gap', type: 'unknown', description: 'Unknown causal link', x: 480, y: 380, width: 160, height: 80 },
    { id: 'e9', label: 'Wastage up', type: 'observed', description: '28% wastage increase', x: 80, y: 380, width: 160, height: 80 },
    { id: 'e10', label: 'Excess stock?, poor replenishment', type: 'hypothesis', description: 'Possible causes of wastage', x: 280, y: 380, width: 160, height: 80 },
    { id: 'e11', label: 'Unknown', type: 'unknown', description: 'Unknown relationship', x: 680, y: 380, width: 160, height: 80 },
  ];

  const edges: GraphEdgeData[] = [
    { id: 'g1', source: 'e1', target: 'e3', label: 'Impact', type: 'causal', description: 'Sales decline drives fewer transactions' },
    { id: 'g2', source: 'e3', target: 'e4', label: 'Possible cause', type: 'causal', description: 'Fewer transactions may be due to stockouts' },
    { id: 'g3', source: 'e4', target: 'e5', label: 'Suggests', type: 'uncertain', description: 'Empty shelves may have contributed' },
    { id: 'g4', source: 'e1', target: 'e6', label: 'Trend', type: 'causal', description: '4-week revenue decline follows same pattern' },
    { id: 'g5', source: 'e7', target: 'e3', label: 'Linked?', type: 'uncertain', description: 'Timing suggests delivery problem' },
    { id: 'g6', source: 'e7', target: 'e8', label: 'Potential link', type: 'uncertain', description: 'Connectivity to revenue decline is uncertain' },
    { id: 'g7', source: 'e9', target: 'e10', label: 'Possible cause', type: 'correlation', description: 'Wastage may relate to excess stock' },
    { id: 'g8', source: 'e10', target: 'e11', label: 'Unknown', type: 'uncertain', description: 'Relationship to core issue is unconfirmed' },
  ];

  const [selectedNode, setSelectedNode] = React.useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = React.useState<string | null>(null);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Signal relationship graph</h2>
      <p className="text-sm text-muted-foreground mb-3">Explore how operational signals may relate. Click nodes to see evidence.</p>
      <InvestigationGraph
        nodes={nodes}
        edges={edges}
        selectedNode={selectedNode}
        onNodeClick={setSelectedNode}
        onNodeHover={setHoveredNode}
      />
      <InvestigationGraphLegend />
    </div>
  );
}
