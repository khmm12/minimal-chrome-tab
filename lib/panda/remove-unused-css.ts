import postcss from 'postcss'

/**
 * Based on https://panda-css.com/docs/concepts/hooks#remove-unused-variables-from-final-css
 */

interface UseRecord {
  uses: number
  dependencies: Set<string>
  declarations: Set<postcss.Declaration>
}

const varRegex = /var\(\s*(?<name>--[^ ,);]+)/g

export default function removeUnusedCSS(css: string): string {
  const root = postcss.parse(css)

  const records = new Map<string, UseRecord>()
  const keyframes = new Map<string, boolean>()

  const getRecord = (variable: string): UseRecord => {
    let record = records.get(variable)
    if (record == null) {
      record = { uses: 0, dependencies: new Set(), declarations: new Set() }
      records.set(variable, record)
    }
    return record
  }

  const registerUse = (variable: string, ignoreList = new Set<string>()): void => {
    const record = getRecord(variable)
    record.uses++
    ignoreList.add(variable)
    for (const dependency of record.dependencies) {
      if (!ignoreList.has(dependency)) registerUse(dependency, ignoreList)
    }
  }

  const registerDependency = (variable: string, dependency: string): void => {
    const record = getRecord(variable)
    record.dependencies.add(dependency)
  }

  // Detect variable uses
  root.walkDecls((decl) => {
    const parent = decl.parent
    if (parent == null) return

    if (parent.type === 'rule' && (parent as postcss.Rule).selector === ':root') {
      return
    }

    const isVar = decl.prop.startsWith('--')

    // Initiate record
    if (isVar) getRecord(decl.prop).declarations.add(decl)

    if (!decl.value.includes('var(')) return

    for (const match of decl.value.matchAll(varRegex)) {
      const variable = match.groups?.['name']?.trim()
      if (variable == null || variable === '') continue

      if (isVar) {
        registerDependency(decl.prop, variable)
      } else {
        registerUse(variable)
      }
    }
  })

  root.walk((node) => {
    if (node.type === 'atrule' && node.name === 'keyframes') {
      // Record the keyframe and mark it as unused
      keyframes.set(node.params, false)
    } else if (node.type === 'decl') {
      const decl = node
      const animationName = decl.prop === 'animation' ? decl.value.split(' ')[0] : decl.value

      if (
        (decl.prop === 'animation' || decl.prop === 'animation-name') &&
        animationName != null &&
        keyframes.has(animationName)
      ) {
        // Mark the keyframe as used
        keyframes.set(animationName, true)
      }
    }
  })

  // Remove unused variables
  for (const { uses, declarations } of records.values()) {
    if (uses > 0) continue

    for (const decl of declarations) {
      const node = decl.parent?.nodes.length === 1 ? decl.parent : decl
      node.remove()
    }
  }

  // Remove unused keyframes
  root.walkAtRules('keyframes', (rule) => {
    if (keyframes.get(rule.params) === false) rule.remove()
  })

  return root.toString()
}
