"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportRequestsService = void 0;
const common_1 = require("@nestjs/common");
const support_requests_schema_1 = require("./support-requests.schema");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
let SupportRequestsService = class SupportRequestsService {
    constructor(supportRequestModel) {
        this.supportRequestModel = supportRequestModel;
    }
    async createSupportRequest(supReq) {
        const inserted = await this.supportRequestModel.create(supReq);
        return inserted;
    }
    async getAllSupportRequsts(range) {
        return await this.supportRequestModel.find()
            .skip(range.offset)
            .limit(range.limit);
    }
    async closeSupportRequest(_id) {
        return await this.supportRequestModel.findByIdAndUpdate(_id, { isClosed: true }, { new: true, upsert: true });
    }
    async getSupportRequestById(_id) {
        return await this.supportRequestModel.findById(_id);
    }
};
exports.SupportRequestsService = SupportRequestsService;
exports.SupportRequestsService = SupportRequestsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(support_requests_schema_1.SupportRequest.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], SupportRequestsService);
//# sourceMappingURL=support-requests.service.js.map