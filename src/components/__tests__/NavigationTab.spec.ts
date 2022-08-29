import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import NavigationTab from '../common/navigation/NavigationTab.vue'

describe('NavigationTab', () => {
  it('NavigationTab renders properly', () => {
    const wrapper = mount(NavigationTab, { props: { label: 'test', icon: 'home' } })
    expect(wrapper.text()).toContain('test')
    expect(wrapper.text()).toContain('home')
  })
})
