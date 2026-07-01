// Stub standing in for the portal's clothing-POS variant matrix grid, so the
// vendored FormVariantMatrix compiles side-by-side.

export interface MatrixVariantItem {
  id: string
  [key: string]: unknown
}

interface VariantMatrixGridProps {
  variants: MatrixVariantItem[]
  selectedIds: Set<string>
  onSelectedChange: (ids: Set<string>) => void
  onCellClick?: (variant: MatrixVariantItem) => void
}

export function VariantMatrixGrid(_props: VariantMatrixGridProps) {
  return null
}
