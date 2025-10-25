import express, { Express, Request, Response } from "express";
import dotenv from "dotenv"
import { connect as connectDatabase } from "./config/database";

// import các thư viện cho graphQL
// import gql from "appllo-server-express";// lỗi rồi do gql ở trong thư viện graphql-tag cơ vì phiên bản 2025 nó nâng cấp thành @apollo/server
import { ApolloServer } from '@apollo/server'; //Đây là “bộ não” xử lý các truy vấn GraphQL của bạn.
import { expressMiddleware } from '@as-integrations/express5';//Cái này là “cầu nối” (bridge) giữa Apollo Server và Express.
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer' //Đây là plugin hỗ trợ “đóng server gọn gàng” (graceful shutdown). //Hiểu đơn giản: Plugin này giúp bạn tắt server an toàn và chuyên nghiệp.
import http from 'http'; //nạp module http gốc của Node
import cors from 'cors';
//end  import các thư viện cho graphQL

import { typeDefs } from "./typeDefs/index.typeDefs";
import { resolvers } from "./resolvers/index.resolver";
import { requireAuth } from "./middlewares/auth.middleware";


const startServer = async () => {   // phải tạo thành hàm thì server.start(); mới dùng await đc
    dotenv.config();
    connectDatabase();

    const app: Express = express(); // app phải thuộc express
    const httpServer = http.createServer(app);// dùng cho GraphQL và  tạo server HTTP, dùng app (Express) làm “hàm xử lý request”


    const port: string | number = process.env.PORT;  // typescript nó định nghĩa kiểu dữ liệu như thế vì port từ env nó là string trong khi nhập trực tiếp vào thì là number


    //GraphQL API
    app.use("/graphql", requireAuth); // sau khi đi vào cổng /graphql thì chạy qua middle authen luôn
    // Set up Apollo Server
    const apolloServer = new ApolloServer({ //tạo một GraphQL server.
        typeDefs,//mô tả schema (kiểu dữ liệu, query...). // ghi typeDefs: typeDefs, cũng đc vì nếu giống tên biến thì ghi 1 thôi
        resolvers,//các hàm xử lý thực tế.
        introspection: true, //để gợi ý code trong trang graphql
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],//mở rộng hành vi của server. // Đây là plugin giúp Apollo biết khi nào HTTP server (Express) đóng lại → Apollo cũng tự “dọn dẹp” (drain) các kết nối WebSocket hoặc request đang chờ.//Nếu không có plugin này, khi bạn tắt server, Apollo có thể chưa đóng hết kết nối → gây lỗi shutdown không gọn.
    });

    await apolloServer.start();//Dòng này sẽ khởi tạo nội bộ Apollo (chuẩn bị schema, resolvers, plugin, context, v.v.) //Nghĩa là:“Apollo, hãy chuẩn bị sẵn sàng để tôi gắn mày vào Express!”

    app.use(
        '/graphql', //tất cả request gửi đến /graphql mới đi qua chuỗi middleware này.
        cors(), //cho phép các domain khác gọi API của bạn.
        express.json(), //parse JSON trong body request (vì GraphQL gửi JSON). //Nếu bạn không có express.json(), Express không hiểu body là JSON, nên Apollo sẽ không nhận được query → lỗi 
        expressMiddleware(apolloServer, { //expressMiddleware() → chuyển request sang Apollo xử lý. //biến Apollo Server thành middleware của Express — tức là Apollo sẽ xử lý các request GraphQL tại đây.
            context: async ({ req }) => ({ ...req }) //Apollo gọi context() → tạo ra context chứa thông tin request.//Apollo đọc query, gọi resolver tương ứng → resolver có thể truy cập context để biết://ai đang gửi request,//token, headers, v.v.
        }),
    );

    await new Promise<void>((resolve) => {      // thay thế cho app.listen(3000); tại vì bthg app.listen(3000) viết tắt cho '//const http = require('http'); //const server = http.createServer(app); //server.listen(3000);'

        httpServer.listen({ port: port }, () => resolve());
    });// Tạo ra một Promise (lời hứa). //Khi server mở xong, gọi resolve() → Promise hoàn thành. nhớ là phải có await vì chương trình chính không đợi promise
    console.log(`🚀 Server ready at http://localhost:${port}`);

}

startServer();