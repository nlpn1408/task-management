import type React from "react";
import type { DraggableAttributes } from "@dnd-kit/core";

// Type for DND event listeners, targeting HTMLElement
export type DndListeners = Record<
  string,
  | React.PointerEventHandler<HTMLElement>
  | React.KeyboardEventHandler<HTMLElement>
  | undefined
>;

// It might also be useful to have a combined props type for draggable/sortable items
export interface DndItemProps {
  dndRef?: React.Ref<HTMLDivElement>;
  dndStyle?: React.CSSProperties;
  dndAttributes?: DraggableAttributes;
  dndListeners?: DndListeners;
}
