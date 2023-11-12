module.exports = (envVars) => {
    const undefinedVars = [];
    envVars.forEach(element => {
        if (!process.env[element]) {
            undefinedVars.push(element);
        }
    });

    if (undefinedVars.length) {
        undefinedVars.forEach(item => {
            console.log(`[ENV_ERROR] Var "${item}" is not defined.`)
        });
        process.abort();
    } else {
        console.log(`[ENV] Ok.`);
    }
}