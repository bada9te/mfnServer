const fs = require('fs');
const path = require('path');
const postsModel = require('../../models/posts/posts.model');
const usersModel = require('../../models/users/users.model');


const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.jjpeg', '.bmp', '.tiff', '.svg'];
const audioExtensions = ['.mp3', '.wav', '.m4a', '.flac', '.pcm', '.ogg', '.oga', '.aiff'];


// main 
const removeJunkFiles = async() => {
    console.log("[CLEANER] Cleaning junk files...")
    await cleanJunk();
    console.log("[CLEANER] Junk files successfully removed.")
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
            if (!mustInclude.includes(file)) {
                fs.unlink(path.join(directoryPath, file), (err) => {
                    if (err) throw err;
                });
            }
        });
    });
}



module.exports = removeJunkFiles;
