export const typeDefsArticle = `#graphql
    type Article{
        id:ID,
        title:String,
        avatar:String,
        description:String,
        category:Category  # category sẽ được định nghĩa ở file resolver và trả về type Category
    }
   
    input ArticleInput{
        title:String,
        avatar:String,
        description:String,
        categoryId:String
    }
    type Query {
        getListArticle(
            sortKey: String,
            sortValue: String,
            currentPage: Int = 1,
            limitItems: Int = 12,
            filterKey: String,
            filterValue: String,
            keyword: String
        ): [Article]
    }

    type Mutation{
        createArticle(article : ArticleInput): Article,
        deleteArticle(id: ID) :String,
        updateArticle(id:ID,article : ArticleInput): Article,
    }
    `;// The GraphQL schema //“Khi ai đó hỏi API GraphQL của tôi bằng query hello, tôi sẽ trả về một chuỗi (string).”
