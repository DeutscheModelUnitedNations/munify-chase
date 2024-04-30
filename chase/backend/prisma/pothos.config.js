module.exports = {
  /** Input type generation config */
  inputs: {
    outputFilePath: "./prisma/generated/graphql/pothosCrud/inputs.ts",
    /** Create simpler inputs for easier customization and ~65% less generated code. Default: `false` */
    simple: true,
    /** How to import the Prisma namespace. Default: `"import { Prisma } from '.prisma/client';"` */
    prismaImporter: "import { Prisma } from '../../client';",
    /** Map all Prisma fields with "@id" attribute to Graphql "ID" Scalar.
     *
     * ATTENTION: Mapping non String requires a conversion inside resolver, once GraphQl ID Input are coerced to String by definition. Default: false */
    mapIdFieldsToGraphqlId: true,
  },
  crud: {
    outputDir: "./prisma/generated/graphql/pothosCrud/",
    /** How to import the Prisma namespace at the objects.ts file. Default `"import { Prisma } from '.prisma/client';"`. Please use "resolverImports" to import prismaClient at resolvers. */
    prismaImporter: "import { Prisma } from '../../client';",
    /** How to call the prisma client. Default `'_context.prisma'` */
    prismaCaller: "db",
    /** Any additional imports you might want to add to the resolvers (e.g. your prisma client). Default: `''` */
    resolverImports: "\nimport { db } from '../../../../../db';",
    /** Caution: This delete the whole folder (Only use if the folder only has auto generated contents). A boolean to delete output dir before generate. Default: False */
    deleteOutputDirBeforeGenerate: true,
  },
  global: {
    builderImporters: "import { builder } from '../builder';",
  },
};
