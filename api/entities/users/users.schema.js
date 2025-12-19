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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = exports.User = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let User = class User {
};
exports.User = User;
__decorate([
    (0, mongoose_1.Prop)({
        _id: false,
        type: {
            email: { type: String },
            password: { type: String, select: false }
        },
    }),
    __metadata("design:type", Object)
], User.prototype, "local", void 0);
__decorate([
    (0, mongoose_1.Prop)((0, mongoose_1.raw)({
        id: String,
        token: String,
        name: String,
    })),
    __metadata("design:type", Object)
], User.prototype, "facebook", void 0);
__decorate([
    (0, mongoose_1.Prop)((0, mongoose_1.raw)({
        id: String,
        token: String,
        name: String,
    })),
    __metadata("design:type", Object)
], User.prototype, "twitter", void 0);
__decorate([
    (0, mongoose_1.Prop)((0, mongoose_1.raw)({
        id: String,
        token: String,
        email: String,
        name: String,
    })),
    __metadata("design:type", Object)
], User.prototype, "google", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        _id: false,
        type: {
            address: { type: String },
            message: { type: String },
            signed: { type: String },
        }
    }),
    __metadata("design:type", Object)
], User.prototype, "web3", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "nick", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: "Hello there, I am a newbie!" }),
    __metadata("design:type", String)
], User.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: "" }),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: "" }),
    __metadata("design:type", String)
], User.prototype, "background", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'User' }] }),
    __metadata("design:type", Array)
], User.prototype, "subscribers", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'User' }] }),
    __metadata("design:type", Array)
], User.prototype, "subscribedOn", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Post' }] }),
    __metadata("design:type", Array)
], User.prototype, "likedPosts", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Post' }] }),
    __metadata("design:type", Array)
], User.prototype, "savedPosts", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "verified", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "level", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: [] }),
    __metadata("design:type", Array)
], User.prototype, "achievements", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Post', autopopulate: true }] }),
    __metadata("design:type", Array)
], User.prototype, "pinnedPosts", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
exports.UserSchema.plugin(require("mongoose-autopopulate"));
//# sourceMappingURL=users.schema.js.map