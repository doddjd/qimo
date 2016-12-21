var host = 'http://' + document.location.host
    // var host='http://192.168.1.103:8080'
$(function($) {

    // alert(11)

    var data = {
        loginFlag: getCookie('loginUserId') ? 0 : 1,
        list: ['文艺', '博客', '摄影', '电影', '民谣', '旅行', '吉他']
    };
    var html = template('loginBtnTpl', data);
    document.getElementById('loginBtnShell').innerHTML = html;


    $('#newer').click(function() {
        html = template('signInTpl', data);
        layer.open({
            type: 1,
            skin: 'layui-layer-rim', //加上边框
            area: ['50%', 'auto'], //宽高
            content: html,
            btn: ['保存', '取消'],
            yes: function(index, layero) {
                //do something
                var _data = {
                    account: $('#newPlayer').find("[name='account']").val(),
                    username: $('#newPlayer').find("[name='username']").val(),
                    password: md5($('#newPlayer').find("[name='password']").val()),
                    type: 1,
                    status: 1
                }

                userAdd(0, _data)
                    // location.reload()
                layer.alert('成功', {
                        icon: 1,
                        skin: 'layer-ext-moon' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
                    }, function() {
                        // location.reload()
                    })
                    // layer.close(index); //如果设定了yes回调，需进行手工关闭
            },
            no: function(index, layero) {
                //do something
                layer.close(index); //如果设定了yes回调，需进行手工关闭
            }
        });
    })


    $('#loginBtn').click(function() {
        var data = {
            account: $('#myModal').find("[name='account']").val(),
            password: md5($('#myModal').find("[name='password']").val())
        }

        $.ajax({
            type: "POST",
            url: host + "/tropical-disease-research/user/login",
            data: data,
            success: function(msg) {
                if (msg.status == 1) {
                    var tmp = JSON.parse(msg.data)
                    setCookie('loginUserId', tmp.loginUserId)
                    location.reload()
                }

            }
        });
    })

});

$('.login-btn').click(function() {
    var _data = ''
    var html = template('loginTpl', _data);

    layer.open({
        type: 1,
        skin: 'layui-layer-rim', //加上边框
        area: ['50%', 'auto'], //宽高
        content: html,
        btn: ['保存', '取消'],
        yes: function(index, layero) {
            //do something
            var data = {
                account: $('#myModal').find("[name='account']").val(),
                password: md5($('#myModal').find("[name='password']").val())
            }

            $.ajax({
                type: "POST",
                url: host + "/tropical-disease-research/user/login",
                data: data,
                success: function(msg) {
                    if (msg.status == 1) {
                        var tmp = JSON.parse(msg.data)
                        setCookie('loginUserId', tmp.loginUserId)
                        location.reload()
                    }

                }
            });


        },
        no: function(index, layero) {
            //do something
            layer.close(index); //如果设定了yes回调，需进行手工关闭
        }
    });
})

function userAdd(fnType, data) {
    if (fnType == 0) {
        return $.ajax({
            type: "POST",
            url: host + "/tropical-disease-research/user/add_user",
            data: data,
            success: function(msg) {

            }
        });
    } else {
        return $.ajax({
            type: "POST",
            url: host + "/tropical-disease-research/user/modify_user",
            data: data,
            success: function(msg) {

            }
        });
    }
}


