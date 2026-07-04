// Partial locale — any missing key falls back to English (fallbackLng: 'en').
// Demonstrates the namespaced, incremental-translation workflow.
export const es = {
  common: {
    appName: 'React Boilerplate',
    actions: {
      create: 'Crear',
      edit: 'Editar',
      delete: 'Eliminar',
      cancel: 'Cancelar',
      save: 'Guardar',
      search: 'Buscar',
    },
    states: {
      loading: 'Cargando…',
      empty: 'Nada por aquí todavía',
      error: 'Algo salió mal',
    },
    language: 'Idioma',
  },
  auth: {
    signIn: 'Iniciar sesión',
    email: 'Correo electrónico',
    password: 'Contraseña',
    signOut: 'Cerrar sesión',
  },
  users: {
    title: 'Usuarios',
    newUser: 'Nuevo usuario',
  },
  dashboard: {
    title: 'Panel',
    welcome: 'Bienvenido de nuevo',
  },
}
