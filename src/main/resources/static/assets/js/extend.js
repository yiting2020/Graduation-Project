/**
 * 主要用户扩展（非EasyUI）控件
 */

/**
 * author:tannc
 * createtime:2015-9-22 10:30:16
 * 全局配置lhgDialog 
 *  如果您使用独立版本的lhgDialog窗口组件，您只需在页面head中引入lhgcore.lhgdialog.min.js文件，
 *  4.1.1+版本做了修改可以和jQuerya库同时引用，而且4.1.1+版本的独立组件的lhgcore库做了极大的修改，
 *  专门为组件定制，压缩后才6K与组件合在一起总大小才不到20K，效率上得到很大提高，比引用jQuery快很多，
 *  但这里要注意如果你同时引用了jQuery库的话必须把$换成J，如果没引用jQuery库则可直接使用$。
 */
	(function(config){
	    config['extendDrag'] = true; // 注意，此配置参数只能在这里使用全局配置，在调用窗口的传参数使用无效
	    config['lock'] = true;
//	    config['fixed'] = true;
//	    config['okVal'] = '保存';
	    config['cancelVal'] = '取消';	  
	})($.dialog.setting);
	