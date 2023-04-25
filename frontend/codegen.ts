import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  // TODO: make URL configurable, or emit help text on connection failure?
  // Right now we can only run frontend codegen when graphql is local.
  schema: "http://localhost:4000/graphql",
  generates: {
    "src/generated/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      }
    }
  },
  ignoreNoDocuments: true,
};

export default config;
