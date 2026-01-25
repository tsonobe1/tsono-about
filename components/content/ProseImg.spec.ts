import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ProseImg from './ProseImg.vue'

describe('ProseImg', () => {
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should optimize event listeners', async () => {
    const wrapper = mount(ProseImg, {
      props: {
        src: 'image.jpg',
        alt: 'Test Image',
      },
      global: {
        stubs: {
          Teleport: true,
          Transition: true,
        },
      },
    })

    // 1. Initial State: No listener should be added
    const addCallsInitial = addEventListenerSpy.mock.calls.filter(
      (call) => call[0] === 'keydown',
    )
    expect(addCallsInitial.length).toBe(0)

    // 2. Open Modal
    await wrapper.find('img').trigger('click')

    // Listener should be added now
    const addCallsAfterOpen = addEventListenerSpy.mock.calls.filter(
      (call) => call[0] === 'keydown',
    )
    expect(addCallsAfterOpen.length).toBe(1)

    // 3. Close Modal
    // Finding the overlay to click. Since Teleport is stubbed to true, it should be in the wrapper.
    const overlay = wrapper.find('.fixed.inset-0')
    expect(overlay.exists()).toBe(true)
    await overlay.trigger('click')

    // Listener should be removed
    const removeCalls = removeEventListenerSpy.mock.calls.filter(
      (call) => call[0] === 'keydown',
    )
    expect(removeCalls.length).toBeGreaterThanOrEqual(1)

    // 4. Verify no new listener added (total added calls still 1)
    const addCallsFinal = addEventListenerSpy.mock.calls.filter(
      (call) => call[0] === 'keydown',
    )
    expect(addCallsFinal.length).toBe(1)
  })
})
