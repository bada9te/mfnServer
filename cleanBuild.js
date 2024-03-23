const path = require("path")
const fs = require("fs");

const targetDirs = [
    path.join(__dirname, "src", "models"),
]

try {
    fs.unlinkSync(path.join(targetDirs[0], "types.js"));
} catch (error) {
    console.error(error);
}

targetDirs.forEach(targetDir => {
    const folders = fs.readdirSync(targetDir);
    folders.forEach(folder => {
        const folderPath = path.join(targetDir, folder);
        if (fs.statSync(folderPath).isDirectory()) {
            const files = fs.readdirSync(folderPath);

            const filesToDelete = files.filter(file => file.includes(".model.js") || file === "types.js");

            filesToDelete.forEach(fileToRemove => {
                fs.unlinkSync(path.join(folderPath, fileToRemove));
            })
        }
    });
});