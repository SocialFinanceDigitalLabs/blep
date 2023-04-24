import { BindingProps } from '../init/Init'

export interface ComponentMap {
  [key: string]: (props: BindingProps) => void
}

let map: ComponentMap = {}

const register = (
  name: string,
  component: (props: BindingProps) => void
): ComponentMap => {
  const newMap = { ...map }
  newMap[name] = component
  map = newMap

  return map
}

const getMap = (): ComponentMap => {
  return map
}

export { register, getMap }
