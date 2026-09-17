// Button preview — the docs site's own Button demos, re-exported as cells.
// Imports of @/components/ui/* inside the demos are redirected to the shipped
// bundle at compile time, so every cell renders window.EdgecomDS.Button.
export { ButtonVariantsDemo as Variants } from "@/components/demo/button-variants-demo"
export { ButtonSizesDemo as Sizes } from "@/components/demo/button-sizes-demo"
export { ButtonIconsDemo as WithIcons } from "@/components/demo/button-icons-demo"
export { ButtonIconButtonsDemo as IconOnly } from "@/components/demo/button-icon-buttons-demo"
export { ButtonLoadingDemo as Loading } from "@/components/demo/button-loading-demo"
export { ButtonRowActionDemo as QuietRowAction } from "@/components/demo/button-row-action-demo"
