const glob=require("glob");
const fse=require("fs-extra");

async function removeFile(file)
{
    try {
        await fse.removeSync(file)
        console.log(`success remove ${file}`)
    } catch (err) {
        console.error(err)
    }
}

async function doRemoveFolder(fd)
{
    try {
        await fse.removeSync(fd)
        //console.log(`success remove ${file}`)
    } catch (err) {
        console.error(err)
    }
}

const doRemoveFile=(pattern)=>{
    const files=glob.sync(`${pattern}`);
    files.forEach((file) => {
        removeFile(file);
    });
};

module.exports={
    doRemoveFile,
    doRemoveFolder
}