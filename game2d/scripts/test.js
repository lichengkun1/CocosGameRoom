
const fs = require('fs');
const path = require('path');


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

// setBuildSettings();

// const sfData = fs.readFileSync('../games-build-templates/icons/sf.png',{encoding: 'binary'});
// fs.writeFileSync('../build-templates/web-mobile/icon.png',sfData,{encoding: 'binary'});

