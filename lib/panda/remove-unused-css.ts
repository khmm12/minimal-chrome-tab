import postcss from 'postcss'

/**
 * Based on https://panda-css.com/docs/concepts/hooks#remove-unused-variables-from-final-css
 */

export default function removeUnusedCSS(css: string): string {
  const root = postcss.parse(css)

  const variables = new VariablesCollector()
  const keyframes = new KeyframesCollector()

  root.walk((node) => {
    variables.walkNode(node)
    keyframes.walkNode(node)
  })

  variables.removeUnused()
  keyframes.removeUnused()

  return root.toString()
}

declare const BRAND: unique symbol

interface Brand<B> {
  [BRAND]: B
}
type Branded<T, B> = T & Brand<B>

type VariableDecl = Branded<postcss.Declaration, 'VariableDecl'>

interface VariableUsage {
  uses: number
  dependencies: Set<string>
  declarations: Set<VariableDecl>
}

class VariablesCollector {
  private readonly records = new Map<string, VariableUsage>()
  private readonly varRegex = /var\(\s*(?<name>--[^ ,);]+)/g

  walkNode(node: postcss.ChildNode): void {
    if (isDecl(node)) {
      this.walkDecl(node)
    }
  }

  removeUnused(): void {
    for (const { uses, declarations } of this.records.values()) {
      if (uses > 0) continue

      for (const decl of declarations) {
        const node = decl.parent?.nodes.length === 1 ? decl.parent : decl
        node.remove()
      }
    }
  }

  private walkDecl(decl: postcss.Declaration): void {
    if (this.isTop(decl)) return

    if (this.isVariableDecl(decl)) {
      this.registerDeclaration(decl)
      this.walkVariables(decl, (varName) => {
        this.registerDependency(decl, varName)
      })
    } else {
      this.walkVariables(decl, (varName) => {
        this.registerUsage(varName)
      })
    }
  }

  private getRecord(variable: string): VariableUsage {
    let record = this.records.get(variable)

    if (record == null) {
      record = { uses: 0, dependencies: new Set(), declarations: new Set() }
      this.records.set(variable, record)
    }
    return record
  }

  private registerUsage(variable: string): void {
    const handled = new Set<string>()

    const traverse = (variable: string): void => {
      if (handled.has(variable)) return

      const record = this.getRecord(variable)
      record.uses++
      handled.add(variable)
      for (const dependency of record.dependencies) {
        traverse(dependency)
      }
    }

    traverse(variable)
  }

  private registerDependency(decl: VariableDecl, dependency: string): void {
    const varName = this.getVarNameFromDecl(decl)
    this.getRecord(varName).dependencies.add(dependency)
  }

  private registerDeclaration(decl: VariableDecl): void {
    const varName = this.getVarNameFromDecl(decl)
    this.getRecord(varName).declarations.add(decl)
  }

  private getVarNameFromDecl(decl: VariableDecl): string {
    return decl.prop
  }

  private isTop(decl: postcss.Declaration): boolean {
    const parent = decl.parent
    return parent == null || (isRule(parent) && parent.selector === ':root')
  }

  private isVariableDecl(decl: postcss.Declaration): decl is VariableDecl {
    return decl.prop.startsWith('--')
  }

  private walkVariables(decl: postcss.Declaration, walk: (variable: string) => void): void {
    for (const match of decl.value.matchAll(this.varRegex)) {
      const variable = match.groups?.['name']?.trim()
      if (variable != null && variable !== '') {
        walk(variable)
      }
    }
  }
}

interface KeyframeUsage {
  uses: number
  atRules: Set<KeyframesAtRule>
}

interface AnimationDecl extends postcss.Declaration {
  prop: 'animation' | 'animation-name'
}

interface KeyframesAtRule extends postcss.AtRule {
  name: 'keyframes'
}

class KeyframesCollector {
  private readonly keyframes = new Map<string, KeyframeUsage>()
  private readonly animationNameRegex = /(['"]?)(?<name>[a-zA-Z_][\w-]*)\1/g

  walkNode(node: postcss.ChildNode): void {
    if (isAtRule(node)) {
      this.walkAtRule(node)
    } else if (isDecl(node)) {
      this.walkDecl(node)
    }
  }

  removeUnused(): void {
    for (const { uses, atRules: declarations } of this.keyframes.values()) {
      if (uses > 0) continue

      for (const rule of declarations) {
        rule.remove()
      }
    }
  }

  private walkAtRule(rule: postcss.AtRule): void {
    if (this.isKeyframeAtRule(rule)) {
      this.registerRule(rule)
    }
  }

  private walkDecl(decl: postcss.Declaration): void {
    this.walkAnimations(decl, (name) => {
      this.registerUsage(name)
    })
  }

  private getRecord(keyframe: string): KeyframeUsage {
    let record = this.keyframes.get(keyframe)

    if (record == null) {
      record = { uses: 0, atRules: new Set() }
      this.keyframes.set(keyframe, record)
    }
    return record
  }

  private registerRule(rule: KeyframesAtRule): void {
    this.getRecord(this.getAnimationNameFromRule(rule)).atRules.add(rule)
  }

  private registerUsage(name: string): void {
    this.getRecord(name).uses++
  }

  private isKeyframeAtRule(rule: postcss.AtRule): rule is KeyframesAtRule {
    return rule.name === 'keyframes'
  }

  private isAnimationDecl(decl: postcss.Declaration): decl is AnimationDecl {
    return decl.prop === 'animation' || decl.prop === 'animation-name'
  }

  private walkAnimations(decl: postcss.Declaration, walk: (name: string) => void): void {
    const val = this.isAnimationDecl(decl) ? this.getAnimationNameValueFromDecl(decl) : null
    if (val == null) return

    for (const match of decl.value.matchAll(this.animationNameRegex)) {
      const variable = match.groups?.['name']?.trim()
      if (variable != null && variable !== '') {
        walk(variable)
      }
    }
  }

  private getAnimationNameFromRule(rule: KeyframesAtRule): string {
    return rule.params
  }

  private getAnimationNameValueFromDecl(decl: AnimationDecl): string | null {
    const val = (decl.prop === 'animation' ? decl.value.split(' ')[0] : decl.value)?.trim()
    return val === '' ? null : (val ?? null)
  }
}

function isAtRule(n: postcss.Node): n is postcss.AtRule {
  return n.type === 'atrule'
}

function isRule(n: postcss.Node): n is postcss.Rule {
  return n.type === 'rule'
}

function isDecl(n: postcss.Node): n is postcss.Declaration {
  return n.type === 'decl'
}
