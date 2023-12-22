const fs = require('fs');
const path = require('path');
const cron = require("node-schedule");
const battlesModel = require('../../models/battles/battles.model');
const removeJunkFiles = require('../cleaner/cleaner');
require('dotenv').config();


// planned tasks file path and init vars / handlers
const plannedTasksFilePath = path.join(__dirname, 'plannedTasks.json');
let currentData = JSON.parse(fs.readFileSync(plannedTasksFilePath, 'utf8').toString());;


function exitHandler(options, exitCode) {
    saveFile();
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
    if (process.env.ENV_TYPE === "test") {
        console.log('[CRON] Skipping because of TEST env.')
    } else {
        // program will not close instantly
        process.stdin.resume();
        
        // default task
        cron.scheduleJob("automated_cleaner", '0 * * * *', () => {
            removeJunkFiles();
        });
        // apply saved
        applySavedTasks();
        // notify
        console.log("[CRON] Tasks initialized.")
    }
}

// create task
const createTask = (id, date, cb, taskType) => {
    cron.scheduleJob(date, cb)
    currentData.push({id, date, taskType});
}

// cancel task
const cancelTask = (id) => {
    cron.cancelJob(id);
    currentData.splice(currentData.indexOf(item => item.id === id), 1);
}

// read planned tasks after restart
const applySavedTasks = () => {
    // battle ids array
    let battleIdsToRemove = [];
    // [{"id":"65604f5df640a05008f08fe4","date":"2023-11-25T07:23:09.901Z","taskType":"finishBattle"}]
    // do important staff
    currentData.forEach(task => {
        // battle
        if (task.taskType === "finishBattle") {
            if (new Date().getTime() > new Date(task.date).getTime()) {
                battleIdsToRemove.push(task.id);
            } else {
                console.log('[CRON] Scheduling battle setWinner task, bId:', task.id);
                cron.scheduleJob(task.date, async() => {
                    setBattlesWinnersByIds([task.id]);
                });
            }
        }
    });

    // set battle winners
    if (battleIdsToRemove.length > 0) {
        setBattlesWinnersByIds(battleIdsToRemove);
    }
}



// operate battle ids
const setBattlesWinnersByIds = async(ids) => {
    for await (const id of ids) {
        console.log(`[CRON] Executing setWinner task, bId: ${id}`);
        await battlesModel.setWinnerByBattleId(id)
        .then(() => {
            currentData.splice(currentData.indexOf(item => item.id === id), 1);
        })
        .catch(console.error);
    }
}



// WRITE FILE
const saveFile = () => {
    console.log('[CRON] Saving tasks...')
    try {
        fs.writeFileSync(plannedTasksFilePath, JSON.stringify(currentData));
    } catch (err) {
        console.log('Error writing plannedTasks.json :' + err.message)
    }
}




// export all
module.exports = {
    initDefaultCronTasks,
    createTask,
    cancelTask,
}
