import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';

import { typeDefsArticle } from "./article.typeDefs";
import { typeDefsCategory } from "./category.typeDefs";
import { typeDefsUser } from "./user.typeDefs";

export const typeDefs = mergeTypeDefs([
  typeDefsArticle,
  typeDefsCategory,
  typeDefsUser
]);