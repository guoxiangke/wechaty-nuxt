export const state = () => ({
  hello: false,
  helloFail: false,
  progress: 0,
  sample: 341,
  sample2: 243,
  sample2b: '243b',
  someObj: {
    id: 0,
    msg: ''
  }
})

export const mutations = {
  SET_PROGRESS(state: any, progress: any) {
    state.progress = progress
  },

  SET_SAMPLE(state: any, sample: any) {
    state.sample = sample
  },

  SET_SAMPLE2(state: any, sample2: any) {
    state.sample2 = sample2
  },

  SET_SAMPLE2B(state: any, sample2b: any) {
    state.sample2b = sample2b
  },

  SET_SOMEOBJ(state: any, someObj: any) {
    Object.assign(state, { someObj })
  }
}
