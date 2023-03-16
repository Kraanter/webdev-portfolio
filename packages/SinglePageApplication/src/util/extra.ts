export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