var pages = {
    'back': function() {
        // projectListTpl
        $.ajax({
            data: { "loginUserId": getCookie('loginUserId') },
            type: "GET",
            url: host + '/tropical-disease-research/project/get_project_list',
            success: function(msg) {
                var tmp = { list: JSON.parse(msg.data) }

                var html = template('projectListTpl', tmp)
                document.getElementById('projectListTplShell').innerHTML = html;
            }
        });


    },
    'aboutProject': function() {
        var params = parseURL(location.href)
        var id=206
        console.log(params)
        if(params.params.id){
            // alert(1)
            id=params.params.id
        }
        var _data = {
            projectId: id,
            loginUserId: getCookie('loginUserId')
        }

        $.ajax({
            type: "get",
            url: host + "/tropical-disease-research/project/get_project_info",
            data: _data,
            success: function(msg) {
                // console.log(msg.data)

                var tmp = { list: JSON.parse(msg.data) }
                console.log(tmp)
                tmp.list.publishArticleLinks = tmp.list.publishArticleLinks.split(',');
                tmp.list.publishArticleTitles = tmp.list.publishArticleTitles.split(',');

                tmp.list.relatedArticleLinks = tmp.list.relatedArticleLinks.split(',');
                tmp.list.relatedArticleTitles = tmp.list.relatedArticleTitles.split(',')


                var html = template('projectMainTpl', tmp);

                document.getElementById('projectMainTplShell').innerHTML = html;
            }
        });


    },
    'user': function() {
        var _data = {
            projectId: 206,
            loginUserId: getCookie('loginUserId')
        }

        $.ajax({
            type: "get",
            url: host + "/tropical-disease-research/user/get_user_list",
            data: _data,
            success: function(msg) {
                console.log(msg.data)
                if (msg.status == 0) {
                    $.ajax({
                        type: "get",
                        url: host + "/tropical-disease-research/user/get_user_info",
                        data: { userId: getCookie('loginUserId'), loginUserId: getCookie('loginUserId') },
                        success: function(msg) {
                            console.log(msg.data)

                            var tmp = { list: JSON.parse(msg.data) }

                            console.log(tmp)
                            var html = template('signInTpl', tmp);


                            layer.open({
                                type: 1,
                                skin: 'layui-layer-rim', //加上边框
                                area: ['50%', 'auto'], //宽高
                                content: html,
                                btn: ['保存', '取消'],
                                yes: function(index, layero) {
                                    //do something
                                    var _data = {
                                        loginUserId: getCookie('loginUserId'),
                                        userId: getCookie('loginUserId'),
                                        account: $('#newPlayer').find("[name='account']").val(),
                                        username: $('#newPlayer').find("[name='username']").val(),
                                        password: md5($('#newPlayer').find("[name='password']").val()),
                                        type: 1,
                                        status: 1
                                    }

                                    userAdd(1, _data)
                                        // location.reload()
                                    layer.alert('成功', {
                                            icon: 1,
                                            skin: 'layer-ext-moon' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
                                        }, function() {
                                            // location.reload()
                                        })
                                        // layer.close(index); //如果设定了yes回调，需进行手工关闭
                                },
                                no: function(index, layero) {
                                    //do something
                                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                                }
                            });


                        }
                    });

                } else {

                    var tmp = { list: JSON.parse(msg.data) }

                    var html = template('userMainTpl', tmp);

                    document.getElementById('userMainTplShell').innerHTML = html;

                }


            }
        });


    }

}

function deleteInfo(id) {
    $.ajax({
        data: {
            "loginUserId": getCookie('loginUserId'),
            'projectId': id
        },
        type: "POST",
        url: host + '/tropical-disease-research/project/remove_project/',
        success: function(msg) {

            layer.alert('删除成功', {
                icon: 1,
                skin: 'layer-ext-moon' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
            }, function() {
                location.reload()
            })
        }
    });

}

function deleteUser(id) {
    $.ajax({
        data: {
            "loginUserId": getCookie('loginUserId'),
            'userId': id
        },
        type: "POST",
        url: host + 'tropical-disease-research/user/remove_user',
        success: function(msg) {
            layer.alert('删除成功', {
                icon: 1,
                skin: 'layer-ext-moon' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
            }, function() {
                location.reload()
            })
        }
    });
}

function editInfo(id) {
    $.ajax({
        data: {
            "loginUserId": getCookie('loginUserId'),
            'projectId': id
        },
        type: "POST",
        url: host + '/tropical-disease-research/project/remove_project/',
        success: function(msg) {

            layer.alert('删除成功', {
                icon: 1,
                skin: 'layer-ext-moon' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
            }, function() {
                location.reload()
            })
        }
    });

}

