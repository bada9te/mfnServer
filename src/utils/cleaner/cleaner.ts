import fs from 'fs';
import path from 'path';
import * as postsModel from '../../models/posts/posts.model';
import * as usersModel from '../../models/users/users.model';
import config from '../../config';
import { TPostAssets, TUserAssets } from './types';


const MONGO_PREFIX = config.mongo.prefix;

// main 
const removeJunkFiles = async(): Promise<void> => {
    if (process.env.ENV_TYPE === "test") {
        console.log("[CLEANER] Skipping because of TEST env.")
    } else {
        console.log("[CLEANER] Cleaning junk files...")
        await cleanJunk().catch(console.error);
        console.log("[CLEANER] Junk files successfully removed.")
    }
}

// users
const cleanJunk = async() => {
    let imageFiles: string[] = [];
    let audioFiles: string[] = [];
    let otherFiles: string[] = [];
    
    // collecting users
    const users: TUserAssets[] = await usersModel.getOnlyImagesAndAudios() as unknown as TUserAssets[];
    users.forEach((user) => {
        imageFiles.push(user.avatar);
        imageFiles.push(user.background);
    });

    // collecting posts
    const posts: TPostAssets[] = await postsModel.getOnlyImagesAndAudios() as unknown as TPostAssets[];
    posts.forEach((post) => {
        imageFiles.push(post.image);
        audioFiles.push(post.audio);
    });


    // images/audios path
    const imagesPath = path.join(__dirname, '..', '..', '..', 'uploads', 'images');
    const audiosPath = path.join(__dirname, '..', '..', '..', 'uploads', 'audios');
    const othersPath = path.join(__dirname, '..', '..', '..', 'uploads', 'others');

    // reading directories
    readPathAndRemoveUnnecessary(imagesPath, imageFiles);
    readPathAndRemoveUnnecessary(audiosPath, audioFiles);
    readPathAndRemoveUnnecessary(othersPath, otherFiles);
}


// files remover
const readPathAndRemoveUnnecessary = (directoryPath: string, mustInclude: string[]) => {
    fs.readdir(directoryPath, (err, files) => {
        files.forEach(file => {
            // remove if unnecessary
            if (!mustInclude.includes(file) && file.startsWith(MONGO_PREFIX)) {
                fs.unlink(path.join(directoryPath, file), (err) => {
                    if (err) throw err;
                });
            }
        });
    });
}



export default removeJunkFiles;
