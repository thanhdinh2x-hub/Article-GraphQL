"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const merge_1 = require("@graphql-tools/merge");
const article_typeDefs_1 = require("./article.typeDefs");
const category_typeDefs_1 = require("./category.typeDefs");
const user_typeDefs_1 = require("./user.typeDefs");
exports.typeDefs = (0, merge_1.mergeTypeDefs)([
    article_typeDefs_1.typeDefsArticle,
    category_typeDefs_1.typeDefsCategory,
    user_typeDefs_1.typeDefsUser
]);
