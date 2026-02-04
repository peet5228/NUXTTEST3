// import { createVuetify } from 'vuetify'
// import * as components from 'vuetify/components'
// import * as directives from 'vuetify/directives'

// export default defineNuxtPlugin((nuxtApp) => {
//   const vuetify = createVuetify({ components, directives })
//   nuxtApp.vueApp.use(vuetify)
// })

// plugins/vuetify.ts
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({})
  app.vueApp.use(vuetify)
})
