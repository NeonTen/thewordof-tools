# Design Spec - Multi-Color Gradient Generator

## Goal
Enhance the existing Gradient Generator tool to support adding, editing, positioning, and deleting multiple color stops, moving away from a rigid two-color model.

## User Experience
1. **Interactive Slider Track**: A horizontal visual representation of the current gradient with draggable handles (pins) representing each color stop.
2. **Add Stops**: Users can click any empty spot on the slider track to insert a new color stop at that percentage.
3. **Move Stops**: Users can drag handles left/right or type in a percentage to change its position.
4. **Edit Stop**: Selecting a handle highlights it and opens a control panel to adjust its hex color or delete it.
5. **Dynamic Presets**: Gallery presets load dynamically by auto-calculating position percentages based on the number of preset colors.

## Proposed Changes

### [gradient-generator.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/gradient-generator.tsx)
* Define a `ColorStop` interface:
  ```typescript
  interface ColorStop {
    id: string
    color: string
    position: number // 0 to 100
  }
  ```
* Update state:
  * Replace `colors: string[]` with `stops: ColorStop[]`.
  * Track active stop with `activeStopId: string`.
* Implement:
  * Mouse/touch handlers for dragging stops on the track.
  * Click handlers on the track to insert new stops.
  * Sorted stop rendering in preview CSS: `background: linear-gradient(angle, color1 pos1%, color2 pos2%, ...)`
  * Arbitrary Tailwind CSS class output: `bg-[linear-gradient(angle,_color1_pos1%,_color2_pos2%,_...)]`

## Verification
* Ensure no build errors with `npm run build`.
* Manually verify that stops can be created, dragged, and deleted.
* Confirm that CSS and Tailwind classes copy correctly to the clipboard.
