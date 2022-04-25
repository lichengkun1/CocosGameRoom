const fs = require('fs');
const path = require('path');
const process = require('process');
const childProcess = require('child_process');
const spawn = childProcess.spawn;

/** 根据参数决定构建哪个游戏 */

console.log(process.argv);
const args = process.argv;

const gameName = args[2];
const env = args[3];

const assetsPath = '../assets/';
console.log(process.cwd())

// 房间游戏列表
const roomGames = ['ludo','dominoe','uno'];
const bundlesPath = assetsPath;
// path

const projectPath = path.join(__dirname,"../");
// '/Applications/CocosCreator/Creator/2.4.8/CocosCreator.app/Contents/MacOS/CocosCreator'
// C:\\CocosDashboard_1.1.1\\resources\\.editors\\Creator\\2.4.8\\CocosCreator
const cocosExePath = 'C:\\CocosDashboard_1.1.1\\resources\\.editors\\Creator\\2.4.8\\CocosCreator'
const cocosExeArgs = ['--path',`${projectPath}`,'--build',"platform=web-mobile;debug=false"];

const unlinkDir = (dirUrl) => {
    const filesArr = fs.readdirSync(dirUrl);
    filesArr.forEach(item => {
        fs.unlinkSync(dirUrl + '/' + item);
    });
}

const moveFileToTargetDir = (sourceUrl,targetUrl) => {
    const sourceFiles = fs.readdirSync(sourceUrl);
    sourceFiles.forEach(item => {
        const readData = fs.createReadStream(sourceUrl + '/' + item);
        const writeData = fs.createWriteStream(targetUrl + '/' + item);

        readData.pipe(writeData);
    });
}

const setBundleTag = (tag,item) => {
    const metaData = fs.readFileSync(bundlesPath + item,{encoding: 'utf-8'});
    const metaJsonData = JSON.parse(metaData);
    metaJsonData['isBundle'] = tag;

    const newMetaDataStr = JSON.stringify(metaJsonData);
    fs.writeFileSync(bundlesPath + item,newMetaDataStr,{encoding: 'utf-8'});
}

const walkBundles = (targetBundleName,excludeRoomCommon) => {
    
    let files = fs.readdirSync(assetsPath);
    files.forEach(item => {
        if(item == '.DS_Store') return;

        let fileStat = fs.statSync(bundlesPath + item);
        if(fileStat.isDirectory()) return;
        
        let fileName = path.basename(item,'.meta');
        if(item.indexOf('.meta') >= 0) {
            if(fileName === 'roomCommon' && excludeRoomCommon) {
                setBundleTag(true,item);
                return;
            }
            if(fileName === 'roomCommon' && !excludeRoomCommon) {
                setBundleTag(false,item);
            }
            if(targetBundleName != fileName) {
                console.log('111');
                setBundleTag(false,item);
            } else {
                console.log('222');
                setBundleTag(true,item);
            }
        }
    })
}   


console.log('--------------修改GameConfig.gameName-------------');
// 改变 GameConfig.ts里面的gameName
fs.writeFileSync(assetsPath + 'gameConfig.ts',`export class GameConfig { public static readonly gameName = "${gameName}";}`,{encoding: 'utf-8'});
console.log('--------------✅修改GameConfig.gameName ✅-------------\n\n');
// 一开始默认各个游戏都会打包进游戏内，取消不是该游戏的bundle 设置为非bundle 防止游戏bundle过多

console.log('--------------开始删除没有必要的bundle----------');
// 修改非打包的bundle的meta文件
if(roomGames.indexOf(gameName) >= 0) {
    walkBundles(gameName,true);
} else {
    walkBundles(gameName,false);
}

console.log('--------------✅开始删除没有必要的bundle✅----------\n\n');

console.log('-------------移动web-mobile模板到构建模板中-----------');
// 改变构建build-templates文件
const targetGameTemplates = `../games-build-templates/${gameName}/web-mobile/`;
// 删除原来的web-mobile
const templateUrl = '../build-templates/web-mobile/';
unlinkDir(templateUrl);
moveFileToTargetDir(targetGameTemplates,templateUrl);

console.log('-------------✅移动web-mobile模板到构建模板中✅-----------\n\n');

console.log('--------------------开始构建项目------------------------');

const cocosTerminal = spawn(cocosExePath,cocosExeArgs);
cocosTerminal.stdout.on('data',(data) => {
    console.log(data.toString());
});

cocosTerminal.stderr.on('data',(data) => {
    console.log('err data is ',data.toString());
});

cocosTerminal.on('close',(code) => {
    console.log('code is ',code);
    console.log('--------------------✅构建项目成功✅------------------------');

});










