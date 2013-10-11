/**
 * @desc ECD COMBO TOOL BACKGROUND PAGE
 * @author jiguang
 * @mail jiguang1984#gmail.com
 * @date 2013-05-24
 */

var api = 'http://ppms.paipaioa.com/php/combo_ssi.php';
var storage = chrome.storage.local;

// 通过与当前 tab 通讯，获取当前页的 combo 文件信息
// popup.js 调用此方法获取 combo 文件列表，供用户选择
function getCurrentComboFile(callback){

    chrome.tabs.query({active:true,windowId: chrome.windows.WINDOW_ID_CURRENT}, function(tab) {

        var port = chrome.tabs.connect(tab[0].id, {name: "combo_ext_cnt"});
        port.onMessage.addListener(function(data) {

            /**
             * 从 content_script.js 传过来的数据
             * 格式: {
             *    status: "ok",
             *    combofile: json
             * }
             */

            // 从 content_script.js 取到数据后，执行回调
            if (data.status == "ok" && typeof callback == 'function'){
                callback(data);
            }
        });
        port.postMessage({action: "get"});
    });
}

// 更新文件
function update(combofile, callback){

    // 存储操作记录，只保留最后一次记录
    storage.set(combofile, function(){

        // 请求接口，更新文件
        $.post(api, combofile, function(data){

            if(typeof callback == 'function'){
                callback(data);
            }

            // 完成后刷新
            chrome.tabs.query({active:true,windowId: chrome.windows.WINDOW_ID_CURRENT}, function(tab) {
                chrome.tabs.reload(tab[0].id);
            });

        });
    });

}

// 更新最后一次保存的文件
function updateLast(callback){

    // 读取最后操作配置
    storage.get({
        fileName: '',
        devPath: '',
        updateList: ''
    }, function(combofile){
        // 使用最后保存的配置更新文件
        update(combofile, callback);
    });
}

// 接收来自 content_script.js 的操作指令，快速更新上次操作的文件
chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
        if (msg.action == "updateLast"){
            updateLast(function(){
                port.postMessage({
                    status: "ok"
                });
            });
        }
    });
});






