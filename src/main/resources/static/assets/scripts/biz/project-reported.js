/**
 * Created by zhaohuan on 2016/6/6.
 */
; (function () {
    var isBangding = null;//是否绑定微信号
    var pppStageData = [
        {text: "PPP基本信息", value: "PPP_BASEINFO"},
        {text: "实施方案编制", value: "IMPL_PLAN_PREPARE"},
        {text: "实施方案审查及确定", value: "IMPL_PLAN_CHECK"},
        {text: "社会资本方遴选", value: "SOCIAL_CAPITAL_CHOOSE"},
        {text: "合同签订", value: "SIGN_CONTRACT"},
        //{text: "具备推介条件", value: "REFERRAL"}
        {text: "项目建设与运行", value: "BUILD_OPERATIONS"},
        {text: "项目移交", value: "PROJECT_TRANSFER"},
        {text: "不再采用PPP模式", value: "CANCEL_IMPL"}
    ];

    var pageLogic = window.pageLogic = {
        //页面初始化
        init: {
            //主题切换
            themes: function() {
            },
            //在布局计算前创建控件
            before: function () {
                masterpage.initToolbar("projectToolbar");

                var gridOption = {
                    columns: [
                        { column: "PROJECT_ID", text: ui.ColumnStyle.cnfn.columnCheckboxAll, len: 40, align: "center", handler: ui.ColumnStyle.cfn.createCheckbox },
                        { text: "序号", len: 40, align: "right", handler: ui.ColumnStyle.cfn.rowNumber },
                        { column: ["PROJECT_LOCK_LEVEL", "PROJECT_LOCK_LEVEL_NAME"], text: "锁定级别", len: 80, align: "center", handler:projectManager.formatter.lockFormat },
                        { column: "PROJECT_STORE_LEVEL_NAME", text: "储备级别", len: 80, align: "center" },
                        { column: ["PRO_NAME", "PROJECT_ID", "IS_PLAN"], text: "项目名称", len: 360, handler: projectManager.formatter.queryDetails },
                        { column: ["PROJECT_ID", "CREDIT_STATUS"], text: "信用信息", len: 100, align: "center",handler: projectManager.formatter.xinyong },
                        { column: "PRO_TYPE_NAME", text: "项目类型", len: 80, align: "center" },
                        { column: ["STATUS", "STATUS_NAME"], text: "填报状态", len: 100, align: "center", handler: masterpage.formatter.projectState },
                        { column: "BUILD_PLACE_NAME", text: "建设地点", len: 120 },
                        { column: "ISPPP_NAME", text: "是否PPP项目", len: 100, align: "center"},
                        { column: "GB_INDUSTRY_NAME", text: "国标行业", len: 160, handler: ui.ColumnStyle.cfn.formatParagraph },
                        { column: "INDUSTRY_NAME", text: "所属行业", len: 160, handler: ui.ColumnStyle.cfn.formatParagraph },
                        { column: "INVESTMENT_TOTAL", text: "总投资(万元)", len: 110, align: "right", sort: true },
                        { column: "REPORT_TIME", text: "报送时间", len: 160, align: "center", sort: true, handler: ui.ColumnStyle.cfn.formatDateTime },
                        { column: "CREATE_TIME", text: "创建时间", len: 160, align: "center", sort: true, handler: ui.ColumnStyle.cfn.formatDateTime },
                        { column: "REPORT_DEPARTMENT_FULLNAME", text: "上报单位", len: 160, handler: ui.ColumnStyle.cfn.formatParagraph },
                        { column: "DEPARTMENT_FGW_FULLNAME", text: "上报接收单位", len: 160, handler: ui.ColumnStyle.cfn.formatParagraph },
                        { column: ["DEPARTMENT_FULLNAME","DEPARTMENT_FGW_FULLNAME"], text: "上报接收处室", len: 160, handler: projectManager.formatter.deptNameFormat  },
                        { column: "NAME", text: "标签", len: 160, align: "center",handler: projectManager.formatter.prolabelName },
                        { handler: ui.ColumnStyle.cfn.empty }
                    ],
                    selection: {
                        // type: "cell",
                        multiple: false,
                        exclude: "input[type=checkbox]"
                    },
                    pager: {
                        pageIndex: 1,
                        pageSize: 100
                    }
                };
                this.projectView = $("#projectView").setGridview(gridOption);
                this.projectView.pageTurning(function(e, pageIndex, pageSize) {
                    pageLogic.getGridData(pageIndex);
                });
                this.projectView.selected(function(e, elem, data) {
                    var lockLevel = data.rowData["PROJECT_LOCK_LEVEL"];
                    var projectID = data.rowData["PROJECT_ID"];
                    var lockLink = elem.find("lock");
                    if(lockLevel <= 0) {
                        lockLink.prop("href","../projectReserves/input/" + projectID + "?_b=I_M02_02");
                        lockLink.prop("target", "_self");
                    } else {
                        lockLink.prop("href","../projectOverView/getMasterDetail/" + projectID);
                    }
                });
                // add by fengdh 20190219 Start
                var xinyongGridOption = {
                    columns: [
                        // { text: "序号", len: 40, align: "right", handler: ui.ColumnStyle.cfn.rowNumber },
                        { column: "PROJECT_NAME", text: "项目名称", len: 260,},
                        { column: "PRO_ORG", text: "项目(法人)单位", len: 150, handler: ui.ColumnStyle.cfn.formatParagraph },
                        { column: "RESULT", text: "项目(法人)单位查询结果", len: 200, handler: ui.ColumnStyle.cfn.formatParagraph },
                        { column: "CREATE_TIME", text: "查询时间", len: 160, align: "center", handler: ui.ColumnStyle.cfn.formatDateTime },
                        { column: "CREATE_USER_NAME", text: "查询用户", len: 140, handler: ui.ColumnStyle.cfn.formatParagraph },
                        // { column: "TYPE_NAME", text: "查询功能区", len: 150, handler: ui.ColumnStyle.cfn.formatParagraph },
                        { handler: ui.ColumnStyle.cfn.empty }
                    ],
                    selection: {
                        type: "row",
                        multiple: false
                    },
                    pager: false
                };
                this.xinyongGridOption = $("#xinyongView").setGridview(xinyongGridOption);
                // add by fengdh 20190219 End
                //add by fengdh 2018/10/16 Start
                this.addProLabelWindow=$("#addProLabelWindow").putWindow({
                    show: "up",
                    hide: "down",
                    done: "up",
                    title: "添加标签",
                    width: 650,
                    height: 460,
                    isRespond: false,
                    resizeable: false,
                    draggable: false,
                });
                this.addProLabelWindow.opening(function () {
                    projectManager.getReportLaber(pageLogic.projectView.getSelectedValue())
                });
                this.addProLabelWindow.closing(function () {
                    pageLogic.getGridData();
                });
                this.addProLabelWindow.buttonAppend("addProLabelSaveBtn");
                this.addProLabelWindow.buttonAppend("closeBtn");
                //add by fengdh 2018/10/16 End
                //add by fengdh 20190218 start
                this.haveWxnameWindow=$("#haveWxname").putWindow({
                    show: "up",
                    hide: "down",
                    done: "up",
                    title: "生成项目信用信息",
                    width: 500,
                    height: 300,
                    isRespond: false,
                    resizeable: false,
                    draggable: false,
                });
                this.haveWxnameWindow.opening(function (e, elem, data) {
                    var pamaer ="QR_creditInfo";
                    ui.ajax.ajaxPost(
                        window.customObj.ctxp +"/home/creatImage?pamaer="+pamaer+"",
                        function(jsonResult) {
                            if(jsonResult.result) {
                                $("#captchaImage").prop("src", jsonResult.data);
                            }
                        },
                        function(error) {
                            var index = error.message.indexOf("_business_exception");
                            if (index != -1) {
                                ui.msgshow(error.message.substr(0, index));
                            } else {
                                ui.msgshow(error.message, true);
                            }
                        }
                    );
                });
                this.haveWxnameWindow.buttonAppend("colsedBtn1");
                // add by fengdh 20190218 start
                this.xinyongWindow = $("#xinyongWindow").putWindow({
                    show: "up",
                    hide: "down",
                    done: "up",
                    title: "项目信用信息",
                    width: 910,
                    height: 50,
                    isRespond: true,
                    resizeable: false,
                    draggable: false
                });
                this.xinyongWindow.buttonAppend("contactsBtn");
                // add by fengdh 20190218 end
            },
            //add by fengdh 20190218 end

            //布局计算
            layout: function () {
                masterpage.resize(function () {
                    //40 是toolbar的高度
                    var height = masterpage.contentBodyHeight - masterpage.toolbar.height,
                        width = masterpage.contentBodyWidth;

                    if(width <=1024) {
                        $("#extendPanel .tools li").css("margin-right", "5px");
                        $("#pppRatePrompt").text("社会资本综合年化收益率(%)");
                    } else {
                        $("#extendPanel .tools li").css("margin-right", "10px");
                        $("#pppRatePrompt").text("社会资本综合年化收益率（%）");
                    }


                    pageLogic.projectView.setHeight(height);
                });

            },
            //在布局计算后创建控件
            after: function () {
                this.pppStageList = $("#PPPStage").setSelectList({
                    multiple: true,
                    valueField: "value",
                    textField: "text",
                    data: pppStageData
                });
                this.pppStageList.selected(function (e, elem, listData) {
                    var selectedList = this.getMultipleSelection();
                    if (selectedList.length === 0) {
                        this.element.val("");
                    } else if (selectedList.length === 1) {
                        this.element.val(selectedList[0]["text"]);
                    } else {
                        var selectedData = this.getMultipleSelection();
                        var text = [];
                        for (var i = 0; i < selectedData.length; i++) {
                            text.push(selectedData[i]["text"]);
                        }
                        this.element.removeAttr("title");
                        if (selectedData.length > 2) {
                            this.element.val(text[0]  + "，" + text[1] +  "...");
                            this.element.attr("title", text.join("，"));
                        } else {
                            this.element.val(text.join("，"));
                        }
                    }
                });
                this.pppStageList.canceled(function (e) {
                    this.element.val("");
                });

                //创建查询时间
                $(".date-text").dateChooser();

                //默认查询日期从当前1号到当前时间
                // var date = new Date();
                // var year = date.getFullYear();
                // var month = date.getMonth() + 1;
                // if(month < 10) {
                //     month = "0" + month;
                // }
                // var day = date.getDate();
                // if(day < 10) {
                //     day = "0" + day;
                // }
                //FIXED[LV]:修改查询时间范围，默认从当前日期往前推一年
                // var startDate = (year-1) + "-" + month + "-" + day;
                // var nowDate = year +"-" + month +"-" + day;
                // $("#startCreateTime").val(startDate);
                // $("#endCreateTime").val(nowDate);
                //日期选择
                $("#startCreateTime").dateChooser({
                });
                $("#endCreateTime").dateChooser({
                });

                // 用户所属部门存储级别
                pageLogic.storeLevel = $("#storeLevel");

                //初始化【所属行业】下拉选择列表
                this.industrySelectTree = $("#q_industry").setSelectTree({
                    layoutPanel: "baseInfoPanel",
                    multiple: true,
                    width: 360,
                    valueField: "itemKey",
                    textField: "itemValue",
                    parentField: "itemParent",
                    canSelectNode: true,
                    data: [{itemKey: "", itemValue: "正在加载..."}],
                    defaultOpen: false,
                    lazy: true
                });
                this.industrySelectTree.selecting(function (e, elem, treeData) {
                });
                this.industrySelectTree.selected(function (e, elem, treeData) {
                    if (treeData.isNode) {
                        this.selectChildNode(elem, treeData.isSelected);
                    }

                    if (!treeData.isRoot) {
                        this.selectParentNode(elem, treeData.isSelected);
                    }

                    var selectedData = this.getMultipleSelection();
                    var text = [];
                    for (var i = 0; i < selectedData.length; i++) {
                        text.push(selectedData[i].itemValue);
                    }
                    this.element.removeAttr("title");
                    if (selectedData.length > 2) {
                        this.element.val(text[0] + "...");
                        this.element.attr("title", text.join("，"));
                    } else {
                        this.element.val(text.join("，"));
                    }
                });
                this.industrySelectTree.canceled(function(e) {
                    this.element.val("").removeAttr("title");
                });
                //初始化【项目标签】下拉列表
                this.proLabelSelectTree = $("#q_proLabel").setSelectList({
                    layoutPanel: "baseInfoPanel",
                    multiple: true,
                    width: 195,
                    valueField: "itemKey",
                    textField: "itemValue",
                    parentField: "itemParent",
                    canSelectNode: false,
                    defaultOpen: false,
                    data: [{itemKey: "", itemValue: "正在加载..."}],
                    lazy: true,
                    limit: 100
                });
                this.proLabelSelectTree.selecting(function (e, elem, treeData) {
                });
                this.proLabelSelectTree.selected(function (e, elem, treeData) {
                    var selectedDatas = this.getMultipleSelection();
                    var text = [];
                    var itemKeyArray = [];
                    for (var i = 0; i < selectedDatas.length; i++) {
                        text.push(selectedDatas[i]["itemValue"]);
                        itemKeyArray.push(selectedDatas[i]["itemKey"]);
                    }
                    this.element.removeAttr("title");
                    if (selectedDatas.length > 3) {
                        this.element.val(text[0] + "，" + text[1] + "，" + text[2] + "...");
                        this.element.attr("title", text.join("，"));
                    } else {
                        this.element.val(text.join("，"));
                    }
                    this.element.blur();
                    window.pageLogic.isChange = true;
                });
                this.proLabelSelectTree.canceled(function(e) {
                    this.element.val("");
                });

                //初始化【建设地点】下拉选择列表
                this.buildPlaceSelectTree = $("#q_buildPlace").setSelectTree({
                    layoutPanel: "baseInfoPanel",
                    multiple: true,
                    width: 360,
                    valueField: "itemKey",
                    textField: "itemValue",
                    parentField: "itemParent",
                    canSelectNode: true,
                    defaultOpen: false,
                    data: [{itemKey: "", itemValue: "正在加载..."}],
                    lazy: true
                });
                this.buildPlaceSelectTree.selecting(function (e, elem, treeData) {
                });
                this.buildPlaceSelectTree.selected(function (e, elem, treeData) {
                    if (treeData.isNode) {
                        this.selectChildNode(elem, treeData.isSelected);
                    }

                    if (!treeData.isRoot) {
                        this.selectParentNode(elem, treeData.isSelected);
                    }

                    var selectedData = this.getMultipleSelection();
                    var text = [];
                    for (var i = 0; i < selectedData.length; i++) {
                        text.push(selectedData[i].itemValue);
                    }
                    this.element.removeAttr("title");
                    if (selectedData.length > 2) {
                        this.element.val(text[0] + "...");
                        this.element.attr("title", text.join("，"));
                    } else {
                        this.element.val(text.join("，"));
                    }
                });
                this.buildPlaceSelectTree.canceled(function(e) {
                    this.element.val("").removeAttr("title");
                });

                this.PPPTypeSelectList = $("#PPPType").setSelectList({
                    multiple: true,
                    valueField: "itemKey",
                    textField: "itemValue",
                    data: customObj.pppTypeList
                });
                this.PPPTypeSelectList.selected(function (e, elem, listData) {
                    var selectedList = this.getMultipleSelection();
                    if (selectedList.length === 0) {
                        this.element.val("");
                    } else if (selectedList.length === 1) {
                        this.element.val(selectedList[0]["itemValue"]);
                    } else {
                        var selectedData = this.getMultipleSelection();
                        var text = [];
                        for (var i = 0; i < selectedData.length; i++) {
                            text.push(selectedData[i]["itemValue"]);
                        }
                        this.element.removeAttr("title");
                        if (selectedData.length > 2) {
                            this.element.val(text[0]  + "，" + text[1] +  "...");
                            this.element.attr("title", text.join("，"));
                        } else {
                            this.element.val(text.join("，"));
                        }
                    }
                });
                this.PPPTypeSelectList.canceled(function (e) {
                    this.element.val("");
                });
                this.cancelReasonItemSelectList = $("#cancelReasonItem").setSelectList({
                    multiple: true,
                    width:800,
                    valueField: "itemKey",
                    textField: "itemValue",
                    data: customObj.cancelReasonItemList
                });
                this.cancelReasonItemSelectList.selected(function (e, elem, listData) {
                    var selectedList = this.getMultipleSelection();
                    if (selectedList.length === 0) {
                        this.element.val("");
                    } else if (selectedList.length === 1) {
                        this.element.val(selectedList[0]["itemValue"]);
                    } else {
                        var selectedData = this.getMultipleSelection();
                        var text = [];
                        for (var i = 0; i < selectedData.length; i++) {
                            text.push(selectedData[i]["itemValue"]);
                        }
                        this.element.removeAttr("title");
                        if (selectedData.length > 2) {
                            this.element.val(text[0]  + "，" + text[1] +  "...");
                            this.element.attr("title", text.join("，"));
                        } else {
                            this.element.val(text.join("，"));
                        }
                    }
                });
                this.cancelReasonItemSelectList.canceled(function (e) {
                    this.element.val("");
                });
                this.governmentParticipationModeSelectList = $("#governmentParticipationMode").setSelectList({
                    multiple: true,
                    valueField: "itemKey",
                    textField: "itemValue",
                    data: customObj.governmentParticipationModeList
                });
                this.governmentParticipationModeSelectList.selected(function (e, elem, listData) {
                    var selectedList = this.getMultipleSelection();
                    if (selectedList.length === 0) {
                        this.element.val("");
                    } else if (selectedList.length === 1) {
                        this.element.val(selectedList[0]["itemValue"]);
                    } else {
                        var selectedData = this.getMultipleSelection();
                        var text = [];
                        for (var i = 0; i < selectedData.length; i++) {
                            text.push(selectedData[i]["itemValue"]);
                        }
                        this.element.removeAttr("title");
                        if (selectedData.length > 2) {
                            this.element.val(text[0]  + "，" + text[1] +  "...");
                            this.element.attr("title", text.join("，"));
                        } else {
                            this.element.val(text.join("，"));
                        }
                    }
                });
                this.governmentParticipationModeSelectList.canceled(function (e) {
                    this.element.val("");
                });

                this.PPPOperatorSchemaSelectList = $("#PPPOperatorSchema").setSelectList({
                    multiple: true,
                    width:120,
                    valueField: "itemKey",
                    textField: "itemValue",
                    data: customObj.pppOperatorSchemaList
                });
                this.PPPOperatorSchemaSelectList.selected(function (e, elem, listData) {
                    var selectedList = this.getMultipleSelection();
                    if (selectedList.length === 0) {
                        this.element.val("");
                    } else if (selectedList.length === 1) {
                        this.element.val(selectedList[0]["itemValue"]);
                    } else {
                        var selectedData = this.getMultipleSelection();
                        var text = [];
                        for (var i = 0; i < selectedData.length; i++) {
                            text.push(selectedData[i]["itemValue"]);
                        }
                        this.element.removeAttr("title");
                        if (selectedData.length > 2) {
                            this.element.val(text[0]  + "，" + text[1] +  "...");
                            this.element.attr("title", text.join("，"));
                        } else {
                            this.element.val(text.join("，"));
                        }
                    }
                });
                this.PPPOperatorSchemaSelectList.canceled(function (e) {
                    this.element.val("");
                });

                this.organizationNatureSelectList = $("#organizationNature").setSelectList({
                    multiple: true,
                    valueField: "itemKey",
                    textField: "itemValue",
                    data: customObj.organizationNatureList
                });
                this.organizationNatureSelectList.selected(function (e, elem, listData) {
                    var selectedList = this.getMultipleSelection();
                    if (selectedList.length === 0) {
                        this.element.val("");
                    } else if (selectedList.length === 1) {
                        this.element.val(selectedList[0]["itemValue"]);
                    } else {
                        var selectedData = this.getMultipleSelection();
                        var text = [];
                        for (var i = 0; i < selectedData.length; i++) {
                            text.push(selectedData[i]["itemValue"]);
                        }
                        this.element.removeAttr("title");
                        if (selectedData.length > 2) {
                            this.element.val(text[0]  + "，" + text[1] +  "...");
                            this.element.attr("title", text.join("，"));
                        } else {
                            this.element.val(text.join("，"));
                        }
                    }
                });
                this.organizationNatureSelectList.canceled(function (e) {
                    this.element.val("");
                });

                this.returnMethodSelectList = $("#returnMethod").setSelectList({
                    multiple: true,
                    valueField: "itemKey",
                    textField: "itemValue",
                    data: customObj.returnMethodList
                });
                this.returnMethodSelectList.selected(function (e, elem, listData) {
                    var selectedList = this.getMultipleSelection();
                    if (selectedList.length === 0) {
                        this.element.val("");
                    } else if (selectedList.length === 1) {
                        this.element.val(selectedList[0]["itemValue"]);
                    } else {
                        var selectedData = this.getMultipleSelection();
                        var text = [];
                        for (var i = 0; i < selectedData.length; i++) {
                            text.push(selectedData[i]["itemValue"]);
                        }
                        this.element.removeAttr("title");
                        if (selectedData.length > 2) {
                            this.element.val(text[0]  + "，" + text[1] +  "...");
                            this.element.attr("title", text.join("，"));
                        } else {
                            this.element.val(text.join("，"));
                        }
                    }
                });
                this.returnMethodSelectList.canceled(function (e) {
                    this.element.val("");
                });

                this.reviewTypeSelectList = $("#reviewType").setSelectList({
                    multiple: true,
                    valueField: "itemKey",
                    textField: "itemValue",
                    data: customObj.reviewTypeList
                });
                this.reviewTypeSelectList.selected(function (e, elem, listData) {
                    var selectedList = this.getMultipleSelection();
                    if (selectedList.length === 0) {
                        this.element.val("");
                    } else if (selectedList.length === 1) {
                        this.element.val(selectedList[0]["itemValue"]);
                    } else {
                        var selectedData = this.getMultipleSelection();
                        var text = [];
                        for (var i = 0; i < selectedData.length; i++) {
                            text.push(selectedData[i]["itemValue"]);
                        }
                        this.element.removeAttr("title");
                        if (selectedData.length > 2) {
                            this.element.val(text[0]  + "，" + text[1] +  "...");
                            this.element.attr("title", text.join("，"));
                        } else {
                            this.element.val(text.join("，"));
                        }
                    }
                });
                this.reviewTypeSelectList.canceled(function (e) {
                    this.element.val("");
                });

                this.selectiveModeSelectList = $("#selectiveMode").setSelectList({
                    multiple: true,
                    valueField: "itemKey",
                    textField: "itemValue",
                    data: customObj.selectiveModeList
                });
                this.selectiveModeSelectList.selected(function (e, elem, listData) {
                    var selectedList = this.getMultipleSelection();
                    if (selectedList.length === 0) {
                        this.element.val("");
                    } else if (selectedList.length === 1) {
                        this.element.val(selectedList[0]["itemValue"]);
                    } else {
                        var selectedData = this.getMultipleSelection();
                        var text = [];
                        for (var i = 0; i < selectedData.length; i++) {
                            text.push(selectedData[i]["itemValue"]);
                        }
                        this.element.removeAttr("title");
                        if (selectedData.length > 2) {
                            this.element.val(text[0]  + "，" + text[1] +  "...");
                            this.element.attr("title", text.join("，"));
                        } else {
                            this.element.val(text.join("，"));
                        }
                    }
                });
                this.selectiveModeSelectList.canceled(function (e) {
                    this.element.val("");
                });
                //add by fengdh 2018/10/17 Start
                this.proLabelNameSelect = $("#proLabelName").setSelectList({
                    multiple: true,
                    width: 280,
                    valueField: "NAME",
                    textField: "NAME",
                    childField: "C",
                    data: [{ ID: "loading", "NAME": "正在加载..." }],
                    canSelectNode: true,
                    defaultOpen: true
                });
                this.proLabelNameSelect.selecting(function(e, elem, data) {
                    if(data.data.ID === "loading") {
                        return false;
                    }
                });
                this.proLabelNameSelect.selected(function(e, elem, data) {
                    var selectedList = this.getMultipleSelection();
                    if (selectedList.length === 0) {
                        this.element.val("");
                    } else if (selectedList.length === 1) {
                        this.element.val(selectedList[0]["NAME"]);
                    } else {
                        var selectedData = this.getMultipleSelection();
                        var text = [];
                        for (var i = 0; i < selectedData.length; i++) {
                            text.push(selectedData[i]["NAME"]);
                        }
                        this.element.removeAttr("title");
                        if (selectedData.length > 2) {
                            this.element.val(text[0]  + "，" + text[1] +  "...");
                            this.element.attr("title", text.join("，"));
                        } else {
                            this.element.val(text.join("，"));
                        }
                    }
                });
                this.proLabelNameSelect.canceled(function(e) {
                    this.element.val("");
                });
                // // 信用信息多选
                this.xinyongStatusSelectList = $("#xinyongStatus").setSelectList({
                    multiple: true,
                    valueField: "itemKey",
                    textField: "itemValue",
                    width:119,
                    data: [{"itemFullValue":"查询中","itemKey":"0","itemParent":"","itemValue":"查询中"},
                        {"itemFullValue":"有","itemKey":"1","itemParent":"","itemValue":"有"},
                        {"itemFullValue":"无","itemKey":"2","itemParent":"","itemValue":"无"},{"itemFullValue":"未查询",
                            "itemKey":"3","itemParent":"","itemValue":"未查询"}]
                });
                this.xinyongStatusSelectList.selected(function (e, elem, listData) {
                    var selectedList = this.getMultipleSelection();
                    if (selectedList.length === 0) {
                        this.element.val("");
                    } else if (selectedList.length === 1) {
                        this.element.val(selectedList[0]["itemValue"]);
                    } else {
                        var selectedData = this.getMultipleSelection();
                        var text = [];
                        for (var i = 0; i < selectedData.length; i++) {
                            text.push(selectedData[i]["itemValue"]);
                        }
                        this.element.removeAttr("title");
                        if (selectedData.length > 2) {
                            this.element.val(text[0]  + "，" + text[1] +  "...");
                            this.element.attr("title", text.join("，"));
                        } else {
                            this.element.val(text.join("，"));
                        }
                    }
                });
                this.xinyongStatusSelectList.canceled(function (e) {
                    this.element.val("");
                });
                // 项目类型多选
                this.projectTypeSelectList = $("#projectType").setSelectList({
                    multiple: true,
                    valueField: "itemKey",
                    textField: "itemValue",
                    data: customObj.proTypeList
                });
                this.projectTypeSelectList.selected(function (e, elem, listData) {
                    var selectedList = this.getMultipleSelection();
                    if (selectedList.length === 0) {
                        this.element.val("");
                    } else if (selectedList.length === 1) {
                        this.element.val(selectedList[0]["itemValue"]);
                    } else {
                        var selectedData = this.getMultipleSelection();
                        var text = [];
                        for (var i = 0; i < selectedData.length; i++) {
                            text.push(selectedData[i]["itemValue"]);
                        }
                        this.element.removeAttr("title");
                        if (selectedData.length > 2) {
                            this.element.val(text[0]  + "，" + text[1] +  "...");
                            this.element.attr("title", text.join("，"));
                        } else {
                            this.element.val(text.join("，"));
                        }
                    }
                });
                this.projectTypeSelectList.canceled(function (e) {
                    this.element.val("");
                })
                //add by fengdh 2018/10/17 End
            },
            //页面控件的事件绑定，一般是页面按钮的事件绑定
            events: function () {
                var more = $("#projectToolbar").find(".tool-extend-button");
                more.hide();
                this.isPPP = $("#isPPP").setSelectList({
                    valueField: "value",
                    textField: "text",
                    data: [
                        { value: "A00003", text: "全部" },
                        { value: "A00002", text: "否" },
                        { value: "A00001", text: "是" }
                    ]
                });
                this.isPPP.selected(function(e, elem, item) {
                    this.element.val(item.data.text);
                    if(item.data.value === "A00001") {
                        more.show();
                        pageLogic.toolbar.showExtend();
                        pageLogic.toolbar.pinExtend();
                    } else {
                        if(pageLogic.toolbar.isExtendPin()) {
                            pageLogic.toolbar.unpinExtend();
                        }else {
                            pageLogic.toolbar.hideExtend();
                        }
                        more.hide();
                    }
                });
                this.isPPP.canceled(function(e) {
                    this.element.val("");
                    if(pageLogic.toolbar.isExtendPin()) {
                        pageLogic.toolbar.unpinExtend();
                    }else {
                        pageLogic.toolbar.hideExtend();
                    }
                    more.hide();
                });

                $("#query").click(function(e) {
                    var startCreateTime = $("#startCreateTime").val();
                    var endCreateTime = $("#endCreateTime").val();
                    //add by zhangyu 20170814  #39
                    if(!ui.str.isNullOrEmpty(startCreateTime) && !ui.str.isNullOrEmpty(endCreateTime) && startCreateTime > endCreateTime) {
                        ui.messageShow('"创建时间"开始时间不能大于结束时间');
                    }else if(pageLogic.isPPP.getCurrentSelection()!=null&&pageLogic.isPPP.getCurrentSelection().value=="A00001"&&$("#approveStart").val() != "" && $("#approveEnd").val() != "" && $("#approveStart").val() > $("#approveEnd").val()){
                        ui.messageShow('"方案批准时间"开始时间不能大于结束时间');
                    } else {
                        pageLogic.getGridData();
                    }
                    //add end
                });

                //撤回项目   add by huangwei 2017-1-10  start
                $("#retract").click(function () {
                    projectManager.retractProject();
                });
                //撤回项目   add by huangwei 2017-1-10  end

                //手动添加标签 add by fengdh 2018-10-17  start
                $("#addProlabel").click(function () {
                    projectManager.projectProlabelSure();
                    $("#proLabelContent").val("");
                });
                $("#addProLabelSaveBtn").click(function () {
                    projectManager.saveAddProlabel();
                });
                $("#closeBtn").click(function () {
                    pageLogic.addProLabelWindow.hide();
                });
                $("#creatCredit").click(function () {
                    projectManager.creatCreditSure();
                });
                $("#colsedBtn1").click(function(e) {
                    pageLogic.haveWxnameWindow.hide();
                });
                $("#contactsBtn").click(function(e) {
                    pageLogic.xinyongWindow.hide();
                });
                //手动添加标签 add by fengdh 2018-10-17  end
                //跳转到报表打印页面
                $("#printProjectBtn").click(function() {
                    var proName = $("#projectName").val();
                    var startTime = $("#startCreateTime").val();
                    var endTime = $("#endCreateTime").val();

                    var i;
                    var industryKeys = [],
                        buildPlaceKeys = [],
                        proLabelKeys = [],
                        xinyongStatuskeys=[],
                        projectTypekeys=[],
                        proLabeNamelkeys = [];

                    var industryList = pageLogic.industrySelectTree.getMultipleSelection();
                    if(industryList.length > 1000) {
                        ui.warnShow("所属行业不能大于1000个");
                        return;
                    }
                    if(industryList && industryList.length > 0) {
                        var text = [];
                        for (var i = 0; i < industryList.length; i++) {
                            industryKeys.push(industryList[i].itemKey);
                        }
                    }
                    //项目标签
                    var proLabelList=pageLogic.proLabelSelectTree.getMultipleSelection();
                    if(proLabelList && proLabelList.length > 0){
                        for ( var i =0;i< proLabelList.length;i++){
                            proLabelKeys.push(proLabelList[i].itemKey);
                        }
                    }
                    var proLabelNameList = pageLogic.proLabelNameSelect.getMultipleSelection();
                    if(proLabelNameList && proLabelNameList.length > 0){
                        for (i =0;i< proLabelNameList.length;i++){
                            proLabeNamelkeys.push(proLabelNameList[i].NAME);
                        }
                    }
                    var buildPlaceList = pageLogic.buildPlaceSelectTree.getMultipleSelection();
                    if(buildPlaceList.length > 1000) {
                        ui.warnShow("建设地点不能大于1000个");
                        return;
                    }
                    if(buildPlaceList && buildPlaceList.length > 0) {
                        var text = [];
                        for (var i = 0; i < buildPlaceList.length; i++) {
                            buildPlaceKeys.push(buildPlaceList[i].itemKey);
                        }
                    }
                    var isPPP = pageLogic.isPPP.getCurrentSelection();
                    if(isPPP) {
                        if("A00003"==isPPP.value){
                            isPPP = "";
                        }else {
                            isPPP = isPPP.value;
                        }
                    } else {
                        isPPP = "";
                    }
                    // 项目类型多选
                    var projectTypeList = pageLogic.projectTypeSelectList.getMultipleSelection();
                    if(projectTypeList && projectTypeList.length > 0) {
                        for (i = 0; i < projectTypeList.length; i++) {
                            projectTypekeys.push(projectTypeList[i]["itemKey"]);
                        }
                    }
                    // 信用信息查询条件改多选
                    var xinyongStatusList = pageLogic.xinyongStatusSelectList.getMultipleSelection();
                    if(xinyongStatusList && xinyongStatusList.length > 0){
                        for (i =0;i< xinyongStatusList.length;i++){
                            xinyongStatuskeys.push(xinyongStatusList[i].itemKey);
                        }
                    }
                    var industry = industryKeys.join(",");
                    var buildPlace = buildPlaceKeys.join(",");
                    var proLabel = proLabelKeys.join(",");
                    var proType = projectTypekeys.join(",");
                    var startMoney = $("#startMoney").val();
                    var endMoney = $("#endMoney").val();
                    var proLabelName =proLabeNamelkeys.join(",");
                    var xinyongStatus = xinyongStatuskeys.join(",");
                    var url = masterpage.ctxPath + "/projectReport/project-report?proName=" + window.encodeURIComponent(proName) + "&createTimeStart=" + startTime + "&createTimeEnd=" + endTime
                        + "&status=" + masterpage.projectReportedStatus + "&isPPP=" + isPPP
                        + "&proType=" + proType + "&industry=" + industry + "&buildPlace=" + buildPlace
                        + "&investmentTotalStart=" + startMoney + "&investmentTotalEnd=" + endMoney + "&proLabel=" + proLabel+ "&proLabelName=" + proLabelName+ "&xinyongStatus=" + xinyongStatus;

                    window.open(url);
                });
            },
            //数据初始化
            load: function() {
                pageLogic.loadDictionaries();
                pageLogic.loadLabel();
                pageLogic.getGridData();

            }
        },
        //延迟加载下拉树数据
        loadDictionaries: function() {
            //建设地点
            ui.ajax.dataLoadAsync(customObj.buildPlaceListUrl, {
                dataLength: customObj.buildPlaceListCount
            }, function(data) {
                pageLogic.buildPlaceSelectTree.setData(data);
            }, function(e) {
                ui.msgshow("加载建设地点数据发生错误", true);
            });
            //所属行业
            ui.ajax.dataLoadAsync(customObj.industryListUrl, {
                dataLength: customObj.industryListCount
            }, function(data) {
                pageLogic.industrySelectTree.setData(data);
            }, function(e) {
                ui.msgshow("加载所属行业数据发生错误", true);
            });
            //项目标签
            ui.ajax.dataLoadAsync(customObj.projectUrl, {
                dataLength:customObj.projectLaber
            },function (data) {
                pageLogic.proLabelSelectTree.setData(data);
            }, function(e) {
                ui.msgshow("加载项目标签数据发生错误", true);
            });
            pageLogic.isPPP.setCurrentSelection({ value: "A00003", text: "全部" });
        },
        //ajax 数据请求
        loadLabel:function () {
            //add by fengdh 2018/10/17 Start
            ui.ajax.ajaxPost(customObj.ProjectLabelListUrl,
                function(data) {
                    var i;
                    data.splice(0, 0, { ID: "ID_0", NAME: "无" });
                    if($.isArray(data)) {
                        for(i = 1; i < data.length; i++) {
                            data[i]["ID"] = "ID_" + i;
                        }
                    } else {
                        data = [];
                    }
                    pageLogic.proLabelNameSelect.setData(data);
                },
                function(e) {
                    ui.msgshow("加载标签名称下拉数据发生错误", true);
                }
            );
            //add by fengdh 2018/10/17 End
        },
        getGridData: function (pageIndex) {
            if(ui.core.type(pageIndex) !== "number" || pageIndex < 1) {
                pageLogic.projectView.pageIndex = pageIndex = 1;
            }
            var i;
            var industryKeys = [],
                buildPlaceKeys = [],
                pppTypeKeys = [],
                cancelReasonItemKeys = [],
                governmentParticipationModeKeys = [],
                pppStageKeys = [],
                pppOperatorSchemaKeys = [],
                organizationNatureKeys = [],
                returnMethodKeys = [],
                reviewTypeKeys = [],
                proLabelKeys = [],
                proLabeNamelkeys=[],
                xinyongStatuskeys=[],
                projectTypekeys=[],
                selectiveModeKeys = [];

            var industryList = pageLogic.industrySelectTree.getMultipleSelection();
            if(industryList.length > 1000) {
                ui.warnShow("所属行业不能大于1000个");
                return;
            }
            if(industryList && industryList.length > 0) {
                var text = [];
                for ( i = 0; i < industryList.length; i++) {
                    industryKeys.push(industryList[i].itemKey);
                }
            }
            //项目标签
            var proLabelList = pageLogic.proLabelSelectTree.getMultipleSelection();
            if(proLabelList && proLabelList.length > 0){
                var text =[];
                for(i= 0 ;i < proLabelList.length;i++){
                    proLabelKeys.push(proLabelList[i].itemKey);
                }
            }
            // 标签名称
            var proLabelNameList = pageLogic.proLabelNameSelect.getMultipleSelection();
            if(proLabelNameList && proLabelNameList.length > 0){
                for (i =0;i< proLabelNameList.length;i++){
                    proLabeNamelkeys.push(proLabelNameList[i].NAME);
                }
            }
            var buildPlaceList = pageLogic.buildPlaceSelectTree.getMultipleSelection();
            if(buildPlaceList.length > 1000) {
                ui.warnShow("建设地点不能大于1000个");
                return;
            }
            if(buildPlaceList && buildPlaceList.length > 0) {
                var text = [];
                for (var i = 0; i < buildPlaceList.length; i++) {
                    buildPlaceKeys.push(buildPlaceList[i].itemKey);
                }
            }

            var pppStageList = pageLogic.pppStageList.getMultipleSelection();
            if(pppStageList && pppStageList.length > 0) {
                for (i = 0; i < pppStageList.length; i++) {
                    pppStageKeys.push(pppStageList[i]["value"]);
                }
            }

            var pppTypeList = pageLogic.PPPTypeSelectList.getMultipleSelection();
            if(pppTypeList && pppTypeList.length > 0) {
                for (i = 0; i < pppTypeList.length; i++) {
                    pppTypeKeys.push(pppTypeList[i]["itemKey"]);
                }
            }
            var cancelReasonItemList = pageLogic.cancelReasonItemSelectList.getMultipleSelection();
            if(cancelReasonItemList && cancelReasonItemList.length > 0) {
                for (i = 0; i < cancelReasonItemList.length; i++) {
                    cancelReasonItemKeys.push(cancelReasonItemList[i]["itemKey"]);
                }
            }
            var governmentParticipationModeList = pageLogic.governmentParticipationModeSelectList.getMultipleSelection();
            if(governmentParticipationModeList && governmentParticipationModeList.length > 0) {
                for (i = 0; i < governmentParticipationModeList.length; i++) {
                    governmentParticipationModeKeys.push(governmentParticipationModeList[i]["itemKey"]);
                }
            }
            var pppOperatorSchemaList = pageLogic.PPPOperatorSchemaSelectList.getMultipleSelection();
            if(pppOperatorSchemaList && pppOperatorSchemaList.length > 0) {
                for (i = 0; i < pppOperatorSchemaList.length; i++) {
                    pppOperatorSchemaKeys.push(pppOperatorSchemaList[i]["itemKey"]);
                }
            }
            var organizationNatureList = pageLogic.organizationNatureSelectList.getMultipleSelection();
            if(organizationNatureList && organizationNatureList.length > 0) {
                for (i = 0; i < organizationNatureList.length; i++) {
                    organizationNatureKeys.push(organizationNatureList[i]["itemKey"]);
                }
            }
            var returnMethodList = pageLogic.returnMethodSelectList.getMultipleSelection();
            if(returnMethodList && returnMethodList.length > 0) {
                for (i = 0; i < returnMethodList.length; i++) {
                    returnMethodKeys.push(returnMethodList[i]["itemKey"]);
                }
            }
            var reviewTypeList = pageLogic.reviewTypeSelectList.getMultipleSelection();
            if(reviewTypeList && reviewTypeList.length > 0) {
                for (i = 0; i < reviewTypeList.length; i++) {
                    reviewTypeKeys.push(reviewTypeList[i]["itemKey"]);
                }
            }
            var selectiveModeList = pageLogic.selectiveModeSelectList.getMultipleSelection();
            if(selectiveModeList && selectiveModeList.length > 0) {
                for (i = 0; i < selectiveModeList.length; i++) {
                    selectiveModeKeys.push(selectiveModeList[i]["itemKey"]);
                }
            }
            // 项目类型多选
            var projectTypeList = pageLogic.projectTypeSelectList.getMultipleSelection();
            if(projectTypeList && projectTypeList.length > 0) {
                for (i = 0; i < projectTypeList.length; i++) {
                    projectTypekeys.push(projectTypeList[i]["itemKey"]);
                }
            }
            // 信用信息查询条件改多选
            var xinyongStatusList = pageLogic.xinyongStatusSelectList.getMultipleSelection();
            if(xinyongStatusList && xinyongStatusList.length > 0){
                for (i =0;i< xinyongStatusList.length;i++){
                    xinyongStatuskeys.push(xinyongStatusList[i].itemKey);
                }
            }
            var isPPP = pageLogic.isPPP.getCurrentSelection();
            if(isPPP) {
                if("A00003"==isPPP.value){
                    isPPP = "";
                }else {
                    isPPP = isPPP.value;
                }
            } else {
                isPPP = "";
            }
            var param = {
                pageIndex: pageLogic.projectView.pageIndex - 1,
                pageSize: pageLogic.projectView.pageSize,
                projectName: $("#projectName").val() || null,
                startCreateTime: $("#startCreateTime").val() || null,
                endCreateTime: $("#endCreateTime").val() || null,
                industry: industryKeys.join(","),
                buildPlace: buildPlaceKeys.join(","),
                "projectType": projectTypekeys.join(","),
                "xinyongStatus":xinyongStatuskeys.join(","),
                startMoney: $("#startMoney").val() || null,
                endMoney: $("#endMoney").val() || null,
                "isPPP": isPPP || "",
                "pppType": pppTypeKeys.join(","),
                "cancelReasonItem": cancelReasonItemKeys.join(","),
                "governmentParticipationMode": governmentParticipationModeKeys.join(","),
                "pppOperatorSchema": pppOperatorSchemaKeys.join(","),
                "projectImplementationOrganization": $("#projectImplementationOrganization").val() || null,
                "organizationNature": organizationNatureKeys.join(","),
                "programmePreparationOrganization": $("#programmePreparationOrganization").val() || null,
                "returnMethod": returnMethodKeys.join(",")|| null,
                "startYear": $("#startYear").val() || null,
                "endYear": $("#endYear").val() || null,
                "reviewUnit": $("#reviewUnit").val() || null,
                "reviewType": reviewTypeKeys.join(","),
                "approveStart": $("#approveStart").val() || null,
                "approveEnd": $("#approveEnd").val() || null,
                "planYear": $("#planYear").val() || null,
                "selectiveMode": selectiveModeKeys.join(",")|| null,
                "socialInvestmentParty": $("#socialInvestmentParty").val() || null,
                "agent": $("#agent").val() || null,
                "projectStartMoney": $("#projectStartMoney").val() || null,
                "projectEndMoney": $("#projectEndMoney").val() || null,
                "socialCapitalStart": $("#socialCapitalStart").val() || null,
                "socialCapitalEnd": $("#socialCapitalEnd").val() || null,
                "governmentInvestmentStart": $("#governmentInvestmentStart").val() || null,
                "governmentInvestmentEnd": $("#governmentInvestmentEnd").val() || null,
                "isSetUpACompany": $("#isSetUpACompany").val() || null,
                "annualYieldStart": $("#annualYieldStart").val() || null,
                "annualYieldEnd": $("#annualYieldEnd").val() || null,
                "pppStageList":pppStageKeys.join(","),
                "proLabel": proLabelKeys.join(",")|| null,
                "proLabelName":proLabeNamelkeys.join(",")|| null,
            };

            // if(param.isPPP) {
            //     param.isPPP = param.isPPP.value;
            // }
            // ui.loadingShow();
            ui.ajax.ajaxPostOnce(
                "query",
                "../projectOverView/getReported",

                param,
                function(result) {
                    if(result.data) {
                        pageLogic.projectView.createGridBody(result.data.items, result.data.totalCount);
                    } else {
                        pageLogic.projectView.empty();
                    }
                }, function(error) {
                    ui.msgshow(error.message, true);
                });
        }
    };
    var projectManager = {
        formatter: {
            queryDetails: function(content) {
                var link = $("<a class='lock' href='javascript:void(0)' target='_blank' />");
                link.text(content.PRO_NAME);
                link.prop("href", "../projectOverView/getMasterDetail/" + content.PROJECT_ID + "?_b=" + window.curModuleCode);
                if (content.IS_PLAN == "1") {
                    var isPlan = [];
                    var span = $("<span>" + "编" + "</span>");
                    span.css({
                        "background-color": "#2F6699",
                        "color": "#FFFFFF",
                        "padding": "0px 3px 2px 3px"
                    });
                    isPlan = [span, link];
                    return isPlan;
                } else {
                    return link;
                }
            },
            updataNull: function (content, columnObj) {
                var span = $("<span class='custom-text' />");
                if(content == "null") {
                    span.text("");
                }
                return span;
            },
            lockFormat: function(content, columnObj) {
                debugger;
                if (content == null) {
                    return;
                }
                var span = $("<span class='state-text'>" + ui.str.htmlEncode(content[1]) + "</span>");

                var color = content[0] <= pageLogic.storeLevel.val() ? "#2F6699" : "#FF2968";
                span.css({
                    "width": "60px",
                    "background-color": color
                });
                return span;
            },
            deptNameFormat:function (content) {
                if (content == null) {
                    return;
                }
                if (content.DEPARTMENT_FULLNAME == content.DEPARTMENT_FGW_FULLNAME) {
                    return "";
                } else {
                    return content.DEPARTMENT_FULLNAME;
                }
            },
            //add by fengdh 2018/10/17 Start
            prolabelName:function (value) {
                var span = $("<span/>");
                if(value == ""){
                    span.text("无");
                }else {
                    span.text(value);
                }
                return span;
            },
            //add by fengdh 20190218 Start
            xinyong: function(content, columnObj) {
                var completely = content.CREDIT_STATUS ;
                if (completely == "0") {
                    return "查询中"
                }else if (completely == "1"||completely == "2") {
                    var a;
                    a = $("<a class='uploadClass' href='#'>查看</a>");
                    a.click(function (e) {
                        projectManager.getxinyongData(content.PROJECT_ID);
                        pageLogic.xinyongWindow.show();
                    });
                    return a;
                }else {
                    return ""
                }
            }
            //add by fengdh 20190218 End
        },
        // add by fengdh 20190218 start
        // 判断点击生成项目信用信息时弹出的提醒框
        creatCreditSure:function () {
            var checkboxList =pageLogic.projectView.gridBody.find(".gridview-check");
            var result = [];
            var i = 0,
                len = checkboxList.length,
                checkbox = null;
            for (; i < len; i++) {
                checkbox = $(checkboxList[i]);
                if (checkbox.prop("name").indexOf("_all") >= 0 || !checkbox.prop("checked"))
                    continue;
                result.push(pageLogic.projectView.dataTable[checkbox.parent().parent()[0].rowIndex]);
            }
            var projectList = result;
            if(projectList.length == 0) {
                ui.msgshow("请至少选择一个项目进行生成项目信用信息！");
                return;
            }else if(projectList.length > 0){
                ui.ajax.ajaxPost(
                    window.customObj.ctxp +"/projectReserves/getWxname",
                    function (jsonResult) {
                        if(jsonResult.result){
                            // $("#wxname").text(jsonResult.message);
                            pageLogic.haveWxnameWindow.show();
                            isBangding=1;
                            projectManager.creatCredit();
                        }else{
                            pageLogic.haveWxnameWindow.show();
                            isBangding=2;
                            projectManager.creatCredit();
                        }
                    },
                    function (error) {
                        ui.errorShow("查询微信号失败");
                    },
                    { textFormat: "正在查询..." }
                );
            }
        },
        creatCredit:function () {
            var projectIds = pageLogic.projectView.getSelectedValue();
            var param ={
                "projectIds" :projectIds.join(","),
                "typename":'已报区',
                "isBangding":isBangding
            }
            ui.ajax.ajaxPost(
                window.customObj.ctxp +"/projectReserves/creatCredit",
                param,
                function (jsonResult) {
                    if(jsonResult.result){
                        //ui.msgshow("选中项目的项目信用信息正在查询中")
                    }else{
                        ui.errorShow("生成项目信用信息失败");
                    }
                },
                function (error) {
                    ui.errorShow("生成项目信用信息失败");
                },
                { textFormat: "正在保存..." }
            );
        },
        //获取项目信用信息
        getxinyongData: function(projectid) {
            ui.ajax.ajaxPost(
                window.customObj.ctxp +"/projectReserves/getxinyongData",
                projectid,
                function(result) {
                    if(result.data) {
                        pageLogic.xinyongGridOption.createGridBody(result.data);
                    } else {
                        pageLogic.contactsGrid.empty();
                    }
                }, function(error) {
                    ui.msgshow(error.message, true);
                });
        },
        //添加标签弹窗打开后 在页面上显示被选项目的标签
        getReportLaber:function(projectIds){
            $(".deleteReportLaber").remove();
            var param ={
                "projectIds" :projectIds.join(","),
            }
            ui.ajax.ajaxPost(
                window.customObj.ctxp +"/projectReserves/getReportLaber",
                param,
                function(jsonResult) {
                    var data = jsonResult.data;
                    for(var i = 0; i < data.length; i++){
                        if(data[i].NAME.length>26){
                            NAME1=data[i].NAME.substr(0,26)+"...";
                        }else {
                            NAME1=data[i].NAME;
                        }
                        $("#reportLaber").append("<article title='" + data[i].NAME + "' class='deleteReportLaber'><a class='deleteReportLaber' onclick='deleteReportLaber(\"" + data[i].NAME + "\");'<label style='font-size: 16px;color: #0000cc'><imgs src='../content/images/yBtn2.jpg'>删除</label></a>&nbsp;&nbsp;&nbsp;" + NAME1 + "</article>").css("line-height","25px");
                    }
                }, function(error) {
                    ui.msgshow(error.message, true);
                });
        },
        // add by fengdh 20190218 end
        //添加标签 判断
        projectProlabelSure:function () {
            var checkboxList =pageLogic.projectView.gridBody.find(".gridview-check");
            var result = [];
            var i = 0,
                len = checkboxList.length,
                checkbox = null;
            for (; i < len; i++) {
                checkbox = $(checkboxList[i]);
                if (checkbox.prop("name").indexOf("_all") >= 0 || !checkbox.prop("checked"))
                    continue;
                result.push(pageLogic.projectView.dataTable[checkbox.parent().parent()[0].rowIndex]);
            }
            var projectList = result;
            if(projectList.length == 0) {
                ui.msgshow("请至少选择一个项目进行添加标签！！！");
                return;
            }
            pageLogic.addProLabelWindow.show();
        },
        //add by fengdh 2018/10/17 End
        //add by wangsh 2017 03 02 start
        retractProject: function() {
            var projectIds = pageLogic.projectView.getSelectedValue();
            if (projectIds.length == 0) {
                ui.msgshow("请先选择要撤回的项目");
                return;
            } else if (projectIds.length > 1) {
                ui.msgshow("一次只能撤回一条项目");
                return;
            }
            ui.ajax.ajaxPost(
                window.customObj.ctxp + "/projectOverView/checkRevokeFlag",
                projectIds,
                function(jsonResult) {
                    if (jsonResult.result) {
                        if (jsonResult.message == "1"){
                            if (confirm("尊敬的用户，同一个项目一天仅能撤回5次！超过5次该项目今天将不能再撤回！")) {
                                ui.ajax.ajaxPost(
                                    window.customObj.ctxp + "/projectOverView/retractProject",
                                    projectIds,
                                    function(jsonResult1) {
                                        if(jsonResult1.result) {
                                            ui.successShow("项目撤回成功");
                                            pageLogic.getGridData();
                                        }else {
                                            ui.msgshow("\""+jsonResult1.data +"项目已被上级部门纳入本级项目储备库，无法撤回！\"");
                                            pageLogic.getGridData();
                                        }
                                    },
                                    function(error) {
                                        var index = error.message.indexOf("_business_exception");
                                        if (index != -1) {
                                            ui.msgshow(error.message.substr(0, index));
                                        } else {
                                            ui.msgshow(error.message, true);
                                        }
                                    }
                                );
                            } else {
                                return;
                            }
                        } else if (jsonResult.message == "2"){
                            if (confirm("尊敬的用户，该项目今天已撤回4次，还剩最后1次撤回机会！超过5次该项目今天将不能再撤回！")) {
                                ui.ajax.ajaxPost(
                                    window.customObj.ctxp + "/projectOverView/retractProject",
                                    projectIds,
                                    function(jsonResult1) {
                                        if(jsonResult1.result) {
                                            ui.successShow("项目撤回成功");
                                            pageLogic.getGridData();
                                        }else {
                                            ui.msgshow("\""+jsonResult1.data +"项目已被上级部门纳入本级项目储备库，无法撤回！\"");
                                            pageLogic.getGridData();
                                        }
                                    },
                                    function(error) {
                                        var index = error.message.indexOf("_business_exception");
                                        if (index != -1) {
                                            ui.msgshow(error.message.substr(0, index));
                                        } else {
                                            ui.msgshow(error.message, true);
                                        }
                                    }
                                );
                            } else {
                                return;
                            }
                        } else {
                            ui.msgshow("尊敬的用户，该项目今天已撤回满5次，当天不能再撤回！");
                            pageLogic.getGridData();
                        }
                    } else if (jsonResult.message == "4"){
                        if (!confirm("确定要撤回所选中的项目吗？")) {
                            return;
                        }
                        ui.ajax.ajaxPost(
                            window.customObj.ctxp + "/projectOverView/retractProject",
                            projectIds,
                            function(jsonResult1) {
                                if(jsonResult1.result) {
                                    ui.successShow("项目撤回成功");
                                    pageLogic.getGridData();
                                }else {
                                    ui.msgshow("\""+jsonResult1.data +"项目已被上级部门纳入本级项目储备库，无法撤回！\"");
                                    pageLogic.getGridData();
                                }
                            },
                            function(error) {
                                var index = error.message.indexOf("_business_exception");
                                if (index != -1) {
                                    ui.msgshow(error.message.substr(0, index));
                                } else {
                                    ui.msgshow(error.message, true);
                                }
                            }
                        );
                    } else {
                        ui.msgshow("尊敬的用户，该项目已被上级部门纳入本级项目储备库，无法撤回！");
                        pageLogic.getGridData();
                    }
                },
                function(error) {
                    var index = error.message.indexOf("_business_exception");
                    if (index != -1) {
                        ui.msgshow(error.message.substr(0, index));
                    } else {
                        ui.msgshow(error.message, true);
                    }
                }
            );
        },
        //add by wangsh 2017 03 02 end
        //add by fengdh 2018/10/17 Start
        saveAddProlabel:function () {
            var projectIds = pageLogic.projectView.getSelectedValue();
            var proLabelContent = ui.str.trim($("#proLabelContent").val()) ;
            if(proLabelContent.indexOf("\r\n")>0||proLabelContent.indexOf("\r\n")==0){
                ui.warnShow("标签内容请不要输入回车键请重新输入！");
                return false;
            }
            if(proLabelContent.indexOf("\n")>0||proLabelContent.indexOf("\n")==0){
                ui.warnShow("标签内容请不要输入回车键请重新输入！");
                return false;
            }
            if(proLabelContent.indexOf("\\")>0||proLabelContent.indexOf("\\")==0){
                ui.warnShow("标签内容不能包含  "+"\\"+" 号，请重新输入！");
                return false;
            }
            if(proLabelContent.indexOf("\,")>0||proLabelContent.indexOf("\,")==0){
                ui.warnShow("标签内容不能包含  "+","+"号，请重新输入！");
                return false;
            }
            if(proLabelContent.indexOf("\"\"")>0||proLabelContent.indexOf("\"\"")==0){
                ui.warnShow("标签内容不能包含  "+"\"\""+"号，请重新输入！");
                return false;
            }
            if(proLabelContent.indexOf("\"")>0||proLabelContent.indexOf("\"")==0){
                ui.warnShow("标签内容不能包含  "+"\""+"号，请重新输入！");
                return false;
            }
            if(proLabelContent.indexOf("\'")>0||proLabelContent.indexOf("\'")==0){
                ui.warnShow("标签内容不能包含  "+"\'"+" 号，请重新输入！");
                return false;
            }
            if(proLabelContent.indexOf("\'\'")>0||proLabelContent.indexOf("\'")==0){
                ui.warnShow("标签内容不能包含  "+"\'\'"+" 号，请重新输入！");
                return false;
            }
            if(proLabelContent=="无"){
                ui.warnShow("标签内容不能为'无'请重新输入");
                return false;
            }
            if(proLabelContent.length > 200){
                ui.warnShow("标签内容长度不能大于200");
                return false;
            }
            if(proLabelContent==null|| proLabelContent==""){
                ui.warnShow("标签内容不能为空");
                return false;
            }
            var  param ={
                "projectIds" :projectIds.join(","),
                "proLabelContent":proLabelContent
            }
            ui.ajax.ajaxPost(
                "../projectOverView/saveAddProlabel",
                param,
                function (jsonResult) {
                    if(jsonResult.result){
                        ui.successShow("添加标签成功");
                        pageLogic.addProLabelWindow.hide();
                        pageLogic.getGridData();
                        pageLogic.loadLabel();
                    }else{
                        ui.errorShow(jsonResult.message,true);
                    }
                },
                function (error) {
                    ui.errorShow("添加标签失败");
                },
                { textFormat: "正在保存..." }
            );
        },
        //add by fengdh 2018/10/17 End
    };
    window.deleteReportLaber= function(name) {
        if(confirm("你确定要删除这个标签吗？")){
            var projectIds = pageLogic.projectView.getSelectedValue();
            var param ={
                "projectIds" :projectIds.join(","),
                "name":name
            }
            ui.ajax.ajaxPost(
                "../projectReserves/deleteReportLaber",
                param,
                function (jsonResult) {
                    if(jsonResult.result){
                        ui.successShow("标签删除成功");
                        pageLogic.loadLabel();
                        projectManager.getReportLaber(projectIds);
                    }else{
                        ui.errorShow(jsonResult.message);
                    }
                },
                function (error) {
                    ui.errorShow("标签删失败");
                }
            );
        }
    };
    function addQueryVail() {
        queryValidateZh.money("startMoney","endMoney");
        queryValidateZh.money("projectStartMoney","projectEndMoney");
        queryValidateZh.money("socialCapitalStart","socialCapitalEnd");
        queryValidateZh.money("governmentInvestmentStart","governmentInvestmentEnd");
        queryValidateZh.money("annualYieldStart","annualYieldEnd");
        queryValidateZh.money("startYear","endYear");
    }
    var queryValidateZh = {
        money : function (star,end) {
            var reg = /^[1-9]\d{0,9}$/
            if(''!=star&&null!=star){
                $('#'+star).blur(function () {

                    if(''!=$(this).val()&&!reg.test($(this).val())){
                        $(this).val('');
                        return;
                    }
                    if (!''!=$('#'+end).val()&&parseInt($(this).val())>parseInt($('#'+end).val())){
                        $(this).val('');
                        return;
                    }
                });
            }
            if(''!=end&&null!=end) {
                $('#' + end).blur(function () {
                    var reg = /^[1-9]\d{0,9}$/
                    if ('' != $(this).val() && !reg.test($(this).val())) {
                        $(this).val('');
                        return;
                    }
                    if (!'' != $('#' + star).val() && parseInt($(this).val()) < parseInt($('#' + star).val())) {
                        $(this).val('');
                        return;
                    }
                });
            }
        },
        other : function () {

        }
    };
    addQueryVail();
})();