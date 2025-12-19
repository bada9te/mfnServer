"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModerationsModule = void 0;
const common_1 = require("@nestjs/common");
const moderations_service_1 = require("./moderations.service");
const mongoose_1 = require("@nestjs/mongoose");
const moderations_schema_1 = require("./moderations.schema");
const moderations_resolver_1 = require("./moderations.resolver");
let ModerationsModule = class ModerationsModule {
};
exports.ModerationsModule = ModerationsModule;
exports.ModerationsModule = ModerationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: moderations_schema_1.Moderation.name, schema: moderations_schema_1.ModerationSchema }])
        ],
        providers: [moderations_service_1.ModerationsService, moderations_resolver_1.ModerationsResolver],
        exports: [moderations_service_1.ModerationsService],
    })
], ModerationsModule);
//# sourceMappingURL=moderations.module.js.map