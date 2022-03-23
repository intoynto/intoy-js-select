const fse=require("fs-extra");

function toCopyDir(srcDir,destDir)
{
    fse.copySync(srcDir,destDir,{overwrite:true},function(err){
        if(err)
        {
            console.error(err);
        }
        else {
            console.log(`Success copy dir from ${srcDir} to ${destDir}`);
        }
    });
}

async function toCopyFile(srcFile,destFile)
{
    try {
        await fse.copy(srcFile, destFile)
        console.log('success!')
    } catch (err) {
        console.error(err)
    }
}

async function toDelDir(src)
{
    try {
        await fse.removeSync(src)
        console.log(`success remove ${src}`)
    } catch (err) {
        console.error(err)
    }
}

//toCopyDir('dist/src/','dist/');
//toCopyFile('src/_select.scss','dist/_select.scss');
//toDelDir('dist/src');
//toDelDir('dist/_test');