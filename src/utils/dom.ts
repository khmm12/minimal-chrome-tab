export function supportsAnimations(): boolean {
  return typeof Element !== 'undefined' && typeof Element.prototype.animate !== 'undefined'
}
