export function getByDotPath<T extends object>(
  obj: T | undefined,
  path: string
) {
  return path.split('.').reduce<any>((acc, key) => acc?.[key], obj)
}
