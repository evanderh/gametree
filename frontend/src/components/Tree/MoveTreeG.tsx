import { useMemo, useEffect, MouseEventHandler } from 'react';
import { useSelector } from 'react-redux';
import { Tree } from '@visx/hierarchy';
import { hierarchy } from '@visx/hierarchy';
import { ProvidedZoom, TransformMatrix } from '@visx/zoom/lib/types';
import { HierarchyPointNode } from '@visx/hierarchy/lib/types';
import { scaleLinear } from '@visx/scale';
import { Group } from '@visx/group'

import { RootState } from '../../store';
import { ZoomState } from "./MoveTree";
import { Node } from './Node';
import { Link } from './Link';
import { TreeNode, movesToString } from '../../chess';
import { useGetOpeningByMovesQuery } from '../../redux/openingsApi';
import { TreeMinimap } from './TreeMinimap';

const nodeRadiusScale = scaleLinear({ domain: [300, 1200], range: [12, 24] })
const treeWidthScale = scaleLinear({ domain: [300, 1200], range: [200, 400] })
const fontSizeScale = scaleLinear({ domain: [300, 1200], range: [8, 16] })

interface Props {
  width: number,
  height: number,
  zoom: ProvidedZoom<SVGSVGElement> & ZoomState,
  setTargetMatrix: React.Dispatch<React.SetStateAction<TransformMatrix>>,
  showNodeTooltip: (n: HierarchyPointNode<TreeNode>) => MouseEventHandler,
  hideTooltip: () => void,
}
export const MoveTreeG = ({
  width,
  height,
  zoom,
  setTargetMatrix,
  showNodeTooltip,
  hideTooltip,
}: Props) => {
  const fontSize = fontSizeScale(height);
  const nodeRadius = nodeRadiusScale(height);
  const treeWidth = treeWidthScale(width);
  const treeHeight = nodeRadius * 2.5;

  const moves = useSelector((state: RootState) => state.game.moves);
  const currentMove = useSelector((state: RootState) => state.game.currentMove);
  const currentNode = movesToString(moves.slice(0, currentMove));

  useGetOpeningByMovesQuery(moves)
  const treeRoot = useSelector((state: RootState) => state.tree.root)

  const root = useMemo(() => {
    if (treeRoot) {
      return hierarchy(treeRoot);
    }
  }, [treeRoot])

  return root && (
    <>
      <g transform={zoom.toString()}>
        <Tree<TreeNode>
          root={root}
          nodeSize={[treeHeight, treeWidth]}
        >
          {(tree) => {
            useEffect(() => {
              const node = tree.descendants().find(node => node.data.name === currentNode);
              if (node) {
                setTargetMatrix({
                  ...zoom.transformMatrix,
                  translateX: (-node.y * zoom.transformMatrix.scaleX) + (width / 3),
                  translateY: (-node.x * zoom.transformMatrix.scaleY) + (height / 2),
                });
              }
            }, [currentNode, width, height, tree]);

            return (
              <Group>
                {tree.links().map((link, i) => (
                  <Link
                    key={`link-${i}`}
                    link={link}
                    r={nodeRadius}
                    fontSize={fontSize}
                    treeWidth={treeWidth}
                  />
                ))}
                {tree.descendants().map((node, i) => (
                  <Node
                    key={`node-${i}`}
                    node={node}
                    r={nodeRadius}
                    fontSize={fontSize}
                    isCurrentNode={currentNode === node.data.name}
                    onMouseEnter={showNodeTooltip(node)}
                    onMouseLeave={hideTooltip}
                  />
                ))}
              </Group>
            )
          }}
        </Tree>
      </g>
      <g
        clipPath='url(#minimap)'
        transform={`
          scale(0.25)
          translate(${width*3}, ${height*3})
        `}
      >
        <rect width={width} height={height} fill="#ccc" />
        <Tree<TreeNode>
          root={root}
          nodeSize={[treeHeight, treeWidth]}
        >
          {(tree) => (
            <TreeMinimap
              tree={tree}
              height={height}
              width={width}
              zoom={zoom}
              nodeRadius={nodeRadius}
              treeWidth={treeWidth}
              fontSize={fontSize}
              currentNode={currentNode}
            />
          )}
        </Tree>
      </g>
    </>
  );
};


