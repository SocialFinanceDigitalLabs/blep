import { register, getMap } from './Register'

test('register component', () => {
  const TestComponent = () => {
    console.log('setup')
  }

  const props = { name: 'test-component', component: TestComponent }

  expect(register(props.name, props.component)).toEqual({
    'test-component': TestComponent,
  })
})

test('get map', () => {
  const TestComponent = () => {
    console.log('setup')
  }

  const props = { name: 'test-component', component: TestComponent }
  register(props.name, props.component)

  expect(getMap()).toEqual({
    'test-component': TestComponent,
  })
})
