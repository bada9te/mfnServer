import mongoose from "mongoose";


// planned tasks schema
const plannedTasksSchema: mongoose.Schema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    taskType: {
        type: String,
        required: true,
    },
}, { timestamps: true });


// model
const plannedTasksModel = mongoose.model("PlannedTask", plannedTasksSchema);


export default plannedTasksModel;