function addNewInfo(fnType, id) {


    var fangshi = function(_data) {
        if (fnType == 0) {
            return $.ajax({
                type: "POST",
                url: host + "/tropical-disease-research/project/add_project",
                data: _data,
                success: function(msg) {
                    console.log(_data)
                    console.log(JSON.parse(msg.data))
                }
            });
        } else {
            return $.ajax({
                type: "POST",
                url: host + "/tropical-disease-research/project/modify_project",
                data: _data,
                success: function(msg) {
                    console.log(_data)
                    console.log(JSON.parse(msg.data))
                }
            });
        }
    }
    var tmp = {},
        html = '';

    if (fnType == 1) {
        var _data = {
            projectId: id,
            loginUserId: getCookie('loginUserId')
        }

        $.ajax({
            type: "get",
            url: host + "/tropical-disease-research/project/get_project_info",
            data: _data,
            success: function(msg) {

                tmp = JSON.parse(msg.data)

                html = template('projectEditTpl', tmp)
                layer.open({
                    type: 1,
                    skin: 'layui-layer-rim', //加上边框
                    area: ['50%', 'auto'], //宽高
                    content: html,
                    btn: ['保存', '取消'],
                    yes: function(index, layero) {
                        //do something
                        $('#editTpl').find("[name='projectName']").val
                        var _data = {
                            loginUserId: getCookie('loginUserId'),
                            projectId: id,
                            projectName: $('#editTpl').find("[name='projectName']").val(),
                            leader: $('#editTpl').find("[name='leader']").val(),
                            photos: $('#editTpl').find("[name='photos']").val(),
                            bioClass: $('#editTpl').find("[name='bioClass']").val(),
                            progress: $('#editTpl').find("[name='progress']").val(),
                            publishArticleTitles: $('#editTpl').find("[name='publishArticleTitles']").val(),
                            publishArticleLinks: $('#editTpl').find("[name='publishArticleLinks']").val(),
                            relatedArticleTitles: $('#editTpl').find("[name='relatedArticleTitles']").val(),
                            relatedArticleLinks: $('#editTpl').find("[name='relatedArticleLinks']").val(),
                            content: $('#editTpl').find("[name='content']").val(),
                        }

                        fangshi(_data)
                            // location.reload()
                        layer.alert('成功', {
                                icon: 1,
                                skin: 'layer-ext-moon' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
                            }, function() {
                                location.reload()
                            })
                            // layer.close(index); //如果设定了yes回调，需进行手工关闭
                    },
                    no: function(index, layero) {
                        //do something
                        layer.close(index); //如果设定了yes回调，需进行手工关闭
                    }
                });
            }
        });
    } else {
        html = template('projectEditTpl', tmp)
        layer.open({
            type: 1,
            skin: 'layui-layer-rim', //加上边框
            area: ['50%', 'auto'], //宽高
            content: html,
            btn: ['保存', '取消'],
            yes: function(index, layero) {
                //do something
                $('#editTpl').find("[name='projectName']").val
                var _data = {
                        loginUserId: getCookie('loginUserId'),
                        projectName: $('#editTpl').find("[name='projectName']").val(),
                        leader: $('#editTpl').find("[name='leader']").val(),
                        photos: $('#editTpl').find("[name='photos']").val(),
                        bioClass: $('#editTpl').find("[name='bioClass']").val(),
                        progress: $('#editTpl').find("[name='progress']").val(),
                        publishArticleTitles: $('#editTpl').find("[name='publishArticleTitles']").val(),
                        publishArticleLinks: $('#editTpl').find("[name='publishArticleLinks']").val(),
                        relatedArticleTitles: $('#editTpl').find("[name='relatedArticleTitles']").val(),
                        relatedArticleLinks: $('#editTpl').find("[name='relatedArticleLinks']").val(),
                        content: $('#editTpl').find("[name='content']").val(),
                    }
                    // _data=  { "loginUserId": 1, "projectName": "aaa", "leader": "aaa", "content": "111111111111111", "tempo": 30, "photos": 111, "publishArticleTitles": "xxxxxx", "publishArticleLinks": "xzzzzzzz", "relatedArticleTitles": "1111", "relatedArticleLinks": "aaaaxx" }

                fangshi(_data)

                // layer.close(index); //如果设定了yes回调，需进行手工关闭
            },
            no: function(index, layero) {
                //do something
                layer.close(index); //如果设定了yes回调，需进行手工关闭
            }
        });
    }

}



function getParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    } else {
        return null;
    }
}

function setCookie(name, value, expires, path) {
    var Days = 30;
    var exp = new Date();
    var pa = path ? path : '/'
    if (expires) {
        exp.setTime(exp.getTime() + parseInt(expires));
    } else {
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    }
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=" + pa;
}

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

function clearCookie() {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (var i = keys.length; i--;) {
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
        }
    }
}

function deleteCookie(name) {
    setCookie(name, "", -1);
}


function removeCookie(sKey, sPath, sDomain) {

    if (typeof(sKey) === "string") {
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
    } else if (typeof(sKey) === "object") {
        for (let i in sKey) {
            document.cookie = encodeURIComponent(sKey[i]) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        }
    }

}

function parseURL(url) {
    var a = document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':', ''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function() {
            var ret = {},
                seg = a.search.replace(/^\?/, '').split('&'),
                len = seg.length,
                i = 0,
                s;

            for (; i < len; i++) {
                if (!seg[i]) {
                    continue;
                }
                var index = seg[i].indexOf('=')
                var key = seg[i].substring(0, index)
                var val = seg[i].substring(index + 1)
                s = seg[i].split('=');
                ret[key] = val;
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
        hash: a.hash.replace('#', ''),
        path: a.pathname.replace(/^([^\/])/, '/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
        segments: a.pathname.replace(/^\//, '').split('/')
    };
}
