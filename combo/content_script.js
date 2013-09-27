/**
 * @desc ECD COMBO TOOL CONTENT SCRIPT
 * @author jiguang
 * @mail jiguang1984#gmail.com
 * @date 2013-05-23
 */

// 监听来自 background 的指令
chrome.runtime.onConnect.addListener(function(port) {

    port.onMessage.addListener(function(msg) {

        var links = document.querySelectorAll('link');
        var comboLinkReg = /.*?\/c\/=(.*?)\?t=[\s\S]*/ig;
        var combofile = [];
        var fileName = '';
        var json;

        // 获取 combo 地址中的全部文件列表
        for( var i = 0, j = links.length; i < j; i++){

            fileName = links[i].getAttribute('combofile');

            // 忽略 global.shtml，全局样式不应草率操作
            // 需在正式工具中处理，且大多数情况下不需要更新，故不必列出
            if(fileName != null && fileName != 'common/global.shtml'){

                // 此处用数组是为了兼容后续多个文件的情况
                combofile.push({
                    fileName: fileName,
                    comboLinks: links[i].href.replace(comboLinkReg, "$1").split(',')
                });
            }
        }

        // 目前 api 只支持更新单个 combo 文件
        // 原则上也应该只有一个 combo 文件，故只取数组第一项
        json = JSON.stringify(combofile[0]);

        if (msg.action == "get"){
            port.postMessage({
                status: "ok",
                combofile: json
            });
        }

    });
});

// 键盘快捷键，重复上一次操作
document.addEventListener('keydown', function(e){
    // Alt + R
    if(e.altKey && e.keyCode == '82'){
        var port = chrome.runtime.connect({name: "combo_ext_cnt"});
            port.postMessage({action: "updateLast"});
            port.onMessage.addListener(function(msg) {
                if (msg.status == "ok"){
                    console.log('update completed');
                }
            });
    }
});







