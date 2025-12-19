"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const express = require("express");
const path = require("path");
const dotenv_1 = require("dotenv");
dotenv_1.default.config();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(compression());
    app.use(cookieParser());
    app.enableCors({
        origin: process.env.CLIENT_BASE,
        credentials: true,
    });
    app.use(express.static(path.join(__dirname, 'public')));
    await app.listen(8000);
}
bootstrap();
//# sourceMappingURL=main.js.map