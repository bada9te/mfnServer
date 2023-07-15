const fs = require('fs');
const path = require('path');
const cron = require("node-schedule");
const battlesModel = require('../../models/battles/battles.model');
const removeJunkFiles = require('../cleaner/cleaner');



// planned tasks file path and init vars / handlers
const plannedTasksFilePath = path.join(__dirname, 'plannedTasks.json');
let currentData = null;

// program will not close instantly
process.stdin.resume();

function exitHandler(options, exitCode) {
    console.log("[CRON] Saving cron tasks...");
    saveFile();
    console.log("[CRON] Saved");
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
}

// do something when app is closing
process.on('exit', exitHandler.bind(null, {exit:true}));

// catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

// catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));



// init
const initDefaultCronTasks = () => {
    // default task
    cron.scheduleJob("automated_cleaner", '0 * * * *', () => {
        removeJunkFiles();
    });
    // apply saved
    applySavedTasks();
    // notify
    console.log("[CRON] Tasks initialized.")
}



// create task
const createTask = (id, date, cb, taskType) => {
    cron.scheduleJob(date, cb)
    saveTask({id, date, taskType});
}



// cancel task
const cancelTask = (id) => {
    cron.cancelJob(id);
    currentData.splice(currentData.indexOf(item => item.id === id), 1);
}



// read planned tasks after restart
const applySavedTasks = () => {
    if (currentData === null) {
        readFile();
    }
    // battle ids array
    let battleIdsToRemove = [];
    
    // do important staff
    currentData.forEach(task => {
        // battle
        if (task.taskType === "finishBattle") {
            if (new Date().getTime() > new Date(task.date).getTime()) {
                battleIdsToRemove.push(task.id);
            } else {
                console.log('[CRON] Scheduling battle setWinner task, bId:', task.id);
                cron.scheduleJob(task.date, async() => {
                    console.log(`[TASK] Setting winner by battle id: ${task.id}`);
                    await battlesModel.setWinnerByBattleId(task.id);
                });
            }
        }
    });

    // set battle winners
    if (battleIdsToRemove.length > 0) {
        setBattlesWinnersByIds(battleIdsToRemove);
    }
}



// save planned task
const saveTask = (taskObject) => {
    if (currentData === null) {
        readFile();
    }

    currentData.push(taskObject);
    console.log(currentData)
}



// operate battle ids
const setBattlesWinnersByIds = async(ids) => {
    for await (const id of ids) {
        console.log(`[CRON] Executing setWinner task, bId: ${id}`);
        await battlesModel.setWinnerByBattleId(id);
        currentData.splice(currentData.indexOf(item => item.id === id), 1);
    }
}



// WRITE FILE
const saveFile = () => {
    if (currentData === null) {
        return;
    }

    try {
        fs.writeFileSync(plannedTasksFilePath, JSON.stringify(currentData));
    } catch (err) {
        console.log('Error writing plannedTasks.json :' + err.message)
    }
}



// READ FILE
const readFile = () => {
    let data = fs.readFileSync(plannedTasksFilePath, 'utf8').toString();
    if (!data || data === '') {
        data = "[]";
    }
    currentData = JSON.parse(data);
}



// export all
module.exports = {
    initDefaultCronTasks,
    createTask,
    cancelTask,
}
