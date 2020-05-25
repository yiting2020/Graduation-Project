; (function () {
    var isBangding = null;//是否绑定微信号
    var is_Sign=false;
    //弹出确认窗
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
                    promptText: "没有项目",
                    columns: [
                        { column: "PROJECT_ID", text: ui.ColumnStyle.cnfn.columnCheckboxAll, len: 40, align: "center", handler: ui.ColumnStyle.cfn.createCheckbox },
                        { text: "序号", len: 40, align: "right", handler: ui.ColumnStyle.cfn.rowNumber },
                        { column: ["PROJECT_ID", "PRO_NAME"], text: "项目名称", len: 360, handler: projectManager.formatter.nameFormat },
                        { column: ["PROJECT_ID", "CREDIT_STATUS"], text: "信用信息", len: 100, align: "center",handler: projectManager.formatter.xinyong },
                        { column: "PRO_TYPE_NAME", text: "项目类型", len: 100, align: "center" },
                        { column: ["INTEGRITY"], text: "完整度", len: 100, align: "center",handler: masterpage.formatter.complete },
                        { column: ["STATUS", "STATUS_NAME"], text: "填报状态", len: 100, align: "center", handler: masterpage.formatter.projectState },
                        { column: "BUILD_PLACE_NAME", text: "建设地点", len: 160 },
                        { column: "ISPPP_NAME", text: "是否PPP项目", len: 100, align: "center"},
                        { column: "GB_INDUSTRY_NAME", text: "国标行业", len: 200 },
                        { column: "INVESTMENT_TOTAL", text: "总投资(万元)", len: 160, align: "right", sort: true },
                        { column: "CREATE_TIME", text: "创建时间", len: 160, align: "center", sort: true, handler: ui.ColumnStyle.cfn.formatDateTime },
                        { column: "NAME", text: "标签", len: 160, align: "center",handler: projectManager.prolabelName },
                        { handler: ui.ColumnStyle.cfn.empty }
                    ],
                    selection: {
                        type: "cell",
                        exclude: "input[type=checkbox]",
                        multiple: false
                    },
                    pager: {
                        pageIndex: 1,
                        pageSize: 100
                    }
                };
                this.projectView = $("#projectView").setGridview(gridOption);
                this.projectView.pageTurning(function(e, pageIndex, pageSize) {
                    projectManager.getDraftProjects(pageIndex);
                });
                this.projectView.selecting(function(e, elem, data){
                    if(data.cellIndex != 5 && data.cellIndex != 6  ) {
                        return false;
                    }
                });
                this.projectView.selected(function(e, elem, data){
                    //查看退回意见
                    if (data.cellIndex == 6 && data.rowData.STATUS == "BACKED") {
                        pageLogic.proName = data.rowData.PRO_NAME;
                        projectManager.getBackedProject(data.rowData.PROJECT_ID);
                    } else {
                        //取消选中
                        pageLogic.projectView.cancelSelection();
                    }
                    //查看不完整描述
                    if (data.cellIndex == 5 && data.rowData.INTEGRITY == "1") {
                        pageLogic.proName = data.rowData.PRO_NAME;
                        projectManager.getUncompleted(data.rowData.PROJECT_ID);
                    } else {
                        //取消选中
                        pageLogic.projectView.cancelSelection();
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
            },
            // add by fengdh 20190219 End
            //布局计算
            layout: function () {
                masterpage.resize(function () {
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

                //创建报送项目窗体
                this.submitProjectWindow = $("#submitProjectContent").putWindow({
                    show: "up",
                    hide: "down",
                    done: "up",
                    title: "报送项目",
                    width: 600,
                    height: 400,
                    isRespond: true,
                    resizeable: false,
                    draggable: true
                });
                this.submitProjectWindow.buttonAppend("submitProjectBtn").buttonAppend("cancelBtn");
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
                this.submitProjectWindow.opening(function(e) {
                    $(".submit-sj-row").hide();
                    $(".submit-ks-row").hide();
                    pageLogic.submitSJSelectTree.cancelSelection();
                    pageLogic.submitKSSelectTree.cancelSelection();
                    pageLogic.submitProjectValidate.clearErrorStyle();
                    pageLogic.submitDeptSelectTree.setCurrentSelection(window.customObj.submitDeptId);

                    //历史基金项目只能报送给央企200
                    // if(masterpage.userName == "importTemp") {
                    //     $("#submitDept").prop("disabled", "disabled");
                    // }
                });

                this.submitProjectWindow.closing(function(e) {
                    try {
                        showDetailWin.close();
                    } catch (e) {
                        console.info("关闭窗口错误")
                    }
                });

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
                //初始化【项目标签】下拉选择列表
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
                // // 信用信息多选
                this.xinyongStatusSelectList = $("#xinyongStatus").setSelectList({
                    multiple: true,
                    valueField: "itemKey",
                    textField: "itemValue",
                    width:119,
                    data: [{"itemKey":"0","itemValue":"查询中"},
                        {"itemKey":"1","itemValue":"有"},
                        {"itemKey":"2","itemValue":"无"},{"itemKey":"3","itemValue":"未查询"}]
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
                this.fillStatusSelectList = $("#fillStatus").setSelectList({
                    multiple: true,
                    valueField: "itemKey",
                    textField: "itemValue",
                    width:90,
                    data: [{"itemFullValue":"待上报","itemKey":"TO_REPORT","itemParent":"","itemValue":"待上报"},
                        {"itemFullValue":"被退回","itemKey":"BACKED","itemParent":"","itemValue":"被退回"}]
                });
                this.fillStatusSelectList.selected(function (e, elem, listData) {
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
                this.fillStatusSelectList.canceled(function (e) {
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
                });

                //初始化【上报单位】下拉选择列表
                this.submitDeptSelectTree = $("#submitDept").setSelectTree({
                    layoutPanel: "submitProjectContent",
                    multiple: false,
                    width: 260,
                    valueField: "departmentGuid",
                    textField: "departmentFullName",
                    parentField: "parentGuid",
                    canSelectNode: true,
                    defaultOpen: false,
                    lazy: true
                });
                this.submitDeptSelectTree.selecting(function (e, elem, treeData) {
                    if (treeData.isRoot) {
                        ui.msgshow("请选择具体部委或发改委或央企");
                        return false;
                    }
                });
                this.submitDeptSelectTree.selected(function (e, elem, treeData) {
                    this.element.val(treeData["data"]["departmentFullName"]);
                    projectManager.getSubSubmitDepts(treeData["data"]["departmentGuid"], false);
                });
                this.submitDeptSelectTree.canceled(function(e) {
                    this.element.val("");
                });

                //初始化【司局】下拉选择列表
                this.submitSJSelectTree = $("#submitSJ").setSelectTree({
                    layoutPanel: "submitProjectContent",
                    multiple: false,
                    width: 260,
                    valueField: "departmentGuid",
                    textField: "departmentFullName",
                    parentField: "parentGuid",
                    canSelectNode: true,
                    defaultOpen: false,
                    lazy: true
                });
                this.submitSJSelectTree.selecting(function (e, elem, treeData) {
                });
                this.submitSJSelectTree.selected(function (e, elem, treeData) {
                    this.element.val(treeData["data"]["departmentFullName"]);
                    projectManager.getSubSubmitDepts(treeData["data"]["departmentGuid"], true);
                });
                this.submitSJSelectTree.canceled(function(e) {
                    this.element.val("");
                });

                //初始化【科室】下拉选择列表
                this.submitKSSelectTree = $("#submitKS").setSelectTree({
                    layoutPanel: "submitProjectContent",
                    multiple: false,
                    width: 260,
                    valueField: "departmentGuid",
                    textField: "departmentFullName",
                    parentField: "parentGuid",
                    canSelectNode: true,
                    defaultOpen: false,
                    lazy: true
                });
                this.submitKSSelectTree.selecting(function (e, elem, treeData) {
                });
                this.submitKSSelectTree.selected(function (e, elem, treeData) {
                    this.element.val(treeData["data"]["departmentFullName"]);
                });
                this.submitKSSelectTree.canceled(function(e) {
                    this.element.val("");
                });

                //创建报送项目表单校验控件
                this.submitProjectValidate = $("#submitProjectForm").setValidate({
                    rules: {
                        submitDept: { required: true },
                        submitSJ: { required: true },
                        submitKS: { required: true }
                    }
                });
                //add by fengdh 2018/10/18 Start
                this.proLabelNameSelect = $("#proLabelName").setSelectList({
                    multiple: true,
                    width: 280,
                    valueField: "ID",
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
                //add by fengdh 2018/10/18 End

                //创建被退回意见窗体
                //创建报送项目窗体
                this.backDetailWindow = $("#backDeitalWindow").putWindow({
                    show: "up",
                    hide: "down",
                    done: "up",
                    title: "退回意见",
                    width: 600,
                    height: 400,
                    isRespond: true,
                    resizeable: false,
                    draggable: true
                });
                this.backDetailWindow.closing(function() {
                    pageLogic.projectView.cancelSelection();
                });
                this.uncompletedWindow = $("#uncompletedWindow").putWindow({
                    show: "up",
                    hide: "down",
                    done: "up",
                    title: "项目不完整度描述",
                    width: 600,
                    height: 400,
                    isRespond: true,
                    resizeable: false,
                    draggable: true
                });
                this.uncompletedWindow.closing(function() {
                    pageLogic.projectView.cancelSelection();
                });
                this.uncompletedWindow.buttonAppend("colsedBtn");
                //add by fengdh 2018/10/17 Start
                //添加标签窗口
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
                    projectManager.getDraftProjects();
                });
                this.addProLabelWindow.buttonAppend("addProLabelSaveBtn");
                this.addProLabelWindow.buttonAppend("closeBtn");

                //add by fengdh 2018/10/17 End
                //add by fengdh 20190217 start
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
                this.NoWxnameWindow=$("#NoWxname").putWindow({
                    show: "up",
                    hide: "down",
                    done: "up",
                    title: "生成项目信用信息",
                    width: 600,
                    height: 400,
                    isRespond: false,
                    resizeable: false,
                    draggable: false,
                });
                this.NoWxnameWindow.buttonAppend("colsedBtn2");
                // this.addProLabelForm = $("#addProLabelForm").setValidate({
                //     rules: {
                //         proLabelContent: { required: true, maxlength: 200, SqlKeyWord: true },
                //     }
                // });
            },
            //add by fengdh 20190217 end

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
                //查询项目
                $("#queryProjectBtn").click(function (e) {
                    //add by zhangyu 20170814  #39
                    if($("#q_startDate").val() != "" && $("#q_endDate").val() != "" && $("#q_startDate").val() > $("#q_endDate").val()) {
                        ui.messageShow('"创建日期"开始时间不能大于结束时间');
                    }else if(pageLogic.isPPP.getCurrentSelection()!=null&&pageLogic.isPPP.getCurrentSelection().value=="A00001"&&$("#approveStart").val() != "" && $("#approveEnd").val() != "" && $("#approveStart").val() > $("#approveEnd").val()){
                        ui.messageShow('"方案批准时间"开始时间不能大于结束时间');
                    } else {
                        projectManager.getDraftProjects();
                    }
                    //add end
                });

                //弹出报送项目窗口
                $("#openSubmitProjectWindowBtn").click(function () {
                    if (window.customObj.hasSubmit) {
                        if(is_Sign) {
                            projectManager.submitProjectHandler();
                            if(showDetailWinBoolean=='1'){
                                var projectIds = pageLogic.projectView.getSelectedValue();
                                showDetailWin = window.open(window.customObj.ctxp + "/projectOverView/getMasterDetailShow/"+projectIds,'确认报送项目','height=600,width=800');
                                setTimeout(showProjectDetailCtrlLoop,500);
                            }
                        } else {
                            masterpage.showSignWindow(projectManager.submitProjectHandler);
                        }
                    }
                });
                //手动添加标签 add by fengdh 2018-10-17  start
                $("#addProlabel").click(function () {
                    projectManager.projectProlabelSure();
                    $("#proLabelContent").val("");
                });
                $("#creatCredit").click(function () {
                    projectManager.creatCreditSure();
                });
                $("#addProLabelSaveBtn").click(function () {
                    projectManager.saveAddProlabel();
                });
                $("#closeBtn").click(function () {
                    pageLogic.addProLabelWindow.hide();
                });
                //手动添加标签 add by fengdh 2018-10-17  end
                //关闭窗口
                $("#cancelBtn").click(function(e) {
                    pageLogic.submitProjectWindow.hide();
                });
                //关闭窗口
                $("#colsedBtn").click(function(e) {
                    pageLogic.uncompletedWindow.hide();
                });
                $("#colsedBtn1").click(function(e) {
                    pageLogic.haveWxnameWindow.hide();
                });
                $("#contactsBtn").click(function(e) {
                    pageLogic.xinyongWindow.hide();
                });

                $("#submitProjectBtn").click(function() {
                    /* if (!projectManager.checkSubmit()) {
                         return;
                     }*/
                    if (!pageLogic.submitProjectValidate.form()) {
                        return;
                    }
                    // pageLogic.submitDeptSelectTree.selected(function (e, elem, treeData) {
                    //     if (treeData.isRoot) {
                    //         ui.msgshow("请选择具体部委或发改委或央企");
                    //         return false;
                    //     }
                    // });
                    var projectIds = pageLogic.projectView.getSelectedValue();
                    projectManager.submitProject(projectIds);
                });

                //移除项目
                $("#removeProjectBtn").click(function () {
                    projectManager.removeProject();
                });

                //跳转到项目录入页面
                $("#inputProjectBtn").click(function () {
                    window.location.href = window.customObj.ctxp + "/projectReserves/input/add";
                });

                //跳转到报表打印页面
                $("#printProjectBtn").click(function() {
                    // var status = $("#fillStatus").val();
                    // if(ui.str.isNullOrEmpty(status)) {
                    //     status = masterpage.projectToReportStatus + "," + masterpage.projectToBackedStatus;
                    // }
                    var i;
                    var industryKeys = [],
                        proLabelKeys = [],
                        buildPlaceKeys = [],
                        fillStatuskeys=[],
                        xinyongStatuskeys=[],
                        projectTypekeys=[],
                        proLabeNamelkeys = [];
                    var industryList = pageLogic.industrySelectTree.getMultipleSelection();
                    if(industryList.length > 1000) {
                        ui.warnShow("所属行业不能大于1000个");
                        return;
                    }
                    if(industryList && industryList.length > 0) {
                        for (i = 0; i < industryList.length; i++) {
                            industryKeys.push(industryList[i].itemKey);
                        }
                    }
                    var buildPlaceList = pageLogic.buildPlaceSelectTree.getMultipleSelection();
                    if(buildPlaceList.length > 1000) {
                        ui.warnShow("建设地点不能大于1000个");
                        return;
                    }
                    if(buildPlaceList && buildPlaceList.length > 0) {
                        for (i = 0; i < buildPlaceList.length; i++) {
                            buildPlaceKeys.push(buildPlaceList[i].itemKey);
                        }
                    }
                    //项目标签
                    var proLabelList=pageLogic.proLabelSelectTree.getMultipleSelection();
                    if(proLabelList && proLabelList.length > 0){
                        for (i =0;i< proLabelList.length;i++){
                            proLabelKeys.push(proLabelList[i].itemKey);
                        }
                    }
                    var proLabelNameList = pageLogic.proLabelNameSelect.getMultipleSelection();
                    if(proLabelNameList && proLabelNameList.length > 0){
                        for (i =0;i< proLabelNameList.length;i++){
                            proLabeNamelkeys.push(proLabelNameList[i].NAME);
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
                    // 填报状态多选
                    var fillStatusList = pageLogic.fillStatusSelectList.getMultipleSelection();
                    if(fillStatusList && fillStatusList.length > 0) {
                        for (i = 0; i < fillStatusList.length; i++) {
                            fillStatuskeys.push(fillStatusList[i]["itemKey"]);
                        }
                    }else {
                        fillStatuskeys = masterpage.projectToReportStatus + "," + masterpage.projectToBackedStatus;
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
                    var proName = $("#q_projectName").val();
                    var startTime = $("#q_startDate").val();
                    var endTime = $("#q_endDate").val();
                    var industry = industryKeys.join(",");
                    var proLable = proLabelKeys.join(",");
                    var buildPlace = buildPlaceKeys.join(",");
                    var proType = projectTypekeys.join(",");
                    var startMoney = $("#startMoney").val();
                    var endMoney = $("#endMoney").val();
                    var proLabelName = proLabeNamelkeys.join(",")
                    var xinyongStatus = xinyongStatuskeys.join(",");
                    var url = masterpage.ctxPath + "/projectReport/project-report?proName=" + window.encodeURIComponent(proName) + "&createTimeStart="
                        + startTime + "&createTimeEnd=" + endTime + "&status=" + fillStatuskeys + "&isPPP=" + isPPP
                        + "&proType=" + proType + "&industry=" + industry + "&buildPlace=" + buildPlace
                        + "&investmentTotalStart=" + startMoney + "&investmentTotalEnd=" + endMoney +"&proLabel=" + proLable+"&proLabelName=" + proLabelName
                        +"&xinyongStatus=" + xinyongStatus;
                    window.open(url);
                });

            },

            //数据初始化
            load: function() {
                // 取消创建时间的默认赋值
                // var nowDate = new Date();
                // var endDateStr = ui.str.dateFormat(nowDate, "yyyy-MM-dd");
                // var beginDate = new Date(nowDate.getFullYear() - 1, nowDate.getMonth() - 1, nowDate.getDate());
                // var beginDateStr = ui.str.dateFormat(beginDate, "yyyy-MM-dd");
                // $("#q_startDate").val(beginDateStr);
                // $("#q_endDate").val(endDateStr);

                //pageLogic.submitDeptSelectTree.setData(window.customObj.submitDeptList);
                pageLogic.loadDictionaries();
                pageLogic.loadApprovalDepts();
                projectManager.getDraftProjects();
                pageLogic.loadLabel();
                projectManager.isSign();
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
            pageLogic.isPPP.setCurrentSelection(
                { value: "A00003", text: "全部" });

        },
        loadApprovalDepts: function() {
            $("#openSubmitProjectWindowBtn").prop("disabled", true);
            ui.ajax.dataLoadAsync(customObj.submitDeptListUrl, {
                dataLength: customObj.submitDeptListCount
            }, function(data) {
                $("#openSubmitProjectWindowBtn").prop("disabled", false);
                pageLogic.submitDeptSelectTree.setData(data);
            }, function(e) {
                $("#openSubmitProjectWindowBtn").prop("disabled", false);
                ui.msgshow(e.message, true);
            });
        },
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
        }

    };

    var projectManager = {
        formatter: {
            //项目名称格式化
            nameFormat: function(content, columnObj) {
                if (!content.PROJECT_ID) {
                    return null;
                }
                var projectName = content.PRO_NAME ? content.PRO_NAME : "<项目名称暂未填写>";
                var html = [];
                html.push("<p>");
                html.push("<a target='_blank' style='margin-left:0px;margin-right:0px;' href='"
                    , masterpage.ctxPath
                    , "/projectReserves/input/"
                    , content.PROJECT_ID, "'>"
                    , ui.str.htmlEncode(projectName)
                    , "</a>");
                html.push("</p>");
                return html.join("");
            },

            complete: function(content, columnObj) {
                var completely = content.INTEGRITY ;
                if (completely == "0") {
                    return "完整"
                }else if (completely == "1") {
                    var html = [];
                    html.push("<p>");
                    html.push("<a target='_blank' href='javascript:projectManager.getUncompleted(\"" + content.PROJECT_ID + "\")"
                        , "'>"
                        , ui.str.htmlEncode("不完整")
                        , "</a>");
                    html.push("</p>");
                    // html.css("background-color", "#6E9ECF");
                    return html.join("");
                }else {
                    return ""
                }

            },
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
        },
        // add by fengdh 20190218 start
        //获取项目信用信息
        getxinyongData: function(projectid) {
            ui.ajax.ajaxPost(
                window.customObj.ctxp +"/projectReserves/getxinyongData",
                projectid,
                function(result) {
                    if(result.data) {
                        pageLogic.xinyongGridOption.createGridBody(result.data);
                    } else {
                        pageLogic.xinyongGridOption.empty();
                    }
                }, function(error) {
                    ui.msgshow(error.message, true);
                });
        },
        // add by fengdh 20190218 end

        // add by fengdh 20190510 start
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
        //查询项目
        getDraftProjects: function(pageIndex) {
            if (ui.core.type(pageIndex) != "number" || pageIndex < 1) {
                pageLogic.projectView.pageIndex = 1;
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
                proLabelkeys=[],
                proLabeNamelkeys=[],
                xinyongStatuskeys=[],
                fillStatuskeys=[],
                projectTypekeys=[],
                selectiveModeKeys = [];

            var industryList = pageLogic.industrySelectTree.getMultipleSelection();
            if(industryList.length > 1000) {
                ui.warnShow("所属行业不能大于1000个");
                return;
            }
            if(industryList && industryList.length > 0) {
                for (i = 0; i < industryList.length; i++) {
                    industryKeys.push(industryList[i].itemKey);
                }
            }
            //标签
            var proLabelNameList = pageLogic.proLabelNameSelect.getMultipleSelection();
            if(proLabelNameList && proLabelNameList.length > 0){
                for (i =0;i< proLabelNameList.length;i++){
                    proLabeNamelkeys.push(proLabelNameList[i].NAME);
                }
            }
            // 信用信息查询条件改多选
            var xinyongStatusList = pageLogic.xinyongStatusSelectList.getMultipleSelection();
            if(xinyongStatusList && xinyongStatusList.length > 0){
                for (i =0;i< xinyongStatusList.length;i++){
                    xinyongStatuskeys.push(xinyongStatusList[i].itemKey);
                }
            }

            //项目标签
            var proLabelList = pageLogic.proLabelSelectTree.getMultipleSelection();
            if(proLabelList && proLabelList.length > 0){
                for (i =0;i< proLabelList.length;i++){
                    proLabelkeys.push(proLabelList[i].itemKey);
                }
            }
            var buildPlaceList = pageLogic.buildPlaceSelectTree.getMultipleSelection();
            if(buildPlaceList.length > 1000) {
                ui.warnShow("建设地点不能大于1000个");
                return;
            }
            if(buildPlaceList && buildPlaceList.length > 0) {
                for (i = 0; i < buildPlaceList.length; i++) {
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
            // 填报状态多选
            var fillStatusList = pageLogic.fillStatusSelectList.getMultipleSelection();
            if(fillStatusList && fillStatusList.length > 0) {
                for (i = 0; i < fillStatusList.length; i++) {
                    fillStatuskeys.push(fillStatusList[i]["itemKey"]);
                }
            }
            // 项目类型多选
            var projectTypeList = pageLogic.projectTypeSelectList.getMultipleSelection();
            if(projectTypeList && projectTypeList.length > 0) {
                for (i = 0; i < projectTypeList.length; i++) {
                    projectTypekeys.push(projectTypeList[i]["itemKey"]);
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
                "pageIndex": pageLogic.projectView.pageIndex - 1,
                "pageSize": pageLogic.projectView.pageSize,
                "projectName": $("#q_projectName").val() || null,
                "projectStatus": fillStatuskeys.join(","),
                "xinyongStatus":xinyongStatuskeys.join(","),
                "startCreateTime": $("#q_startDate").val() || null,
                "endCreateTime": $("#q_endDate").val() || null,
                "industry": industryKeys.join(","),
                "buildPlace": buildPlaceKeys.join(","),
                "projectType": projectTypekeys.join(","),
                "startMoney": $("#startMoney").val() || null,
                "endMoney": $("#endMoney").val() || null,
                "isPPP": isPPP || "",
                "pppType": pppTypeKeys.join(","),
                "cancelReasonItem": cancelReasonItemKeys.join(","),
                "governmentParticipationMode": governmentParticipationModeKeys.join(","),
                "pppOperatorSchema": pppOperatorSchemaKeys.join(","),
                "projectImplementationOrganization": $("#projectImplementationOrganization").val() || null,
                "organizationNature": organizationNatureKeys.join(","),
                "programmePreparationOrganization": $("#programmePreparationOrganization").val() || null,
                "returnMethod": returnMethodKeys.join(","),
                "startYear": $("#startYear").val() || null,
                "endYear": $("#endYear").val() || null,
                "reviewUnit": $("#reviewUnit").val() || null,
                "reviewType": reviewTypeKeys.join(","),
                "approveStart": $("#approveStart").val() || null,
                "approveEnd": $("#approveEnd").val() || null,
                "planYear": $("#planYear").val() || null,
                "selectiveMode": selectiveModeKeys.join(","),
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
                "pppStageList": pppStageKeys.join(",")|| null,
                "proLabel" : proLabelkeys.join(",")|| null,
                "proLabelName":proLabeNamelkeys.join(",")|| null,
            };

            // if(param.isPPP) {
            //     param.isPPP = param.isPPP.value;
            // }


            ui.ajax.ajaxPostOnce(
                "queryProjectBtn",
                window.customObj.ctxp + "/projectReserves/getDraftProjects",
                param,
                function(jsonResult) {
                    if(jsonResult.result) {
                        pageLogic.projectView.createGridBody(jsonResult.data["items"], jsonResult.data["totalCount"]);
                    }
                },
                function(error) {
                    ui.msgshow(error.message, true);
                }
            );
        },

        //查询被退回项目原因
        getBackedProject: function(projectId, callback) {
            ui.ajax.ajaxPost(
                window.customObj.ctxp + "/projectReserves/getBackedProject/" + projectId,
                function(jsonResult) {
                    var message = "";
                    if(jsonResult.data) {
                        message = jsonResult.data["CHECK_DESC"];
                    }
                    if(!message) {
                        message = "无";
                    }
                    $("#backProjectName").text(pageLogic.proName);
                    $("#backReason").text(message);
                    pageLogic.backDetailWindow.show();
                },
                function(error) {
                    ui.msgshow(error.message, true);
                }
            )
        },
        getUncompleted: function(projectId, callback) {
            ui.ajax.ajaxPost(
                window.customObj.ctxp + "/projectReserves/getUncompleted/" + projectId,
                function(jsonResult) {
                    var message = "";
                    if(jsonResult.data) {
                        message = jsonResult.data["INTEGRITY_DETAIL"];
                    }
                    $("#uncompletly").text(message);
                    pageLogic.uncompletedWindow.show();
                },
                function(error) {
                    ui.msgshow(error.message, true);
                }
            )
        },



        //报送项目
        submitProject: function(projectIds) {
            var submitDept = pageLogic.submitDeptSelectTree.getCurrentSelection() ? pageLogic.submitDeptSelectTree.getCurrentSelection() : null;
            var submitSJ = pageLogic.submitSJSelectTree.getCurrentSelection() ? pageLogic.submitSJSelectTree.getCurrentSelection() : null;
            var submitKS = pageLogic.submitKSSelectTree.getCurrentSelection() ? pageLogic.submitKSSelectTree.getCurrentSelection() : null;
            var submitDeptId = null,
                submitDeptName = null,
                submitSJId = null,
                submitSJName = null,
                submitKSId = null,
                submitKSName = null,
                storeLevel = null;
            if (submitDept) {
                submitDeptId = submitDept["departmentGuid"];
                submitDeptName = submitDept["departmentFullName"];
                storeLevel = submitDept["storeLevel"];
            }
            if (submitSJ) {
                submitSJId = submitSJ["departmentGuid"];
                submitSJName = submitSJ["departmentFullName"];
            }
            if (submitKS) {
                submitKSId = submitKS["departmentGuid"];
                submitKSName = submitKS["departmentFullName"];
                storeLevel = submitKS["storeLevel"];
            }
            var param = {
                "submitDeptId": submitDeptId,
                "submitDeptName": submitDeptName,
                "submitSJId": submitSJId,
                "submitSJName": submitSJName,
                "submitKSId": submitKSId,
                "submitKSName": submitKSName,
                "lockLevel": storeLevel,
                "projectIds": projectIds
            };
            //add by fengdh 2018/9/27 start
            if(submitDept==null||submitDept==""){
                ui.msgshow("请选择具体部委或发改委或央企");
                return false;
            }
            //add by fengdh 2018/9/27 end
            ui.ajax.ajaxPostOnce(
                "submitProjectBtn",
                window.customObj.ctxp + "/projectReserves/submitProjects",
                param,
                function(jsonResult) {
                    if(jsonResult.result) {
                        ui.successShow("项目报送成功");
                        pageLogic.submitProjectWindow.hide();
                        projectManager.getDraftProjects();
                    }else{
                        if(null == jsonResult.data){
                            ui.msgshow(jsonResult.message);
                        }else{
                            ui.msgshow(jsonResult.data);
                        }

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

        //将项目移除到回收站
        removeProject: function() {
            var projectIds = pageLogic.projectView.getSelectedValue();
            if (projectIds.length == 0) {
                ui.msgshow("请先选择要移除的项目");
                return;
            }
            if (!confirm("确定要移除所选中的项目吗？")) {
                return;
            }
            ui.ajax.ajaxPost(
                window.customObj.ctxp + "/projectReserves/removeProjects",
                projectIds,
                function(jsonResult) {
                    if(jsonResult.result) {
                        projectManager.getDraftProjects();
                    }else{
                        projectManager.getDraftProjects();
                        ui.msgshow(jsonResult.message, true);
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
        //add by fengdh 2018/10/18 Start
        prolabelName:function (value) {
            var span = $("<span/>");
            if(value == ""){
                span.text("无");
            }else {
                span.text(value);
            }
            return span;
        },
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
                ui.msgshow("请至少选择一个项目进行添加标签！");
                return;
            }
            pageLogic.addProLabelWindow.show();
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
                "typename":'填报区',
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
        isSign:function () {
            ui.ajax.ajaxPost(
                window.customObj.ctxp +"/projectReserves/getIsSign",
                function (jsonResult) {
                    var data=jsonResult.data;
                    if(jsonResult.result){
                        if(data[0].IS_SIGN1==1){
                            is_Sign=true;
                        }
                    }else{
                        ui.errorShow("获取部门承诺书状态失败");
                    }
                },
                function (error) {
                    ui.errorShow("获取部门承诺书状态失败");
                },
                { textFormat: "正在保存..." }
            );
        },
        // add by fengdh 20190218 end
        saveAddProlabel:function () {
            // if (!pageLogic.addProLabelForm.form()) {
            //     return;
            // }
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
                ui.warnShow("标签内容不能包含  "+","+" 号，请重新输入！");
                return false;
            }
            if(proLabelContent.indexOf("\"\"")>0||proLabelContent.indexOf("\"\"")==0){
                ui.warnShow("标签内容不能包含  "+"\"\""+" 号，请重新输入！");
                return false;
            }
            if(proLabelContent.indexOf("\"")>0||proLabelContent.indexOf("\"")==0){
                ui.warnShow("标签内容不能包含  "+"\""+" 号，请重新输入！");
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
                ui.warnShow("标签内容不能为'无' 请重新输入！");
                return false;
            }
            if(proLabelContent.length > 200){
                ui.warnShow("标签内容长度不能大于200！");
                return false;
            }
            if(proLabelContent==null|| proLabelContent==""){
                ui.warnShow("标签内容不能为空！");
                return false;
            }
            var param ={
                "projectIds" :projectIds.join(","),
                "proLabelContent":proLabelContent
            }
            ui.ajax.ajaxPost(
                "../projectReserves/saveAddProlabel",
                param,
                function (jsonResult) {
                    if(jsonResult.result){
                        ui.successShow("添加标签成功");
                        pageLogic.addProLabelWindow.hide();
                        projectManager.getDraftProjects();
                        pageLogic.loadLabel();
                    }else{
                        ui.errorShow(jsonResult.message);
                    }
                },
                function (error) {
                    ui.errorShow("添加标签失败");
                },
                { textFormat: "正在保存..." }
            );
        },
        //add by fengdh 2018/10/18 End
        //获取审核单位的子部门
        getSubSubmitDepts: function(submitDeptId, getKS) {
            ui.ajax.ajaxPost(
                window.customObj.ctxp + "/projectReserves/getSubSubmitDepts",
                submitDeptId,
                function(jsonResult) {
                    if(jsonResult.result) {
                        pageLogic.submitProjectValidate.clearErrorStyle();
                        if (!getKS) {
                            $(".submit-sj-row").hide();
                            pageLogic.submitSJSelectTree.cancelSelection();
                        }
                        $(".submit-ks-row").hide();
                        pageLogic.submitKSSelectTree.cancelSelection();

                        var result = jsonResult.data;
                        if (result["hasSubDept"]) {
                            var submitSJ = result["submitSJ"];
                            var submitKS = result["submitKS"];
                            if (submitSJ) {
                                $(".submit-sj-row").show();
                                pageLogic.submitSJSelectTree.setData(submitSJ);
                                pageLogic.submitSJSelectTree.setCurrentSelection(submitSJ[0]["departmentGuid"]);
                            }
                            if (submitKS) {
                                $(".submit-ks-row").show();
                                pageLogic.submitKSSelectTree.setData(submitKS);
                                pageLogic.submitKSSelectTree.setCurrentSelection(submitKS[0]["departmentGuid"]);
                            }
                        }
                    } else {
                        ui.msgshow(jsonResult.message, true);
                    }
                },
                function(error) {
                    ui.msgshow(error.message, true);
                }
            );
        },

        /*        checkSubmit: function() {
                    var result = true;
                    var projectIds = pageLogic.projectView.getSelectedValue();
                    if (projectIds.length == 0) {
                        ui.msgshow("请先选择要报送的项目");
                        result = false;
                    }
                    var gridDataList = pageLogic.projectView.dataTable;
                    var completeFlag = true;
                    for (var m in gridDataList) {
                        for (var n in projectIds) {
                            if (gridDataList[m]["PROJECT_ID"] === projectIds[n]) {
                                if (gridDataList[m]["VALIDITY"] === 0) {
                                    completeFlag = false;
                                    break;
                                }
                            }
                        }
                    }
                    if (!completeFlag) {
                        ui.msgshow("报送项目中有信息未填写完整的项目，不可以报送");
                        result = false;
                    }
                    return result;
                },*/
        checkSubmit :function () {
            showDetailWinBoolean = '0';
            var result = true;
            var projectIds = pageLogic.projectView.getSelectedValue();
            var gridDataList = pageLogic.projectView.dataTable;
            var completeFlag = true;
            for (var m in gridDataList) {
                for (var n in projectIds) {
                    if (gridDataList[m]["PROJECT_ID"] === projectIds[n]["PROJECT_ID"]) {
                        // if (gridDataList[m]["VALIDITY"] === 0) {
                        if (gridDataList[m]["INTEGRITY"] === 1) {
                            completeFlag = false;
                            break;
                        }
                    }
                }
            }
            if (!completeFlag) {
                ui.msgshow("报送项目中有信息未填写完整的项目，不可以报送");
                return;
            }
            if (projectIds.length == 0) {
                ui.msgshow("请先选择要报送的项目");
                return;
            }
            if (projectIds.length != 1) {
                ui.msgshow("禁止一次报送多个项目，请选择一个项目报送");
                return;
            }
            showDetailWinBoolean = '1';
            ui.ajax.ajaxPost(
                window.customObj.ctxp + "/projectReserves/getUncompletePro",
                projectIds,
                function(jsonResult) {
                    if(jsonResult.result == true) {
                        ui.msgshow(jsonResult.message + "等"+jsonResult.data+"个项目信息不完整，请将信息补充完整。");
                        showDetailWin.window.close();
                        pageLogic.submitProjectWindow.hide();
                        return result = false;
                    } else {
                        showDetailWinBoolean = '1';
                        // pageLogic.submitProjectWindow.show();
                        // showDetailWin = window.open(window.customObj.ctxp + "/projectOverView/getMasterDetailShow/"+projectIds,'确认报送项目','height=600,width=800,top=0,left=0,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no');
                        // $("#openDetailShowWin").attr("onclick","showDetailWin=window.open('"+window.customObj.ctxp + "/projectOverView/getMasterDetailShow/"+projectIds+"'"+",'确认报送项目','height=600,width=800,top=0,left=0,toolbar=no,status=no')")
                        // $("#openDetailShowWin").addEventListener("click",openDetailWin(projectIds))
                        // $("#openDetailShowWin").click();
                        // openDetailWin(projectIds);
                    }
                },
                function(error) {
                    ui.msgshow(error.message, true);
                }
            );

        },
        submitProjectHandler: function() {
            if (!projectManager.checkSubmit()) {
                return;
            }
            pageLogic.submitProjectWindow.show();
        }
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

    function showProjectDetailCtrlLoop(){
        try {
            var cancel = showDetailWin.window.cancelBtnForReserves;
            var conform = showDetailWin.window.conformBtnForReserves;

            if ("1" == cancel) {
                showDetailWin.window.close();
                return;
            }
            if ("1" == conform) {
                showDetailWin.window.close();
                pageLogic.submitProjectWindow.show();
                return;
            }
            setTimeout(showProjectDetailCtrlLoop, 500);
        } catch (e) {
            // ui.msgshow("展示项目报送信息失败")
            console.info("展示项目报送信息失败");
            showDetailWin.window.close();
            pageLogic.submitProjectWindow.show();
        }
    }

})();