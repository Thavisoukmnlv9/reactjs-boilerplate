/**
 * Feature-slice generator. Run `npm run gen:feature` and enter a kebab-case
 * name (e.g. "orders") to scaffold a consistent vertical slice.
 *
 * @param {import('plop').NodePlopAPI} plop
 */
export default function (plop) {
  plop.setGenerator('feature', {
    description: 'Scaffold a new feature slice under src/features',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Feature name (kebab-case, e.g. "orders"):',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/features/{{kebabCase name}}/index.ts',
        templateFile: 'plop-templates/feature/index.ts.hbs',
      },
      {
        type: 'add',
        path: 'src/features/{{kebabCase name}}/routes.tsx',
        templateFile: 'plop-templates/feature/routes.tsx.hbs',
      },
      {
        type: 'add',
        path: 'src/features/{{kebabCase name}}/types.ts',
        templateFile: 'plop-templates/feature/types.ts.hbs',
      },
      {
        type: 'add',
        path: 'src/features/{{kebabCase name}}/api/{{kebabCase name}}-api.ts',
        templateFile: 'plop-templates/feature/api/api.ts.hbs',
      },
      {
        type: 'add',
        path: 'src/features/{{kebabCase name}}/api/queries.ts',
        templateFile: 'plop-templates/feature/api/queries.ts.hbs',
      },
      {
        type: 'add',
        path: 'src/features/{{kebabCase name}}/pages/{{pascalCase name}}Page.tsx',
        templateFile: 'plop-templates/feature/pages/Page.tsx.hbs',
      },
      () => '\n✅ Feature created. Final step: register its routes in src/app/router/router.tsx\n',
    ],
  })
}
