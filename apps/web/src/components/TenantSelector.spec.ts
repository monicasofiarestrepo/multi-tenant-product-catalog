import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it } from 'vitest'
import TenantSelector from './TenantSelector.vue'

describe('TenantSelector', () => {
  it('renders tenant options', () => {
    setActivePinia(createPinia())
    const wrapper = mount(TenantSelector, {
      props: {
        tenants: [
          { id: 'a', name: 'Acme', slug: 'acme' },
          { id: 'b', name: 'Bike', slug: 'bike' },
        ],
      },
    })
    const options = wrapper.findAll('option')
    expect(options.length).toBeGreaterThanOrEqual(2)
    expect(wrapper.text()).toContain('Acme')
  })
})
