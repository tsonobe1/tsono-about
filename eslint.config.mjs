import { createConfigForNuxt } from '@nuxt/eslint-config'
import prettierConfig from 'eslint-config-prettier/flat'

export default createConfigForNuxt({}).append(prettierConfig)
