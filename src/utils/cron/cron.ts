import { TTask } from "./types";
import cron from "node-schedule";
import battlesModel from '../../models/battles/battles.model';
import removeJunkFiles from '../cleaner/cleaner';
import PlannedTask from "../../models/planned-tasks/planned-tasks.mongo";
require('dotenv').config();



let currentData;


// init
const initDefaultCronTasks = async(): Promise<void> => {
    if (process.env.ENV_TYPE === "test") {
        console.log('[CRON] Skipping because of TEST env.')
    } else {
        // program will not close instantly
        //process.stdin.resume();
        currentData = await PlannedTask.find().lean().exec();
        
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
const createTask = (id: string, date: Date, cb: () => void, taskType: TTask["taskType"]): void => {
    cron.scheduleJob(date, cb)
    PlannedTask.insertMany([{id, date, taskType}]);
}


// cancel task
const cancelTask = (id: string): void => {
    cron.cancelJob(id);
    PlannedTask.deleteOne({ id });
}

// read planned tasks after restart
const applySavedTasks = (): void => {
    // battle ids array
    let battleIdsToRemove = [];
    // do important stuff
    
    currentData.forEach((task: TTask) => {
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
        .then(async() => {
            await PlannedTask.deleteOne({ id });
        })
        .catch(console.error);
    }
}


// export all
export {
    initDefaultCronTasks,
    createTask,
    cancelTask,
}
