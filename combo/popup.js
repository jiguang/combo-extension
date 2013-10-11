/**
 * @desc ECD COMBO TOOL POPUP
 * @author jiguang
 * @mail jiguang1984#gmail.com
 * @date 2013-05-24
 */

$(function(){

    var background = chrome.extension.getBackgroundPage();
    var combo_file;
    var url = "http://ppms.paipaioa.com/combo/index.html";

    // 打开 combo 工具
    $('#combo_tool').click(function(){
        try{
            chrome.tabs.create({
                active: true,
                url: url
            });
        }catch(e){}
    });

    // 更新操作
    background.getCurrentComboFile(function(data){

        try{
            // 获取页面中的 combo 文件
            combo_file = JSON.parse(data.combo_file);
        }catch(e){}

        // 生成待更新文件列表
        function generateUpdateList(){
            var template = '<li>{{path}}</li>';
            var tempNode;
            var $updateList = $('#updateList');

            if(combo_file && combo_file.fileName && combo_file.comboLinks.length > 0){
                $updateList.empty();

                for(var i = 0, j = combo_file.comboLinks.length; i<j; i++){
                    tempNode = template.replace('{{path}}', combo_file.comboLinks[i]);
                    $updateList.append($(tempNode));
                }
            }

            $('#cur_env').html(combo_file.devPath.toUpperCase());
        }

        // 获取待更新文件列表
        function getUpdateList(){
            var $updateList = $('#updateList');
            var updateList = [];

            $updateList.find('li').each(function(){
                if($(this).hasClass('checked')){
                    updateList.push($(this).text());
                }
            });

            return updateList.join(',');
        }

        generateUpdateList();
        $('#update').show();

        $('#updateList').find('li').click(function(){
            $(this).toggleClass('checked');
        });

        $('#update').click(function(){
            background.update({
                fileName: combo_file.fileName,
                devPath: combo_file.devPath,
                updateList: getUpdateList()
            });
        }) ;


        // 绑定带参数的 combo 工具地址
        $('#combo_tool').off('click').click(function(){
                var combo_string = '<link combofile="'+combo_file.fileName
                    +'" href="http://static.paipaiimg.com/c/='
                    + combo_file.comboLinks.join(',')
                    +'?t=' +(+new Date)
                    +'" />';

                try{
                    chrome.tabs.create({
                        active: true,
                        url: url +'?str='+ encodeURIComponent(combo_string)
                    });
                }catch(e){}
        });
    });


});



