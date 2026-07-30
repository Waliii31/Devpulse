import { createSlice } from '@reduxjs/toolkit'

type ThemeState = {
  mode: 'light' | 'dark'
}

const initialState: ThemeState = {
  mode: 'dark',
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'dark' ? 'light' : 'dark'
    },
  },
})

export const { toggleTheme } = themeSlice.actions
export default themeSlice.reducer
