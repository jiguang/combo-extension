/**
 * @desc ECD COMBO TOOL BACKGROUND PAGE
 * @author jiguang
 * @mail jiguang1984#gmail.com
 * @date 2013-05-24
 */

var api = 'http://44ux.com/wp-content/api.php';
var storage = chrome.storage.local;

// 通过与当前tab通讯，获取当前页的 combo 文件信息
// 页面刷新后只能获取一次，没有保存长连接
function getCurrentComboFile(callback){
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tab.id, {action: "get"}, callback );
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
            chrome.tabs.getSelected(null, function(tab) {
                chrome.tabs.reload();
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
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action == "updateLast"){

            updateLast(function(){
                sendResponse({
                    status: "update completed"
                });
            });
        }
    });






