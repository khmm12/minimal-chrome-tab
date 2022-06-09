import { render } from '@test/helpers/solid'
import Layout from '.'

describe('Layout', () => {
  it('renders correctly', () => {
    const { container } = render(() => (
      <Layout>
        <div>Header</div>
        <div>Content</div>
        <div>Footer</div>
      </Layout>
    ))

    expect(container.firstChild).toMatchSnapshot()
  })
})
