import { TTask } from "./types";

import fs from 'fs';
import path from 'path';
import cron from "node-schedule";
import battlesModel from '../../models/battles/battles.model';
import removeJunkFiles from '../cleaner/cleaner';
require('dotenv').config();


// planned tasks file path and init vars / handlers
const plannedTasksFilePath = path.join(__dirname, 'plannedTasks.json');
let currentData: TTask[] = JSON.parse(fs.readFileSync(plannedTasksFilePath, 'utf8').toString());


// init
const initDefaultCronTasks = (): void => {
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
const createTask = (id: string, date: Date, cb: () => void, taskType: string): void => {
    cron.scheduleJob(date, cb)
    currentData.push({id, date, taskType});
    saveFile();
}


// cancel task
const cancelTask = (id: string): void => {
    cron.cancelJob(id);
    const idx = currentData.findIndex(item => item.id === id);
    idx !== -1 && currentData.splice(idx, 1);
    saveFile();
}


// read planned tasks after restart
const applySavedTasks = (): void => {
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
const setBattlesWinnersByIds = async(ids: string[]): Promise<void> => {
    for await (const id of ids) {
        console.log(`[CRON] Executing setWinner task, bId: ${id}`);
        await battlesModel.setWinnerByBattleId(id)
        .then(() => {
            const idx = currentData.findIndex(item => item.id === id);
            idx !== -1 && currentData.splice(idx, 1);
        })
        .catch(console.error);
    }
    saveFile();
}


// WRITE FILE
const saveFile = (): void => {
    console.log('[CRON] Saving tasks...')
    try {
        fs.writeFileSync(plannedTasksFilePath, JSON.stringify(currentData));
    } catch (err) {
        console.log('Error writing plannedTasks.json :' + err.message)
    }
}


// export all
export {
    initDefaultCronTasks,
    createTask,
    cancelTask,
}
