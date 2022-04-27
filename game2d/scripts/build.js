const fs = require('fs');
const path = require('path');
const process = require('process');
const childProcess = require('child_process');
const spawn = childProcess.spawn;
const os = require('os');

const plateform = os.platform();
console.log('plateform is ',plateform);

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
// 改变构建build-templates文件
const targetGameTemplates = `../games-build-templates/${gameName}/web-mobile/`;
// 删除原来的web-mobile
const templateUrl = '../build-templates/web-mobile/';
unlinkDir(templateUrl);
moveFileToTargetDir(targetGameTemplates,templateUrl);
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
});










