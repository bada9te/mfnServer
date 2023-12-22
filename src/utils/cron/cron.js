const fs = require('fs');
const path = require('path');
const cron = require("node-schedule");
const battlesModel = require('../../models/battles/battles.model');
const removeJunkFiles = require('../cleaner/cleaner');
require('dotenv').config();


// planned tasks file path and init vars / handlers
const plannedTasksFilePath = path.join(__dirname, 'plannedTasks.json');
let currentData = JSON.parse(fs.readFileSync(plannedTasksFilePath, 'utf8').toString());;


// init
const initDefaultCronTasks = () => {
    if (process.env.ENV_TYPE === "test") {
        console.log('[CRON] Skipping because of TEST env.')
    } else {
        // program will not close instantly
        //process.stdin.resume();
        
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
    saveFile();
}


// cancel task
const cancelTask = (id) => {
    cron.cancelJob(id);
    currentData.splice(currentData.indexOf(item => item.id === id), 1);
    saveFile();
}


// read planned tasks after restart
const applySavedTasks = () => {
    // battle ids array
    let battleIdsToRemove = [];
    // do important stuff
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
    saveFile();
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
