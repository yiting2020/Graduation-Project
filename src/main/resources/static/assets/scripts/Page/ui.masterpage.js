;(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        // For CommonJS and CommonJS-like environments where a proper `window`
        // is present, execute the factory and get avalon.
        // For environments that do not have a `window` with a `document`
        // (such as Node.js), expose a factory as module.exports.
        // This accentuates the need for the creation of a real `window`.
        // e.g. var ui = require("ui")(window);
        module.exports = global.document ? factory(global, true) : function(w) {
            if (!w.document) {
                throw new Error("ui.core.js requires a window with a document")
            }
            return factory(w);
        };
    } else {
        factory(global);
    }
}(typeof window !== "undefined" ? window : this, function(window, noGlobal) {
    //支持HTML5标签
    if(ui.core.ieVersion > 0 && ui.core.ieVersion < 9) {
        document.createElement("section");
        document.createElement("header");
        document.createElement("footer");
        document.createElement("address");
        document.createElement("article");
        document.createElement("aside");
        document.createElement("nav");
        document.createElement("menu");
    }

    //边栏管理器
    var SidebarManager = function () {
        if(this instanceof SidebarManager) {
            this.initial();
        } else {
            return new SidebarManager();
        }
    };
    SidebarManager.prototype = {
        constructor: SidebarManager,
        _checkName: function(name) {
            return ui.core.type(name) !== "string" || name.length == 0;
        },
        initial: function() {
            this.sidebars = new ui.keyArray();
            return this;
        },
        setElement: function(name, option, element) {
            if(this._checkName(name)) {
                return;
            }
            var sidebar = null,
                that = this;
            if(this.sidebars.contains(name)) {
                sidebar = this.sidebars.get(name);
                if(element) {
                    sidebar.set(element);
                }
            } else {
                if(!option || !option.parent) {
                    throw ui.error("option is null");
                }
                sidebar = ui.ctrls.Sidebar(option, element);
                sidebar.hiding(function(e) {
                    that.currentBar = null;
                });
                this.sidebars.set(name, sidebar);
            }
            return sidebar;
        },
        get: function(name) {
            if(this._checkName(name)) {
                return null;
            }
            if(this.sidebars.contains(name)) {
                return this.sidebars.get(name);
            }
            return null;
        },
        remove: function(name) {
            if(this._checkName(name)) {
                return;
            }
            if(this.sidebars.contains(name)) {
                this.sidebars.remove(name);
            }
        },
        isShow: function() {
            return this.currentBar && this.currentBar.isShow();
        },
        show: function(name) {
            if(this._checkName(name)) {
                return;
            }
            var sidebar = null,
                that = this;
            if(this.sidebars.contains(name)) {
                sidebar = this.sidebars.get(name);
                if(sidebar.isShow()) {
                    return null;
                }
                if(this.currentBar) {
                    return this.currentBar.hide().done(function() {
                        that.currentBar = sidebar;
                        sidebar.show();
                    });
                } else {
                    this.currentBar = sidebar;
                    return sidebar.show();
                }
            }
            return null;
        },
        hide: function() {
            var sidebar = this.currentBar;
            if(this._checkName(name)) {
                sidebar = this.currentBar;
            } else if(this.sidebars.contains(name)) {
                sidebar = this.sidebars.get(name);
            }
            if(!sidebar.isShow()) {
                return null;
            }
            if(sidebar) {
                this.currentBar = null;
                return sidebar.hide();
            }
            return null;
        }
    };

    // toolbar
    var Toolbar = function(option) {
        if(this instanceof Toolbar) {
            this.initial(option);
        } else {
            return new Toolbar(option);
        }
    };
    Toolbar.prototype = {
        constructor: Toolbar,
        initial: function(option) {
            this.toolbarPanel = ui.getJQueryElement(option.toolbarId);
            if(!this.toolbarPanel) {
                return;
            }
            this.height = this.toolbarPanel.height();
            this.tools = this.toolbarPanel.children(".tools");
            this.extendPanel = this.toolbarPanel.children(".toolbar-extend");
            if(this.extendPanel.length > 0) {
                this.defaultExtendShow = !!option.defaultExtendShow;
                this._initExtendPanel();
            }
            var i = 0,
                len = this.tools.length,
                buttons;
            for(; i < len; i++) {
                buttons = $(this.tools[i]).children(".action-buttons");
                if(buttons.length > 0) {
                    buttons.children(".tool-action-button").addClass("font-highlight-hover")
                }
            }
        },
        _initExtendPanel: function() {
            this.extendHeight = parseFloat(this.extendPanel.css("height"));
            this._wrapExtendPanel();
            this._createExtendAnimator();
            this._initExtendButton();
            this._initPinButton();
            if(this.defaultExtendShow) {
                this.showExtend(false);
                this.pinExtend();
            }
        },
        _wrapExtendPanel: function() {
            var position = this.toolbarPanel.css("position");
            if (position !== "absolute" && position !== "relative" && position !== "fixed") {
                this.toolbarPanel.css("position", "relative");
            }
            this.extendWrapPanel = $("<div style='position:absolute;height:0px;width:100%;display:none;overflow:hidden;'/>");
            this.extendWrapPanel.css("top", this.height + "px");
            this.extendPanel.css("top", (-this.extendHeight) + "px");
            this.extendPanel.addClass("clear");
            this.extendWrapPanel.append(this.extendPanel);
            this.toolbarPanel.append(this.extendWrapPanel);
        },
        _createExtendAnimator: function() {
            this.extendAnimator = ui.animator({
                target: this.extendPanel,
                ease: ui.AnimationStyle.easeFromTo,
                onChange: function(val) {
                    this.target.css("top", val + "px");
                }
            }).addTarget({
                target: this.extendWrapPanel,
                ease: ui.AnimationStyle.easeFromTo,
                onChange: function(val) {
                    this.target.css("height", val + "px");
                }
            });
            this.extendAnimator.duration = 300;
        },
        _initExtendButton: function() {
            this.extendButton = this.toolbarPanel.find(".tool-extend-button");
            var moreTool,
                moreActions;
            if(this.extendButton.length == 0) {
                moreTool = $("<ul class='tools' style='float:right;margin-left:0px;'></ul>");
                moreActions = $("<li class='action-buttons'></li>");
                moreTool.append(moreActions);
                if(this.tools.length == 0) {
                    this.extendPanel.parent().before(moreTool);
                } else {
                    $(this.tools[0]).before(moreTool);
                }
                this.tools = this.toolbarPanel.children(".tools");
                this.extendButton = $("<a class='tool-action-button tool-extend-button' href='javascript:void(0)' title='更多'><i class='fa fa-ellipsis-h'></i></a>");
                moreActions.append(this.extendButton);
            }

            var that = this;
            this.extendButton.click(function(e) {
                if(that.isExtendShow()) {
                    that.hideExtend();
                } else {
                    that.showExtend();
                }
            });
        },
        _initPinButton: function() {
            this.pinButton = $("<a class='tool-extend-pin-button font-highlight-hover' href='javascript:void(0)' title='固定扩展区域'><i class='fa fa-thumb-tack'></i></a>");
            this.extendWrapPanel.append(this.pinButton);
            var that = this;
            this.pinButton.click(function(e) {
                if(that.isExtendPin()) {
                    that.unpinExtend();
                } else {
                    that.pinExtend();
                }
            });
        },
        isExtendShow: function() {
            return this.extendButton.hasClass("extend-show");
        },
        showExtend: function(animation) {
            var option;
            if(this.extendAnimator.isStarted) {
                return;
            }
            this.extendButton
                .addClass("extend-show")
                .removeClass("font-highlight-hover")
                .addClass("background-highlight");
            this._cssOverflow = this.toolbarPanel.css("overflow");
            this.toolbarPanel.css("overflow", "visible");

            if(animation === false) {
                this.extendWrapPanel.css({
                    "height": this.extendHeight + "px",
                    "display": "block"
                });
                this.extendPanel.css("top", "0px");
            } else {
                option = this.extendAnimator[0];
                option.begin = -this.extendHeight;
                option.end = 0;

                option = this.extendAnimator[1];
                option.begin = 0;
                option.end = this.extendHeight;

                option.target.css({
                    "height": "0px",
                    "display": "block"
                });
                this.extendAnimator.start();
            }
        },
        hideExtend: function(animation) {
            var option, that;
            if(this.extendAnimator.isStarted) {
                return;
            }
            this.extendButton
                .removeClass("extend-show")
                .addClass("font-highlight-hover")
                .removeClass("background-highlight");

            if(animation === false) {
                this.extendWrapPanel.css({
                    "height": "0px",
                    "display": "none"
                });
                this.extendPanel.css("top", -this.extendHeight + "px");
                this.toolbarPanel.css("overflow", this._cssOverflow);
            } else {
                that = this;

                option = this.extendAnimator[0];
                option.begin = 0;
                option.end = -this.extendHeight;

                option = this.extendAnimator[1];
                option.begin = this.extendHeight;
                option.end = 0;

                this.extendAnimator.start().done(function() {
                    that.toolbarPanel.css("overflow", that._cssOverflow);
                    option.target.css("display", "none");
                });
            }
        },
        _fireResize: function() {
            ui.fire("resize");
        },
        isExtendPin: function() {
            return this.pinButton.hasClass("extend-pin");
        },
        pinExtend: function() {
            this.pinButton.addClass("extend-pin");
            this.pinButton.children("i")
                .removeClass("fa-thumb-tack")
                .addClass("fa-angle-up");
            this.extendButton.css("display", "none");

            this.height = this.height + this.extendHeight;
            this.toolbarPanel.css("height", this.height + "px");
            this._fireResize();
        },
        unpinExtend: function() {
            this.pinButton.removeClass("extend-pin");
            this.pinButton.children("i")
                .removeClass("fa-angle-up")
                .addClass("fa-thumb-tack");
            this.extendButton.css("display", "inline-block");

            this.height = this.height - this.extendHeight;
            this.toolbarPanel.css("height", this.height + "px");
            this._fireResize();
            this.hideExtend();
        }
    };

    var Toolbar1 = function(option) {
        if(this instanceof Toolbar1) {
            this.initial(option);
        } else {
            return new Toolbar1(option);
        }
    };
    Toolbar1.prototype = {
        constructor: Toolbar,
        initial: function(option) {
            this.toolbarPanel = ui.getJQueryElement(option.toolbarId);
            if(!this.toolbarPanel) {
                return;
            }
            this.height = this.toolbarPanel.height();
            this.tools = this.toolbarPanel.children(".tools");
            this.extendPanel = this.toolbarPanel.children(".toolbar-extend");
            if(this.extendPanel.length > 0) {
                this.defaultExtendShow = !!option.defaultExtendShow;
                this._initExtendPanel();
            }
            var i = 0,
                len = this.tools.length,
                buttons;
            for(; i < len; i++) {
                buttons = $(this.tools[i]).children(".action-buttons");
                if(buttons.length > 0) {
                    buttons.children(".tool-action-button").addClass("font-highlight-hover");
                    buttons.children(".tool-action-button").text("更多");
                    $(this.tools[i]).css({
                        "position": "absolute",
                        "left": "50%",
                        "bottom": "0px",
                        "width": "60px",
                        "height": "20px",
                        "text-align": "center"
                    });
                }
            }
        },
        _initExtendPanel: function() {
            this.extendHeight = parseFloat(this.extendPanel.css("height"));
            this._wrapExtendPanel();
            this._createExtendAnimator();
            this._initExtendButton();
            this._initPinButton();
            if(this.defaultExtendShow) {
                this.showExtend(false);
                this.pinExtend();
            }
        },
        _wrapExtendPanel: function() {
            var position = this.toolbarPanel.css("position");
            if (position !== "absolute" && position !== "relative" && position !== "fixed") {
                this.toolbarPanel.css("position", "relative");
            }
            this.extendWrapPanel = $("<div style='position:absolute;height:0px;width:100%;display:none;overflow:hidden;'/>");
            this.extendWrapPanel.css("top", this.height + "px");
            this.extendPanel.css("top", (-this.extendHeight) + "px");
            this.extendPanel.addClass("clear");
            this.extendWrapPanel.append(this.extendPanel);
            this.toolbarPanel.append(this.extendWrapPanel);
        },
        _createExtendAnimator: function() {
            this.extendAnimator = ui.animator({
                target: this.extendPanel,
                ease: ui.AnimationStyle.easeFromTo,
                onChange: function(val) {
                    this.target.css("top", val + "px");
                }
            }).addTarget({
                target: this.extendWrapPanel,
                ease: ui.AnimationStyle.easeFromTo,
                onChange: function(val) {
                    this.target.css("height", val + "px");
                }
            });
            this.extendAnimator.duration = 300;
        },
        _initExtendButton: function() {
            this.extendButton = this.toolbarPanel.find(".tool-extend-button");
            var moreTool,
                moreActions;
            if(this.extendButton.length == 0) {
                moreTool = $("<ul class='tools' style='float:right;margin-left:0px;'></ul>");
                moreActions = $("<li class='action-buttons'></li>");
                moreTool.append(moreActions);
                if(this.tools.length == 0) {
                    this.extendPanel.parent().before(moreTool);
                } else {
                    $(this.tools[0]).before(moreTool);
                }
                this.tools = this.toolbarPanel.children(".tools");
                this.extendButton = $("<a class='tool-action-button tool-extend-button' href='javascript:void(0)' title='更多'><i class='fa fa-ellipsis-h'></i></a>");
                moreActions.append(this.extendButton);
            }

            var that = this;
            this.extendButton.click(function(e) {
                if(that.isExtendShow()) {
                    that.hideExtend();
                } else {
                    that.showExtend();
                    that.pinExtend();
                }
            });
        },
        _initPinButton: function() {
            this.pinButton = $("<a class='tool-extend-pin-button font-highlight-hover' href='javascript:void(0)' title='固定扩展区域'><i class='fa fa-thumb-tack'></i></a>");
            this.extendWrapPanel.append(this.pinButton);
            var that = this;
            this.pinButton.click(function(e) {
                if(that.isExtendPin()) {
                    that.unpinExtend();
                } else {
                    that.pinExtend();
                }
            });
        },
        isExtendShow: function() {
            return this.extendButton.hasClass("extend-show");
        },
        showExtend: function(animation) {
            var option;
            if(this.extendAnimator.isStarted) {
                return;
            }
            this.extendButton
                .addClass("extend-show")
                .removeClass("font-highlight-hover")
                .addClass("background-highlight");
            this._cssOverflow = this.toolbarPanel.css("overflow");
            this.toolbarPanel.css("overflow", "visible");

            if(animation === false) {
                this.extendWrapPanel.css({
                    "height": this.extendHeight + "px",
                    "display": "block"
                });
                this.extendPanel.css("top", "0px");
            } else {
                option = this.extendAnimator[0];
                option.begin = -this.extendHeight;
                option.end = 0;

                option = this.extendAnimator[1];
                option.begin = 0;
                option.end = this.extendHeight;

                option.target.css({
                    "height": "0px",
                    "display": "block"
                });
                this.extendAnimator.start();
            }
        },
        hideExtend: function(animation) {
            var option, that;
            if(this.extendAnimator.isStarted) {
                return;
            }
            this.extendButton
                .removeClass("extend-show")
                .addClass("font-highlight-hover")
                .removeClass("background-highlight");

            if(animation === false) {
                this.extendWrapPanel.css({
                    "height": "0px",
                    "display": "none"
                });
                this.extendPanel.css("top", -this.extendHeight + "px");
                this.toolbarPanel.css("overflow", this._cssOverflow);
            } else {
                that = this;

                option = this.extendAnimator[0];
                option.begin = 0;
                option.end = -this.extendHeight;

                option = this.extendAnimator[1];
                option.begin = this.extendHeight;
                option.end = 0;

                this.extendAnimator.start().done(function() {
                    that.toolbarPanel.css("overflow", that._cssOverflow);
                    option.target.css("display", "none");
                });
            }
        },
        _fireResize: function() {
            ui.fire("resize");
        },
        isExtendPin: function() {
            return this.pinButton.hasClass("extend-pin");
        },
        pinExtend: function() {
            this.pinButton.addClass("extend-pin");
            this.pinButton.children("i")
                .removeClass("fa-thumb-tack")
                .addClass("fa-angle-up");
            this.extendButton.css("display", "none");

            this.height = this.height + this.extendHeight;
            this.toolbarPanel.css("height", this.height + "px");
            this._fireResize();
        },
        unpinExtend: function() {
            this.pinButton.removeClass("extend-pin");
            this.pinButton.children("i")
                .removeClass("fa-angle-up")
                .addClass("fa-thumb-tack");
            this.extendButton.css("display", "inline-block");

            this.height = this.height - this.extendHeight;
            this.toolbarPanel.css("height", this.height + "px");
            this._fireResize();
            this.hideExtend();
        }
    };

    var masterpage = window.masterpage = {
        Name: "姓名",
        Department: "部门",
        Position: "职位",
        projectToReportStatus: "TO_REPORT",
        projectReportedStatus: "REPORTED",
        projectToBackedStatus: "BACKED",

        deptSignStatus: null,
        version:null,

        //当前是否为起始页
        isHomePage: false,
        //当前页面是否加载了导航菜单
        noMenu: true,
        //内容区域宽度
        contentBodyWidth: 0,
        //内容区域高度
        contentBodyHeight: 0,

        init: function() {
            //return;
            this.toolbar = {
                height: 40,
                extendHeight: 0
            };
            var that = this;
            ui.docReady(function (e) {
                that._initElements();
                that._initContentSize();
                that._initHeaderCtrls();
                that._initUserSettings();
                ui.resize(function (e, clientWidth, clientHeight) {
                    that._initContentSize();
                }, ui.eventPriority.bodyResize);
                if(window.pageLogic) {
                    that.pageInit(pageLogic.init, pageLogic);
                }
                that._initSign();
            }, ui.eventPriority.masterReady);
        },
        _initElements: function () {
            this.sidebarManager = this.createSidebarManager();

            var headImage = $("#headBackground");
            if(headImage.length > 0) {
                return;
                this.headImageAnimator = ui.animator({
                    target: headImage,
                    ease: ui.AnimationStyle.linear,
                    begin: 0,
                    end: 92,
                    onChange: function(val) {
                        this.target.scrollTop(val);
                    }
                });
                this.headImageAnimator.onEnd = function() {
                    var temp = null,
                        option;
                    var i = 0,
                        len = this.length;
                    for(; i < len; i++) {
                        option = this[i];
                        temp = option.begin;
                        option.begin = option.end;
                        option.end = temp;
                    }
                    this.start();
                };
                this.headImageAnimator.duration = 12000;

                var that = this;
                setTimeout(function() {
                    that.headImageAnimator.start();
                });
            }
        },
        _initContentSize: function () {
            var clientWidth = ui.core.root.clientWidth;
            var clientHeight = ui.core.root.clientHeight;
            this.head = $("#head");
            this.body = $("#body");
            if(this.head.length > 0) {
                clientHeight -= this.head.height();
            }
            var bodyMinHeight = clientHeight;
            this.body.css("height", bodyMinHeight + "px");
            this.contentBodyHeight = bodyMinHeight;
            this.contentBodyWidth = clientWidth;
        },
        _initHeaderCtrls: function() {
            var key;
            if(this.headerCtrls) {
                for(key in this.headerCtrls) {
                    this.headerCtrls[key].call(this);
                }
            }
        },
        _initUserSettings: function() {
            var userCover = $("#user"),
                that = this;

            var element = $("<section class='user-settings' />"),
                userInfo = $("<div class='user-info' />"),
                lightColor = $("<div class='light-color' />"),
                cmdList = $("<div class='cmd-list' />"),
                userSidebar,
                _oldShow;

            var htmlBuilder = [];
            htmlBuilder.push(
                "<div class='cover border-highlight'>",
                "<imgs src='", userCover.children("img").prop("src"), "' alt='用户头像' /></div>",
                "<div class='info'>",
                "<span class='font-highlight' style='font-size:18px;line-height:36px;'>", this.Name, "</span><br />",
                "<span>", this.Department, "</span><br />",
                "<span>", this.Position, "</span>",
                "</div>",
                "<div style='clear:left'></div>"
            );
            userInfo.append(htmlBuilder.join(""));

            if($.isArray(ui.theme.Colors)) {
                htmlBuilder = [];
                htmlBuilder.push("<h3 class='group-title font-highlight'>个性色</h3>");
                var i = 0,
                    len = ui.theme.Colors.length,
                    color;
                htmlBuilder.push("<div style='width:100%;height:auto'>");
                for(; i < len; i++) {
                    color = ui.theme.Colors[i];
                    htmlBuilder.push("<a href='javascript:void(0)' style='background-color:", color.Color, ";");
                    htmlBuilder.push("' title='", color.Name, "' data-index='", i, "'></a>");
                }
                htmlBuilder.push("</div>");
                lightColor.append(htmlBuilder.join(""));
                lightColor.click(function(e) {
                    var elem = $(e.target),
                        color;
                    if (elem.nodeName() === "A") {
                        color = ui.theme.Colors[parseInt(elem.attr("data-index"), 10)];
                        /*
                        ui.ajax.ajaxPost(
                            "/Home/ChangeTheme",
                            { themeId: color.Id },
                            function(success) {
                                if(success.Result) {
                                    $("#theme").prop("href", "/Home/Theme?themeId=" + color.Id);
                                    ui.theme.setThemeId(color.Id);
                                    ui.fire("themeChanged", color);
                                }
                            },
                            function(error) {
                                ui.msgshow("修改主题失败，" + error.Message, true);
                            }
                        );
                        */
                        $("#theme").prop("href", ui.str.stringFormat("../Content/themes/metro.color/ui.metro.{0}.css", color.Id));
                        ui.theme.setThemeId(color.Id);
                        ui.fire("themeChanged", color);
                    }
                });
            }

            //添加一些主题API
            (function(){
                ui.theme.setThemeId = function (themeId) {
                    this.themeInfo = this.getTheme(themeId);
                    this.themeId = this.themeInfo.Id;
                };
                ui.theme.getCurrentThemeInfo = function () {
                    if (this.themeInfo) {
                        return ui.obj.clone(this.themeInfo);
                    } else {
                        return ui.obj.clone(this.getTheme());
                    }
                };
                ui.theme.getCurrentColor = function () {
                    if (this.themeInfo) {
                        return this.themeInfo.Color;
                    } else {
                        return this.getTheme().Color;
                    }
                };
                ui.theme.changeCssColor = function (id, cssObj) {
                    var themeLink = $("#" + id);
                    if (themeLink.length == 0)
                        return;
                    var sheet = themeLink.sheet();
                    var rules = sheet.cssRules();

                    var selector;
                    var item;
                    for (var i = 0; i < rules.length; i++) {
                        item = $(rules[i]);
                        selector = item.prop("selectorText");
                        if (cssObj.hasOwnProperty(selector)) {
                            item.css(cssObj[selector]);
                            cssObj[selector] = null;
                        }
                    }
                };
            })();
            htmlBuilder = [];
            htmlBuilder.push(
                "<ul>",
                "<li>",
                "<span>用户信息</span>",
                "<a href='", masterpage.ctxPath, "/account/userSetting' target='_blank'></a>",
                "</li>",
                "<li>",
                "<span>修改密码</span>",
                "<a href='", masterpage.ctxPath, "/account/modifyPassword' target='_blank'></a>",
                "</li>",
                "<li>",
                "<span>项目联系人</span>",
                "<a href='", masterpage.ctxPath, "/contact/list' target='_blank'></a>",
                "</li>",
                "<li>",
                "<span>退出</span>",
                "<a href='javascript:void(0);' onclick='logout();'></a>",
                "</li>",
                "</ul>"
            );
            cmdList.append(htmlBuilder.join(""));
            logout = function () {
                // if (confirm("确认要退出吗？")) {
                //     location.href = masterpage.ctxPath + "/logout";
                // }
                location.href = masterpage.ctxPath + "/logout";
            };

            element
                .append(userInfo)
                .append("<hr />")
                .append(cmdList);

            userSidebar = this.sidebarManager.setElement("userSidebar", {
                parent: "body",
                width: 240
            }, element);
            userSidebar.animator[0].ease = ui.AnimationStyle.easeFromTo;
            userSidebar.contentAnimator = ui.animator({
                target: element,
                begin: 100,
                end: 0,
                ease: ui.AnimationStyle.easeTo,
                onChange: function(val, elem) {
                    elem.css("left", val + "%");
                }
            });
            userSidebar.contentAnimator.duration = 200;
            userSidebar.showing(function() {
                element.css("display", "none");
            });
            userSidebar.showed(function() {
                element.css({
                    "display": "block",
                    "left": "100%"
                });
                this.contentAnimator.start();
            });
            if(userCover.length > 0) {
                userCover.click(function(e) {
                    that.sidebarManager.show("userSidebar");
                });
            }

            //初始化当前用户的主题ID
            ui.theme.Colors = [{"Name":"发改委蓝","Id":"Default","Color":"#2F6699"},];
            var tid = ui.theme.getCurrentThemeId();
            if (!tid) {
                throw ui.error("没有导入css主题文件");
            }
            ui.theme.setThemeId(tid);
            ui.fire("themeChanged", ui.theme.getCurrentThemeInfo());
        },
        _initSign: function() {
            this.signWindow =
                $("#signWindow").css("display", "block").putWindow({
                    show: "up",
                    hide: "down",
                    done: "up",
                    title: "承诺书",
                    width: 600,
                    height: 450,
                    isRespond: false,
                    resizeable: false,
                    draggable: true
                });
            this.signWindow.opening(function (e, elem, data) {
                ui.ajax.ajaxPost(
                    masterpage.ctxPath + "/account/getDeptSign",
                    function(result) {
                        if(result.data) {
                            result = result.data;
                            masterpage.deptSignStatus = result.IS_SIGN;
                            if(result.IS_SIGN == "1") {
                                masterpage.signWindow.signDeptName = result.SIGN_DEPARTMENT_NAME;
                                masterpage.signWindow.signTime = result.SIGN_TIME;
                                masterpage.resetSignInfo();
                            }
                            if(result.IS_SIGN == "0") {
                                $("#signBtn").show();
                                $("#unsignBtn").show();
                            }
                        }
                    }, function (error) {
                        ui.msgshow(error.message, true);
                    });
            });
            this.signWindow
                .buttonAppend("signBtn")
                .buttonAppend("unsignBtn");
            if(this.deptSignStatus == null) {
                this.deptSignStatus = $("#deptIsSign").val();
            }
            this.version =$("#version").val();
            if(this.deptSignStatus == "0") {
                this.signWindow.signDeptName = "";
                this.signWindow.signTime = "";
            }
        },
        pageInit: function (initObj, caller) {
            var func = null,
                caller = caller || this;
            var container = $("#body");
            if (ui.core.isPlainObject(initObj)) {
                container.css("visibility", "hidden");
                setTimeout(function() {
                    for (var key in initObj) {
                        func = initObj[key];
                        if ($.isFunction(func)) {
                            try {
                                func.call(caller);
                            } catch (e) {
                                ui.errorShow("页面初始化[" + key + "]发生错误：" + e.message);
                            }
                        }
                    }
                    container.css("visibility", "visible");
                });
            }
        },
        //显示承诺书窗口
        showSignWindow: function(callback) {
            if(callback) {
                masterpage.signWindow.callback = callback;
            }
            masterpage.signWindow.show();
        },
        resetSignInfo: function() {
            $("#signBtn").hide();
            $("#unsignBtn").hide();
            $("#signInfo").show();
            $("#signDeptName").text(masterpage.signWindow.signDeptName);
            var signTime = masterpage.signWindow.signTime;
            if(!ui.str.isNullOrEmpty(signTime)) {
                signTime = ui.str.jsonToDate(signTime);
                signTime = ui.str.dateFormat(signTime, "yyyy-MM-dd");
            }
            $("#signTime").text(signTime);
        },
        //同意承诺书
        saveSignStatus: function(status) {
            var currentBtn = "signBtn";
            if(!status) {
                currentBtn = "unsignBtn";
                status = "0";
            } else {
                status = "1";
            }
            var param = {
                "status": status,
                "version": $("#version").val(),
            };
            if(status == "1"){
                if (!confirm("你确定同意承诺书吗？")) {
                    masterpage.signWindow.hide();
                    return;
                }else{
                    ui.ajax.ajaxPostOnce(
                        currentBtn,
                        masterpage.ctxPath + "/account/saveSign",
                        param,
                        function(Josnresult) {
                            if(Josnresult.result){
                                masterpage.signWindow.hide();
                                var data=Josnresult.data;
                                if(status === "1") {
                                    if($.isFunction(masterpage.signWindow.callback)) {
                                        masterpage.signWindow.callback();
                                    }
                                    masterpage.signWindow.signDeptName = data.deptName;
                                    masterpage.signWindow.signTime = data.currentDate;
                                    masterpage.resetSignInfo();
                                }
                                masterpage.deptSignStatus = status;
                            }else {
                                ui.msgshow(Josnresult.message)
                            }

                        }, function (error) {
                            ui.msgshow(error.message, true);
                        });
                }
            }else if( status == "0"){
                if (!confirm("你确定不同意承诺书吗？")) {
                    masterpage.signWindow.hide();
                    return;
                }else{
                    ui.ajax.ajaxPostOnce(
                        currentBtn,
                        masterpage.ctxPath + "/account/saveSign",
                        param,
                        function(Josnresult) {
                            if(Josnresult.result){
                                masterpage.signWindow.hide();
                                if(status === "1") {
                                    masterpage.signWindow.signDeptName = "";
                                    masterpage.signWindow.signTime = "";
                                    $("#signBtn").show();
                                    $("#unsignBtn").show();
                                }
                                masterpage.deptSignStatus = status;
                            }else {
                                ui.msgshow(Josnresult.message)
                            }

                        }, function (error) {
                            ui.msgshow(error.message, true);
                        });
                }
            }

        },

        //创建边栏管理器
        createSidebarManager: function() {
            return SidebarManager();
        },
        //准备动态磁贴
        getTileOptions: function (option, menus, parentField, idField) {
            if (!$.isArray(menus) || menus.length == 0)
                return option;
            var menuTree = ui.data.listToTree(menus, parentField, idField);
            var options = [];
            if (option) {
                options.push(option);
            }
            var item = null;
            var i, j, len, t;
            for (i = 0; i < menuTree.length; i++) {
                item = menuTree[i];
                if (item.children == null || item.children.length == 0) {
                    if (option == null) {
                        option = {
                            tiles: []
                        };
                        options.push(option);
                    }
                    t = this._createTile(item);
                    if(t)
                        option.tiles.push(t);
                } else {
                    option = {
                        title: item.FunctionName,
                        tiles: []
                    };
                    for (j = 0, len = item.children.length; j < len; j++) {
                        t = this._createTile(item.children[j]);
                        if(t)
                            option.tiles.push(t);
                    }
                    if(option.tiles.length > 0)
                        options.push(option);
                }
            }
            return options;
        },
        _createTile: function (item) {
            if (!item.IsTile) {
                return null;
            }
            var tile = {
                type: item.Size || "medium",
                bgColor: item.BGColor || ui.theme.getCurrentColor(),
                title: item.FunctionName,
                icon: item.Icon,
                link: item.Url
            };
            if (item.MenuKey) {
                tile.name = item.MenuKey;
            }
            return tile;
        },
        initToolbar: function(toolbarId) {
            if(!toolbarId) {
                return;
            }
            var toolbar = Toolbar1({
                toolbarId: toolbarId,
                defaultExtendShow: false
            });
            if(!toolbar.toolbarPanel) {
                return;
            }
            this.toolbar = toolbar;
            if(pageLogic) {
                pageLogic.toolbar = this.toolbar;
            }
        },
        headerCtrlInitial: function(id, initCallback) {
            id += "";
            if(!this.headerCtrls) {
                this.headerCtrls = {};
            }
            if($.isFunction(initCallback)) {
                this.headerCtrls[id] = initCallback;
            }
        },
        //注册后退方法
        pushBack: function (func) {
            var defaultUrl,
                that;
            if(!this.backButton) {
                this.backButton = $("#backBtn");
                if(this.backButton.length == 0) {
                    this.backButton = null;
                    return;
                }
            }
            if ($.isFunction(func)) {
                if (!this.backList) {
                    this.backList = [];
                    defaultUrl = this.backButton.prop("href");
                    this.backButton.prop("href", "javascript:void(0)");
                    this.backList.push(function () {
                        location.href = defaultUrl;
                    });
                    that = this;
                    this.backButton.click(function(e) {
                        var func = null;
                        if (that.backList.length == 1) {
                            func = that.backList[0];
                        } else {
                            func = that.backList.pop();
                        }
                        func.call(that);
                    });
                }
                this.backList.push(func);
            }
        },
        //托管dom ready事件
        ready: function (func) {
            if ($.isFunction(func)) {
                ui.docReady(func, ui.eventPriority.pageReady);
            }
        },
        //托管window resize事件
        resize: function (func, autoCall) {
            if ($.isFunction(func)) {
                ui.resize(func, ui.eventPriority.elementResize);
                if(autoCall !== false) {
                    func.call(ui);
                }
            }
        }
    };

    //项目通用单元格格式化器
    masterpage.formatter = {
        //填写状态
        inputState: function(value, column) {
            var html = [];
            html.push("<span class='state-text' style='width:60px;background-color:");
            if(value.VALIDITY === 1) {
                html.push("#5BB12F");
            } else {
                html.push("#E8B71A");
            }
            html.push("'>", value.COMPLETE_STATUS_NAME, "</span>");
            return html.join("");
        },
        //项目状态
        projectState: function(value, column) {
            var span = $("<span style='width:60px;'/>");
            //待上报
            if(value.STATUS === masterpage.projectToReportStatus) {
                span.addClass("state-text");
                span.css("background-color", "#6E9ECF");
                //被退回
            } else if(value.STATUS === masterpage.projectToBackedStatus) {
                span.addClass("state-text");
                span.addClass("back-state-text");
                span.css("background-color", "#D44944");
                //已上报
            } else if(value.STATUS === masterpage.projectReportedStatus) {
                span.addClass("state-text");
                span.css("background-color", "#009966");
            } else {
                span.text("缺失");
                return span;
            }
            span.text(value.STATUS_NAME);
            return span;
        },
        complete: function(value, column) {
            var span = $("<span style='width:60px;'/>");
            var text = "完整";
            if(value.INTEGRITY === "1") {
                span.addClass("state-text");
                span.addClass("back-state-text");
                span.css("background-color", "#D44944");
                text = "不完整";
            }
            span.text(text);
            return span;
        }
        // projectState: function(value, column) {
        //     var html = [];
        //     html.push("<span class='state-text' style='width:60px;background-color:");
        //     //待上报
        //     if(value.STATUS === masterpage.projectToReportStatus) {
        //         html.push("#6E9ECF");
        //         //被退回
        //     } else if(value.STATUS === masterpage.projectToBackedStatus) {
        //         html.push("#D44944");
        //         //已上报
        //     } else if(value.STATUS === masterpage.projectReportedStatus) {
        //         html.push("#009966");
        //     } else {
        //         return "<span>缺失</span>";
        //     }
        //
        //     html.push("'>", value.STATUS_NAME, "</span>");
        //     return html.join("");
        // }
    };

    return masterpage;
}));