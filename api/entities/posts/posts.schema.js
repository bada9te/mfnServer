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
exports.PostSchema = exports.Post = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Post = class Post {
};
exports.Post = Post;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'User', required: true, autopopulate: { select: '_id nick avatar' } }),
    __metadata("design:type", Object)
], Post.prototype, "owner", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Post.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Post.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Post.prototype, "audio", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Post.prototype, "image", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Post.prototype, "likes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Post.prototype, "saves", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Post.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Boolean)
], Post.prototype, "downloadsAllowed", void 0);
exports.Post = Post = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Post);
exports.PostSchema = mongoose_1.SchemaFactory.createForClass(Post);
exports.PostSchema.plugin(require("mongoose-autopopulate"));
exports.PostSchema.post('find', function (docs) {
    docs.forEach(doc => {
        if (!doc.owner) {
            doc.owner = {
                _id: '000000000000000000000000',
                nick: 'Unknown',
                avatar: '',
            };
        }
    });
});
exports.PostSchema.post('findOne', function (doc) {
    if (doc && !doc.owner) {
        doc.owner = {
            _id: '000000000000000000000000',
            nick: 'Unknown',
            avatar: '',
        };
    }
});
//# sourceMappingURL=posts.schema.js.map