const fs = require('fs');
const path = require('path');
const process = require('process');
const childProcess = require('child_process');
const spawn = childProcess.spawn;
const os = require('os');

const plateform = os.platform();
console.log('plateform is ',plateform);

let targetDir = null;



/** 根据参数决定构建哪个游戏 */

console.log(process.argv);
const args = process.argv;

const gameName = args[2];
const env = args[3];

const assetsPath = '../assets/';
console.log(process.cwd())


if(plateform.indexOf('win32') >= 0) {
    targetDir = `C:\\nginx-1.20.2\\html\\games\\${gameName}\\${env}\\web-mobile`;
}

// 房间游戏列表
const roomGames = ['ludo','dominoe','uno'];
const bundlesPath = assetsPath;
// path

const projectPath = path.join(__dirname,"../");
let cocosExePath = '/Applications/CocosCreator/Creator/2.4.8/CocosCreator.app/Contents/MacOS/CocosCreator';
// '/Applications/CocosCreator/Creator/2.4.8/CocosCreator.app/Contents/MacOS/CocosCreator'
// C:\\CocosDashboard_1.1.1\\resources\\.editors\\Creator\\2.4.8\\CocosCreator
if(plateform.indexOf('win32') >= 0) {
    // 远程windows 服务器cocos的安装路径
    cocosExePath = 'C:\\CocosDashboard_1.1.1\\resources\\.editors\\Creator\\2.4.8\\CocosCreator'
}
const cocosExeArgs = ['--path',`${projectPath}`,'--build',"platform=web-mobile;debug=false"];

const unlinkDir = (dirUrl) => {
    const filesArr = fs.readdirSync(dirUrl);
    filesArr.forEach(item => {
        fs.unlinkSync(dirUrl + '/' + item);
    });
}

/**
 * 删除文件顺带删除文件夹
 * @param  {string} dirPath
 */
const unLinkDirWithDelete = (dirPath) => {
    const filesArr = fs.readdirSync(dirPath);
    filesArr.forEach(item => {
        let itemPath = dirPath + '/' + item;
        if(fs.statSync(itemPath).isDirectory()) {
            unLinkDirWithDelete(itemPath);
        } else {
            fs.unlinkSync(dirPath + '/' + item);
        }
    });

    fs.rmdirSync(dirPath);
}

/**
 * 源文件拷贝到目标文件夹 流的方式实现copy
 * @param  {string} sourceUrl
 * @param  {string} targetUrl
 */
const moveFileToTargetDir = (sourceUrl,targetUrl) => {
    const sourceFiles = fs.readdirSync(sourceUrl);
    sourceFiles.forEach(item => {
        const readData = fs.createReadStream(sourceUrl + '/' + item);
        const writeData = fs.createWriteStream(targetUrl + '/' + item);

        readData.pipe(writeData);
    });
}
/**
 * 改变bundle是否开启的开关
 * @param  {boolean} tag
 * @param  {string} item
 */
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
/**
 * 将源文件夹里面的文件拷贝到目标文件夹内
 * @param  {string} srcDir 源文件夹路径
 * @param  {string} targetDir 目标文件夹路径
 */
const writeFileToDir = (srcDir,targetDir) => {
    const textPrefixs = ['.js','.atlas','.css','.json','.plist'];
    const assetPrefixs = ['.jpg','.jpeg','.ico','.png'];

    const files = fs.readdirSync(srcDir);
    console.log('files is ',files);
    console.log('taregtDir is ',targetDir);

    files.forEach(item => {
        const targetFilePath = srcDir + '/' + item;
        if(assetPrefixs.some(it => item.indexOf(it) >= 0)) {
            console.log('二进制文件',item);
            // 二进制文件
            const readData = fs.readFileSync(targetFilePath,{encoding: 'binary'});
            fs.writeFileSync(targetDir + '/' + item,readData,{encoding: 'binary'});
        }
        if(textPrefixs.some(it => item.indexOf(it) >= 0)) {
            console.log('文本文件：',item);
            const readData = fs.readFileSync(targetFilePath,{encoding: 'utf-8'});
            fs.writeFileSync(targetDir + '/' + item,readData,{encoding: 'utf-8'});
        }
    });
}

/**
 * 将想要的文件复制到web-mobile下面去
 * @param  {string} srcDir 原始文件路径
 * @param  {string} targetName 目标文件的名字
 */
const addPngToWebmobile = (srcDir,targetName) => {
    const icons = fs.readdirSync(srcDir);

    icons.forEach(item => {
        const iconPath = srcDir + '/' + item;
        if(item.indexOf(gameName) >= 0) {
            const extStr = path.extname(item);
            const pictureData = fs.readFileSync(iconPath,{encoding: 'binary'});

            const targetFilePath = `../build-templates/web-mobile/${targetName}.png`;
            fs.writeFileSync(targetFilePath,pictureData,{encoding: 'binary'});
        }
    });
}

/**
 * web-mobile文件夹存在 将common文件夹（打包需要的公共资源文件）的所有文件复制到目标web-mobile文件夹
 * 
 */
const moveCommonAndIconToGame = () => {
    // common文件夹路径
    const rootDirPath = '../games-build-templates/common';
    // 公共资源移动到哪个文件夹下
    const targetDirPath = '../build-templates/web-mobile';

    // 移动源文件到目标文件夹内
    moveFileToTargetDir(rootDirPath,targetDirPath);

    
}

