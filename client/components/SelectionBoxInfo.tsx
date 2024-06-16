import { Box } from '@air/react-drag-to-select';
import React from 'react';

const SelectionBoxInfo = ({ selectionBox }: { selectionBox: Box | undefined }) => (
  <div className="selection-box-info">
    Selection Box:
    <div>top: {selectionBox?.top || ""}</div>
    <div>left: {selectionBox?.left || ""}</div>
    <div>width: {selectionBox?.width || ""}</div>
    <div>height: {selectionBox?.height || ""}</div>
  </div>
);

export default SelectionBoxInfo;
