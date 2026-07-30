# Micro-Interactions & Animation Patterns

## 1. Card Hover Effects
* **Image Zoom:** On hovering a blog card, the thumbnail image scales smoothly (`scale(1.03)` over `300ms ease-out`) while staying clipped within its rounded container (`overflow: hidden`).
* **Title Underline:** The blog title smoothly transitions an underline from `0%` to `100%` width.
* **Arrow Indicator:** The top-right external link icon (`↗`) translates `2px` up and `2px` right on hover to give a tactile cue of external navigation.

---

## 2. Tag Autocomplete Combobox Behavior
1. **Focus:** Clicking into the tag input displays popular default tags (*Artificial Intelligence*, *Information Technology*, *Agriculture*).
2. **Type-Ahead Suggestion:** Typing filters the dropdown dynamically with matching highlighted text.
3. **Selection:** Pressing `Enter` or clicking a dropdown item transforms the text into an animated removable pill badge inside the input field.
4. **Duplicate Prevention:** If a tag already exists in the post's tag list, the input highlights the existing pill with a subtle shake animation instead of adding a duplicate.

---

## 3. Admin Health Scanner Interaction
* **Scanning State:** Clicking `Run Health Scan` changes the button to a spinning indicator with a live counter (`Scanning 12/45 links...`).
* **Result Transition:** As broken links are detected, rows gently fade in a red status pill (`● Connection Refused / 404`) without re-rendering the whole table.