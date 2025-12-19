"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlannedTasksModule = void 0;
const common_1 = require("@nestjs/common");
const planned_tasks_service_1 = require("./planned-tasks.service");
const mongoose_1 = require("@nestjs/mongoose");
const planned_tasks_schema_1 = require("./planned-tasks.schema");
let PlannedTasksModule = class PlannedTasksModule {
};
exports.PlannedTasksModule = PlannedTasksModule;
exports.PlannedTasksModule = PlannedTasksModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: planned_tasks_schema_1.PlannedTask.name, schema: planned_tasks_schema_1.PlannedTasksSchema }]),
        ],
        providers: [planned_tasks_service_1.PlannedTasksService],
        exports: [planned_tasks_service_1.PlannedTasksService],
    })
], PlannedTasksModule);
//# sourceMappingURL=planned-tasks.module.js.map