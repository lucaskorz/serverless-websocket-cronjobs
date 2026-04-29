export function messageTratted(pValor: string) {
  if (typeof pValor !== 'string') {
    return pValor
  }

  return pValor.replace(/^['"]|['"]$/g, '')
}