/*
 * 匠心内部开发
 * author：luoluo
 * website：http://luoluo.in/ctab/
 * version：1.0
 * contact：1054816104@qq.com
 *
 * update: 2014-6-5
 * author: luoluo
 * describe: 添加隐藏某个tab的方法
 */
ctab = function($dom,opt){
	opt.menus = typeof opt.menus === 'string' ? $dom.find(opt.menus) : opt.menus;
	opt.cons = typeof opt.cons === 'string' ? $dom.find(opt.cons) : opt.cons;
	this.$dom = $dom;
	this.opt = opt;
	this.main();
};

ctab.prototype.main = function(){
	var self = this;
	self.$menus = self.opt.menus;
	self.$cons = self.opt.cons;
	
	var $currentMenus = self.$menus.filter('.'+ self.opt.activeMenu)[0] ? self.$menus.filter('.'+ self.opt.activeMenu) : self.$menus.eq(0);
	self.showTab($currentMenus, 'default');

	self.addEvent();
};

ctab.prototype.showTab = function($this, type){
	var self = this,
		ajaxUrl = $this.attr('ajax'),
		$thisCon = self.$cons.eq($this.index());

	if(type === 'default' || !$this.hasClass(self.opt.activeMenu)){
		if(self.opt.activeCon.length > 0){
			self.$cons.removeClass(self.opt.activeCon);
			$thisCon.addClass(self.opt.activeCon);
		}else{
			self.$cons.hide();
			$thisCon.show();
		}
		self.$menus.removeClass(self.opt.activeMenu);
		$this.addClass(self.opt.activeMenu);
		if(!$thisCon.data('data') && ajaxUrl){
			self.getData(ajaxUrl,$thisCon);
		}

		if(typeof self.opt.callback === 'function'){
			self.opt.callback($this, $thisCon);
		}
	}
};

ctab.prototype.addEvent = function(){
	var self = this;
	switch(self.opt.eventType){
		case 'hover':
			self.$menus.hover(function(){
				var $this = $(this);
				self.clearTime = setTimeout(function(){
					self.showTab($this, 'event');
				},self.opt.delay);
			},function(){
				clearTimeout(self.clearTime);
			});
			break;
		default:
			self.$menus.click(function(){
				self.showTab($(this), 'event');
			});
	}
};

ctab.prototype.getData = function(ajaxUrl,$thisCon){
	var self = this;
	$.ajax({
		url: ajaxUrl,
		type:'get',
		dataType: 'html',
		success: function(result){
			if(result){
				$thisCon.html(result);
				$thisCon.data('data',result);
			}else{
				$thisCon.html('数据加载失败');
			}
		}
	});
};

ctab.prototype.hideTab = function(index){
    var self = this
    self.$menus.eq(index).hide()
    self.$cons.eq(index).hide()
    self.showTab($(self.$menus.filter(':visible')[0]), 'default')
};

$.fn.ctab = function(opt){
	$.each(this,function(){
		var $this = $(this),
			option = {
				menus: $this.find('.menu_item'),
				cons: $this.find('.con_item'),
				eventType: 'click',
				delay: 0,
				activeMenu: 'active',
				activeCon: '',
				callback: function(){}
			}
		var tabObj = new ctab($this,$.extend(option,opt));
		$this.data('ctab',tabObj);
        return tabObj
	});
};