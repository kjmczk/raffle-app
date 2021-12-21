export function paginate(array: any[], page_size: number, page_number: number) {
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}
