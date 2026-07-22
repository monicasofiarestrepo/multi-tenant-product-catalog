import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it } from 'vitest'
import TenantSelector from './TenantSelector.vue'
import { ALL_TENANTS_ID } from '@/stores/tenant'

describe('TenantSelector', () => {
  it('renders Todas first and tenants A-Z', () => {
    setActivePinia(createPinia())
    const wrapper = mount(TenantSelector, {
      props: {
        tenants: [
          { id: 'z', name: 'Zebra', slug: 'zebra' },
          { id: 'a', name: 'Acme', slug: 'acme' },
          { id: 'b', name: 'Bike', slug: 'bike' },
        ],
      },
    })
    const options = wrapper.findAll('option')
    expect(options[0]!.text()).toBe('Todas')
    expect(options[0]!.element.value).toBe(ALL_TENANTS_ID)
    expect(options.map((o) => o.text())).toEqual(['Todas', 'Acme', 'Bike', 'Zebra'])
  })
})
