; (function () {
    var pageLogic = window.pageLogic = {
        init: {
            before: function() {},
            layout: function() {
                var fn = function() {
                    var width = document.documentElement.clientWidth,
                        height = document.documentElement.clientHeight;
                };
                ui.resize(fn, ui.eventPriority.elementResize);
                fn.call(ui);
            },
            after: function() {
                $(".fold-panel").foldPanel();
                this.userFormValidate = $("#phoneForm").setValidate({
                    errorPlacement: function (error, element) {
                        element.after(error);
                    },
                    rules: {
                        phone: { required: true, cellPhone: true, SqlKeyWord: true, spechars: true }
                    }
                });
                $("#userInfo").hide();
                $("#qy").hide();
                $("#xfg").hide();
                $("#sfg").hide();
                $("#shfg").hide();
                $("#bm").hide();
                $("#yq").hide();
                $("#qy1").hide();
                $("#xfg1").hide();
                $("#sfg1").hide();
                $("#shfg1").hide();
                $("#bm1").hide();
                $("#yq1").hide();
            },
            events: function() {

                $("#seaButton").click(function(e) {
                    pageLogic.doSearch();
                });
            },
            load: function() {

            }
        },

        doSearch: function() {
            if(!pageLogic.userFormValidate.form()) {
                //$("#subButton").attr("disabled",false);
                alert("请您输入申请账号时填写的手机号码");
                return;
            }
            var phone = $("#phone").val();
            if ( phone==null || phone == '') {
                alert("请您输入申请账号时填写的手机号码");
                return;
            }
            var data = {
                mobilePhone :phone
            }
            ui.ajax.ajaxPost(
                "../register/searchUser",
                data,
                function(jsonResult) {
                    if(jsonResult.result) {
                        pageLogic.setUserInfo(jsonResult.data);
                        $("#userInfo").show();
                    } else {
                        ui.messageShow("很抱歉，未查询到您当日申请的模拟账号信息，请注意您的手机号码是否填写正确或者申请后再查询。");
                        $("#userInfo").hide();
                    }
                },
                function(e) {
                   // ui.messageShow("查询失败，请联系客服人员！")
                    ui.messageShow(e.message, true)
                    $("userInfo").hide();
                }
            );
        },
        setUserInfo: function(data){
            $("#qy").hide();
            $("#xfg").hide();
            $("#sfg").hide();
            $("#shfg").hide();
            $("#bm").hide();
            $("#yq").hide();
            $("#qy1").hide();
            $("#xfg1").hide();
            $("#sfg1").hide();
            $("#shfg1").hide();
            $("#bm1").hide();
            $("#yq1").hide();
            $("#userForm")[0].reset();
            for (var i = 0; i< data.length; i++) {
                if (data[i].STORE_LEVEL == 0) {
                    $("#qyZh").text(data[i].EMPLOYEE_LOGINNAME);
                    $("#qyMm").text(data[i].PASSWORD_TEXT);
                } else if (data[i].STORE_LEVEL == 1) {
                    $("#xfgZh").text(data[i].EMPLOYEE_LOGINNAME);
                    $("#xfgMm").text(data[i].PASSWORD_TEXT);
                } else if (data[i].STORE_LEVEL == 2) {
                    $("#sfgZh").text(data[i].EMPLOYEE_LOGINNAME);
                    $("#sfgMm").text(data[i].PASSWORD_TEXT);

                } else if (data[i].STORE_LEVEL == 3) {
                    if (data[i].TYPE == 'CENTRE-COM') {
                        $("#yqZh").text(data[i].EMPLOYEE_LOGINNAME);
                        $("#yqMm").text(data[i].PASSWORD_TEXT);
                    } else if (data[i].TYPE == 'DEPT') {
                        $("#bmZh").text(data[i].EMPLOYEE_LOGINNAME);
                        $("#bmMm").text(data[i].PASSWORD_TEXT);
                    } else if (data[i].TYPE == 'FGW') {
                        $("#shfgZh").text(data[i].EMPLOYEE_LOGINNAME);
                        $("#shfgMm").text(data[i].PASSWORD_TEXT);
                    }
                }
            }
            if (data[0].EMP_TYPE == 0) {
                $("#qy").show();
                $("#qy1").show();
            } else if (data[0].EMP_TYPE == 1) {
                $("#qy").show();
                $("#xfg").show();
                $("#sfg").show();
                $("#shfg").show();
                $("#qy1").show();
                $("#xfg1").show();
                $("#sfg1").show();
                $("#shfg1").show();
            } else if (data[0].EMP_TYPE == 2) {
                $("#qy").show();
                $("#qy1").show();
                $("#bm").show();
                $("#bm1").show();
            } else if (data[0].EMP_TYPE == 3) {
                $("#qy").show();
                $("#qy1").show();
                $("#yq").show();
                $("#yq1").show();
            }

        }
    };
})();