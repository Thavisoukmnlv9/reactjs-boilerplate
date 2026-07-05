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
      {
        type: 'add',
        path: 'src/features/{{kebabCase name}}/i18n/en.ts',
        templateFile: 'plop-templates/feature/i18n/en.ts.hbs',
      },
      {
        type: 'add',
        path: 'src/features/{{kebabCase name}}/i18n/lo.ts',
        templateFile: 'plop-templates/feature/i18n/lo.ts.hbs',
      },
      {
        type: 'add',
        path: 'src/features/{{kebabCase name}}/i18n/th.ts',
        templateFile: 'plop-templates/feature/i18n/th.ts.hbs',
      },
      {
        type: 'add',
        path: 'src/features/{{kebabCase name}}/i18n/vi.ts',
        templateFile: 'plop-templates/feature/i18n/vi.ts.hbs',
      },
      {
        type: 'add',
        path: 'src/features/{{kebabCase name}}/i18n/zh.ts',
        templateFile: 'plop-templates/feature/i18n/zh.ts.hbs',
      },
      {
        type: 'add',
        path: 'src/features/{{kebabCase name}}/i18n/index.ts',
        templateFile: 'plop-templates/feature/i18n/index.ts.hbs',
      },
      () =>
        [
          '',
          '✅ Feature created. Final steps:',
          '   1. Register its routes in src/app/router/router.tsx',
          '   2. Register its i18n bundle in src/app/i18n/index.ts and src/app/i18n/i18next.d.ts',
          '',
        ].join('\n'),
    ],
  })
}
