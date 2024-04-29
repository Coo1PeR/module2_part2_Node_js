const http = require("http");
const auth = require("./controllers/login.js");
const gallery = require("./controllers/gallery.js");
const hostname = "127.0.0.1";
const PORT = 2000;
const path = require("path");
const fs = require("fs");

const server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, Content-type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");

    console.log('req.method:', req.method);
    console.log('req.url:', req.url);
    if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
    } else if (req.url === "/login" && req.method === "POST") {
        auth.login(req, res);
    } else if (req.url.startsWith("/gallery") && req.method === "GET" && req.url.length > 16){
        const filePath = path.join(__dirname, req.url);
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.statusCode = 404;
                res.end("File not found");
                return;
            }
            // Определение MIME-типа
            const ext = path.extname(filePath);
            let contentType = "text/plain";
            switch (ext) {
                case ".jpg":
                case ".jpeg":
                    contentType = "image/jpeg";
                    break;
                case ".png":
                    contentType = "image/png";
                    break;
                case ".gif":
                    contentType = "image/gif";
                    break;
            }
            //res.setHeader("Content-Type", contentType);
            res.end(data);
        });
    } else if (req.url.startsWith("/gallery") && req.method === "GET") {
        gallery.getGallery(req, res);

    } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ errorMessage: "Not Found" }));
    }
});

// Запуск сервера
server.listen(PORT, hostname, () => {
    console.log(`Server is running on port ${hostname}:${PORT}`);
});