
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';

import { resolversArticle } from "./article.resolver";
import { resolversCategory } from "./category.resolver";
import { resolversUser } from "./user.resolver";

export const resolvers= mergeResolvers([
  resolversArticle,
  resolversCategory,
  resolversUser
]);