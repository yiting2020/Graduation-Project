; (function () {
    var MessageType = {
        message: 0,
        warn: 1,
        error: 3,
        success: 4,
        failed: 5
    };
    // 信息提示框
    function MessageBox() {
        if(this instanceof MessageBox) {
            this.initial();
        } else {
            return new MessageBox();
        }
    }
    MessageBox.prototype = {
        initial: function() {
            this.box = null;
            this.type = MessageType;
            this.isStartHide = false;
            this.boxAnimator = null;
            this.width = 322;
            this.top = 88;
        },
        _initAnimator: function() {
            this.boxAnimator = ui.animator({
                target: this.box,
                ease: ui.AnimationStyle.easeTo,
                onChange: function(val) {
                    this.target.css("left", val + "px");
                }
            });
            this.boxAnimator.duration = 200;
        },
        getIcon: function(type) {
            if(type === MessageType.warn) {
                return "mb-warn fa fa-exclamation-triangle";
            } else if(type === MessageType.error) {
                return "mb-error fa fa-times-circle";
            } else if(type === MessageType.success) {
                return "mb-success fa fa-check-circle-o";
            } else if(type === MessageType.failed) {
                return "mb-failed fa fa-times-circle-o";
            } else {
                return "mb-message fa fa-commenting";
            }
        },
        getBox: function () {
            var clientWidth,
                clientHeight;
            if (!this.box) {
                clientWidth = ui.core.root.clientWidth;
                clientHeight = ui.core.root.clientHeight;
                this.box = $("<div class='message-box theme-action-color border-highlight' />");
                this.box.css({
                    "top": this.top + "px",
                    "left": clientWidth + "px",
                    "max-height": clientHeight - (this.top * 2) + "px"
                });
                var close = $("<a href='javascript:void(0)' class='close-button'>×</a>");
                var that = this;
                close.click(function (e) {
                    that.hide(true);
                });
                this.box.mouseenter(function (e) {
                    if (that.isClosing) {
                        return;
                    }
                    if (that.isStartHide) {
                        that._show();
                    } else {
                        clearTimeout(that.hideHandler);
                    }
                });
                this.box.mouseleave(function (e) {
                    that.waitSeconds(5);
                });

                this.box.append(close);
                $(document.body).append(this.box);

                this._initAnimator();
            }
            return this.box;
        },
        isShow: function() {
            return this.getBox().css("display") === "block";
        },
        show: function (text, type) {
            var box,
                messageItem,
                htmlBuilder = [];

            messageItem = $("<div class='message-item' />")
            htmlBuilder.push("<i class='message-icon ", this.getIcon(type), "'></i>");
            htmlBuilder.push("<div class='message-content'>");
            if($.isFunction(text)) {
                htmlBuilder.push(text());
            } else {
                htmlBuilder.push(ui.str.htmlEncode(text + ""));
            }
            htmlBuilder.push("</div>");
            messageItem.html(htmlBuilder.join(""));

            box = this.getBox();
            if(this.isShow()) {
                box.append(messageItem);
                return;
            }
            box.children(".message-item").remove();
            box.append(messageItem);
            this._show(function () {
                messagebox.waitSeconds(5);
            });
        },
        _show: function (completedHandler) {
            var box = this.getBox(),
                option,
                clientWidth = ui.core.root.clientWidth;
            this.isStartHide = false;

            this.boxAnimator.stop();
            option = this.boxAnimator[0];
            option.begin = parseFloat(option.target.css("left")) || clientWidth;
            option.end = clientWidth - this.width;
            option.target.css("display", "block");
            this.boxAnimator.start().done(completedHandler);
        },
        hide: function (flag) {
            var box,
                option,
                clientWidth = ui.core.root.clientWidth;
            if (flag) {
                this.isClosing = true;
            }
            box = this.getBox();
            this.isStartHide = true;

            this.boxAnimator.stop();
            option = this.boxAnimator[0];
            option.begin = parseFloat(option.target.css("left")) || clientWidth - this.width;
            option.end = clientWidth;
            this.boxAnimator.start().done(function() {
                box.css("display", "none");
                if (flag) {
                    this.isClosing = false;
                }
            });
        },
        waitSeconds: function (seconds) {
            var that = this;
            if (that.hideHandler)
                window.clearTimeout(that.hideHandler);
            if (isNaN(parseInt(seconds)))
                seconds = 5;
            that.hideHandler = window.setTimeout(function () {
                that.hideHandler = null;
                if (that.isStartHide === false) {
                    that.hide();
                }
            }, seconds * 1000);
        }
    }

    var messagebox = MessageBox();
    ui.resize(function (e) {
        var box = messagebox.getBox(),
            clientWidth = ui.core.root.clientWidth,
            clientHeight = ui.core.root.clientHeight,
            left;
        if(messagebox.isShow()) {
            left = clientWidth - messagebox.width;
        } else {
            left = clientWidth;
        }
        box.css({
            "left": clientWidth + "px",
            "max-height": clientHeight - (messagebox.top * 2) + "px"
        });
    });
    ui.msgshow = function (text, type) {
        if(type === true) {
            type = MessageType.error;
        } else {
            if(!type) {
                type = MessageType.message;
            }
        }
        messagebox.show(text, type);
    };
    ui.msghide = function () {
        messagebox.hide(true);
    };
    ui.messageShow = function(text) {
        ui.msgshow(text, MessageType.message);
    };
    ui.warnShow = function(text) {
        ui.msgshow(text, MessageType.warn);
    };
    ui.errorShow = function(text) {
        ui.msgshow(text, MessageType.error);
    };
    ui.successShow = function(text) {
        ui.msgshow(text, MessageType.success);
    };
    ui.failedShow = function(text) {
        ui.msgshow(text, MessageType.failed);
    };

    // 加载提示框
    function LoadingBox(option) {
        if(this instanceof LoadingBox) {
            this.initial(option);
        } else {
            return new LoadingBox(option);
        }
    }
    LoadingBox.prototype = {
        initial: function(option) {
            if(!option) {
                option = {};
            }
            this.delay = option.delay;
            if(ui.core.type(this.delay) !== "number" || this.delay < 0) {
                this.delay = 1000;
            }
            this.timeoutHandle = null;
            this.isOpening = false;
            this.box = null;
            this.openCount = 0;

            this.animator = ui.animator({
                target: null,
                ease: ui.AnimationStyle.easeFromTo,
                onChange: function(val) {
                    this.target.css("top", val + "px");
                }
            });
            this.animator.duration = 240;
        },
        getBox: function() {
            if(!this.box) {
                this.box = $("#loadingBox");
                this.animator[0].target = this.box;
            }
            return this.box;
        },
        isShow: function() {
            return this.getBox().css("display") === "block";
        },
        show: function() {
            var that;
            if(this.isOpening || this.isShow()) {
                this.openCount++;
                return;
            }
            this.isOpening = true;
            that = this;
            this.timeoutHandle = setTimeout(function() {
                that.timeoutHandle = null;
                that._doShow();
            }, this.delay);
        },
        _doShow: function() {
            var option;
            this.getBox();

            this.animator.stop();
            this.box.css({
                "display": "block",
                "top": "-48px"
            });
            option = this.animator[0];
            option.begin = -48;
            option.end = 0;
            this.animator.start();
        },
        hide: function() {
            var option,
                that;
            if(this.openCount > 0) {
                this.openCount--;
                return;
            }
            this.isOpening = false;
            if(this.timeoutHandle) {
                clearTimeout(this.timeoutHandle);
                return;
            }

            this.getBox();
            option = this.animator[0];
            option.begin = 0;
            option.end = -48;
            that = this;
            this.animator.start().done(function() {
                that.box.css("display", "none");
            });
        }
    };

    var loadingBox = LoadingBox();
    ui.loadingShow = function() {
        loadingBox.show();
    };
    ui.loadingHide = function() {
        loadingBox.hide();
    };

    //为ajaxPost方法添加等待显示
    var ajaxPost = ui.ajax.ajaxPost;
    ui.ajax.ajaxPost = function(url, args, success, error, option) {
        if ($.isFunction(args)) {
            error = success;
            success = args;
            args = null;
        }

        var successWrapper = function() {
            ui.loadingHide();
            if(success) {
                success.apply(ui.ajax, arguments);
            }
        };
        var errorWrapper = function() {
            ui.loadingHide();
            if(error) {
                error.apply(ui.ajax, arguments);
            }
        };
        ui.loadingShow();
        return ajaxPost(url, args, successWrapper, errorWrapper, option);
    };
    //为ajaxPostOnce添加等待显示
    var ajaxPostOnce = ui.ajax.ajaxPostOnce;
    ui.ajax.ajaxPostOnce = function(btn, url, args, success, error, option) {
        if ($.isFunction(args)) {
            error = success;
            success = args;
            args = null;
        }
        var successWrapper = function() {
            ui.loadingHide();
            if(success) {
                success.apply(ui.ajax, arguments);
            }
        };
        var errorWrapper = function() {
            ui.loadingHide();
            if(error) {
                error.apply(ui.ajax, arguments);
            }
        };
        ui.loadingShow();
        ajaxPostOnce(btn, url, args, successWrapper, errorWrapper, option);
    };
    //添加一个异步多线程加载数据的方法
    var taskLimit = 4;
    ui.ajax.dataLoadAsync = function(url, option, success, error) {
        var dataLength,
            offset,
            limit,
            size,
            tasks = [],
            i;
        if(!url) {
            throw new Error("url不能为空");
        }
        if(!option) {
            throw new Error("option不能为空");
        }
        if(!$.isFunction(success)) {
            success = ui.core.noop;
        }
        if(!$.isFunction(error)) {
            error = ui.core.noop;
        }

        dataLength = option.dataLength;
        if(ui.core.type(dataLength) !== "number" || dataLength == 0) {
            throw new Error("dataLength不是数字或者值为0");
        }
        if(dataLength > 1000) {
            size = Math.floor(dataLength / taskLimit);
            for(i = 0; i < taskLimit; i++) {
                offset = i * size;
                limit = size;
                if(i === taskLimit - 1) {
                    limit += dataLength - (size * taskLimit);
                }
                tasks.push(ui.ajax.ajaxPost(
                    url, { offset: offset, limit: limit }
                ));
            }
        } else {
            tasks.push(ui.ajax.ajaxPost(
                url, { offset: 0, limit: dataLength }
            ));
        }
        
        ui.ajax.ajaxAll.apply(ui.ajax, tasks).then(
            function(result) {
                var arr = [];
                arr = arr.concat.apply(arr, result);
                success(arr);
            },
            function (e) {
                error(e);
            }
        );
    }
})();