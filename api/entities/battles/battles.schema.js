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
exports.BattleSchema = exports.Battle = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Battle = class Battle {
};
exports.Battle = Battle;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Battle.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Number)
], Battle.prototype, "chainId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Battle.prototype, "contractAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", Object)
], Battle.prototype, "initiator", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Post', autopopulate: true }),
    __metadata("design:type", Object)
], Battle.prototype, "post1", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Post', autopopulate: true }),
    __metadata("design:type", Object)
], Battle.prototype, "post2", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Battle.prototype, "post1Score", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Battle.prototype, "post2Score", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Post' }),
    __metadata("design:type", Object)
], Battle.prototype, "winner", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Battle.prototype, "willFinishAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Battle.prototype, "finished", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'User' }] }),
    __metadata("design:type", Object)
], Battle.prototype, "votedBy", void 0);
exports.Battle = Battle = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Battle);
exports.BattleSchema = mongoose_1.SchemaFactory.createForClass(Battle);
exports.BattleSchema.post('find', function (docs) {
    docs.forEach(doc => {
        if (!doc.initiator) {
            doc.initiator = {
                _id: '000000000000000000000000',
                nick: 'Unknown',
                avatar: '',
            };
        }
        (doc?.votedBy?.length) && doc.votedBy.forEach(voter => {
            if (!voter) {
                voter = {
                    _id: '000000000000000000000000',
                    nick: 'Unknown',
                    avatar: '',
                };
            }
        });
    });
});
exports.BattleSchema.post('findOne', function (doc) {
    if (doc && !doc.initiator) {
        doc.initiator = {
            _id: '000000000000000000000000',
            nick: 'Unknown',
            avatar: '',
        };
    }
    (doc?.votedBy?.length) && doc.votedBy.forEach(voter => {
        if (!voter) {
            voter = {
                _id: '000000000000000000000000',
                nick: 'Unknown',
                avatar: '',
            };
        }
    });
});
//# sourceMappingURL=battles.schema.js.map