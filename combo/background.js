/**
 * @desc ECD COMBO TOOL BACKGROUND PAGE
 * @author jiguang
 * @mail jiguang1984#gmail.com
 * @date 2013-05-24
 */

var api = 'http://ppms.paipaioa.com/php/combo_ssi.php';
var storage = chrome.storage.local;

// 通过与当前tab通讯，获取当前页的 combo 文件信息
function getCurrentComboFile(callback){
    chrome.tabs.query({active:true,windowId: chrome.windows.WINDOW_ID_CURRENT}, function(tab) {

        var port = chrome.tabs.connect(tab[0].id, {name: "combo_ext_cnt"});

        port.onMessage.addListener(function(msg) {
            if (msg.status == "ok" && typeof callback == 'function'){
                callback(msg);
            }
        });
        port.postMessage({action: "get"});
    });
}

// 更新文件
function update(combofile, callback){

    // 存储操作记录，只保留最后一次记录
    storage.set(combofile, function(){
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

    // 读取最后操作信息
    storage.get({
        fileName: '',
        updateList: ''
    }, function(combofile){
        update(combofile, callback);
    });
}

// 接收页面操作指令，快速更新上次操作的文件
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






