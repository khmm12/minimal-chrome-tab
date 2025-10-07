export function supportsAnimations(): boolean {
  return typeof HTMLElement !== 'undefined' && typeof HTMLElement.prototype.animate !== 'undefined'
}

export function supportsInertAttribute(): boolean {
  return typeof HTMLElement !== 'undefined' && 'inert' in HTMLElement.prototype
}