/**
 * 设置settings/builder.json 里面的内容 里面设置了启动场景参与打包的场景，剔除没有参与打包的游戏场景
 * @param  {string} targetBundleName 目标bundle
 */
 function setBuildSettings() {
    /**
     * 遍历文件夹
     * @param  {string} path 文件夹路径
     * @param  {string[]} uuids 待填充的场景uuid
     * @returns {string[]} 
     */
    const walkDir = (path,uuids) => {
        const files = fs.readdirSync(path);
        files.forEach(item => {
            const url = path + '/' + item;
            const fileItemStat = fs.statSync(path + '/' + item);
            if(fileItemStat.isDirectory()) {
                if(url == '../assets/Scene') {
                    // 剔除公共场景资源，公共场景必须打进主包 main中
                    console.log('文件夹 url is ',url);
                    return;
                }
                walkDir(url,uuids);
            } else {
                if(url.indexOf(".fire.meta") >= 0) {
                    console.log('找到场景文件',url);
                    const sceneMetaFileString = fs.readFileSync(url,{encoding: 'utf-8'});
                    const sceneMetaJson = JSON.parse(sceneMetaFileString);
                    const sceneUuid = sceneMetaJson.uuid;
                    uuids.push(sceneUuid);
                }
            }
        })
    }
    
    const findUnBundleSceneUuids = () => {
        const uuids = [];
        walkDir('../assets',uuids);
        console.log('uuids is ',uuids);
        return uuids;
    }
    
    const uuidsToBuilderJson = (uuids) => {
        const builderJsonStr = fs.readFileSync('../settings/builder.json',{encoding: 'utf-8'});
        const builderJson = JSON.parse(builderJsonStr);
        builderJson['excludeScenes'] && (builderJson['excludeScenes'].length = 0);

        builderJson['excludeScenes'] = uuids;
        
        const newBuilderJsonString = JSON.stringify(builderJson,null,2);
        fs.writeFileSync('../settings/builder.json',newBuilderJsonString,{encoding: 'utf-8'});

    }
    // 找出不参与打包的场景uuid
    const uuids = findUnBundleSceneUuids();
    // 将找出的不参与打包的场景uuid 依次放入到 builder.json 的 excludeScenes字段里面
    // 重新写入builder.json
    uuidsToBuilderJson(uuids);
}

console.log('============================ 一：修改全局变量游戏的名称: GameConfig.gameName ==========================');
// 改变 GameConfig.ts里面的gameName
fs.writeFileSync(assetsPath + 'gameConfig.ts',`export class GameConfig { public static readonly gameName = "${gameName}";}`,{encoding: 'utf-8'});
console.log('==========✅ 修改全局变量游戏的名称: GameConfig.gameName success ✅==========\n\n');
// 一开始默认各个游戏都会打包进游戏内，取消不是该游戏的bundle 设置为非bundle 防止游戏bundle过多


console.log('========== 二: 删除没有用的bundle==========');
// 修改非打包的bundle的meta文件
if(roomGames.indexOf(gameName) >= 0) {
    walkBundles(gameName,true);
} else {
    walkBundles(gameName,false);
}
console.log('==========✅ 删除没有用的bundle success ✅==========\n\n');

console.log('========== 三：各个游戏构建模板略有不同：更新游戏构建模板==========');
// const targetDir = `../games-build-templates/${gameName}`;
// let targetDirIsExist = fs.existsSync(targetDir);

// const checkWebmobile = () => {
//     console.log('web-mobile 文件夹不存在创建');
//     let readTargetDir = `../games-build-templates/${gameName}/web-mobile/`;
//     if(!fs.existsSync(readTargetDir)) {
//         fs.mkdirSync(readTargetDir);
//     }
// }
// if(!targetDirIsExist) {
//     console.log(`${gameName} 文件夹不存在创建`);
//     fs.mkdirSync(targetDir);
//     checkWebmobile();
// } else {
//     checkWebmobile();
// }
unlinkDir('../build-templates/web-mobile/');

moveCommonAndIconToGame();

// 读取游戏的icon加入到targetDirPath下
const iconRoot = '../games-build-templates/icons'
addPngToWebmobile(iconRoot,'icon');
addPngToWebmobile('../games-build-templates/bgs','bg');
console.log('==========✅ 各个游戏构建模板略有不同：更新游戏构建模板 success✅==========\n\n');

console.log('========== 四：构建设置: 没有用的场景需要从构建列表里面移除==========');
setBuildSettings();
console.log('===============✅ 构建设置: 没有用的场景需要从构建列表里面移除 success ✅===================\n\n');

console.log('==================== 五: 开始构建项目 ====================');

const cocosTerminal = spawn(cocosExePath,cocosExeArgs);
cocosTerminal.stdout.on('data',(data) => {
    console.log(data.toString());
});

cocosTerminal.stderr.on('data',(data) => {
    console.log('err data is ',data.toString());
});

cocosTerminal.on('close',(code) => {
    console.log('code is ',code);
    console.log('====================✅ build success 奥利给 ✅====================');

    if(plateform.indexOf('win32') >= 0) {
        const remoteIp = '18.166.154.55';
        // 将build出来的文件存进本地，nginx直接访问
        if(fs.existsSync(targetDir)) {
            unLinkDirWithDelete(targetDir);
        }
        fs.mkdirSync(targetDir,{recursive: true});
        
        let sourceDir = '../build/web-mobile';
        
        fs.cpSync(sourceDir,targetDir,{recursive: true});
        console.log(`打出的包放进远程服务器，请访问： http://${remoteIp}/games/${gameName}/${env}/web-mobile/index.html`);
    } else {

    }
});











