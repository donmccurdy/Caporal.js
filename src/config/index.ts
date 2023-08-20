/**
 * @packageDocumentation
 * @internal
 */
import type { Configurator } from "../types"

export function createConfigurator<T extends {}>(defaults: T): Configurator<T> {
  const _defaults = defaults
  let config = defaults
  return {
    reset(): T {
      config = _defaults
      return config
    },
    get<K extends keyof T>(key: K): T[K] {
      return config[key]
    },
    getAll(): T {
      return config
    },
    set(props: Partial<T>): T {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return Object.assign(config as any, props)
    },
  }
}
