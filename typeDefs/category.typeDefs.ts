export const typeDefsCategory = `#graphql

    type Category {
        id: ID,
        title: String,
        avatar: String
    }

    input CategoryInput {
        title: String,
        avatar: String
    }

    type Query {
        getListCategory: [Category]     
    }

    type Mutation{
        createCategory(category: CategoryInput): Category,
        deleteCategory(id: ID): String,
        updateCategory(id: ID, category: CategoryInput): Category,

    }
    `;// The GraphQL schema //“Khi ai đó hỏi API GraphQL của tôi bằng query hello, tôi sẽ trả về một chuỗi (string).”
