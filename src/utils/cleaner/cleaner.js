const fs = require('fs');
const path = require('path');
const postsModel = require('../../models/posts/posts.model');
const usersModel = require('../../models/users/users.model');
const config = require('../../config');


const MONGO_PREFIX = config.mongo.prefix;

// main 
const removeJunkFiles = async() => {
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
    let imageFiles = [];
    let audioFiles = [];
    let otherFiles = [];
    
    // collecting users
    const users = await usersModel.getOnlyImagesAndAudios()
    users.forEach((user) => {
        imageFiles.push(user.avatar);
        imageFiles.push(user.background);
    });

    // collecting posts
    const posts = await postsModel.getOnlyImagesAndAudios();
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
const readPathAndRemoveUnnecessary = (directoryPath, mustInclude) => {
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



module.exports = removeJunkFiles;
