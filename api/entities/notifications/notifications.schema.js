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
exports.NotificationSchema = exports.Notification = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Notification = class Notification {
};
exports.Notification = Notification;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'User', required: true, autopopulate: true }),
    __metadata("design:type", Object)
], Notification.prototype, "receiver", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'User', required: false, autopopulate: true }),
    __metadata("design:type", Object)
], Notification.prototype, "sender", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Post', autopopulate: true }),
    __metadata("design:type", Object)
], Notification.prototype, "post", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Battle', autopopulate: true }),
    __metadata("design:type", Object)
], Notification.prototype, "battle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Notification.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Notification.prototype, "text", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Notification.prototype, "checked", void 0);
exports.Notification = Notification = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Notification);
exports.NotificationSchema = mongoose_1.SchemaFactory.createForClass(Notification);
exports.NotificationSchema.post('find', function (docs) {
    docs.forEach(doc => {
        if (!doc.receiver) {
            doc.receiver = {
                _id: '000000000000000000000000',
                nick: 'Unknown',
                avatar: '',
            };
        }
    });
});
exports.NotificationSchema.post('findOne', function (doc) {
    if (doc && !doc.receiver) {
        doc.receiver = {
            _id: '000000000000000000000000',
            nick: 'Unknown',
            avatar: '',
        };
    }
});
//# sourceMappingURL=notifications.schema.js.map