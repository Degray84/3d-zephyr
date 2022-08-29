import { describe, it, expect } from 'vitest'

import { shallowMount } from '@vue/test-utils'
import NavigationBar from '../common/navigation/TheNavigationBar.vue'

describe('NavigationBar', () => {
  it('NavigationBar renders properly', () => {
    const wrapper = shallowMount(NavigationBar, {
      stubs: ['RouterLink']
    });

    expect(wrapper.html()).toContain('nav')
  })
})
