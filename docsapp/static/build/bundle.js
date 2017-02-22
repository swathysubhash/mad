(function () {
'use strict';

/* http://prismjs.com/download.html?themes=prism&languages=clike+bash+ruby+go+json+python */
var _self="undefined"!=typeof window?window:"undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope?self:{};
var Prism=function(){var e=/\blang(?:uage)?-(\w+)\b/i,t=0,n=_self.Prism={manual:_self.Prism&&_self.Prism.manual,util:{encode:function(e){return e instanceof a?new a(e.type,n.util.encode(e.content),e.alias):"Array"===n.util.type(e)?e.map(n.util.encode):e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(e){return Object.prototype.toString.call(e).match(/\[object (\w+)\]/)[1]},objId:function(e){return e.__id||Object.defineProperty(e,"__id",{value:++t}),e.__id},clone:function(e){var t=n.util.type(e);switch(t){case"Object":var a={};for(var r in e)e.hasOwnProperty(r)&&(a[r]=n.util.clone(e[r]));return a;case"Array":return e.map&&e.map(function(e){return n.util.clone(e)})}return e}},languages:{extend:function(e,t){var a=n.util.clone(n.languages[e]);for(var r in t)a[r]=t[r];return a},insertBefore:function(e,t,a,r){r=r||n.languages;var l=r[e];if(2==arguments.length){a=arguments[1];for(var i in a)a.hasOwnProperty(i)&&(l[i]=a[i]);return l}var o={};for(var s in l)if(l.hasOwnProperty(s)){if(s==t)for(var i in a)a.hasOwnProperty(i)&&(o[i]=a[i]);o[s]=l[s];}return n.languages.DFS(n.languages,function(t,n){n===r[e]&&t!=e&&(this[t]=o);}),r[e]=o},DFS:function(e,t,a,r){r=r||{};for(var l in e)e.hasOwnProperty(l)&&(t.call(e,l,e[l],a||l),"Object"!==n.util.type(e[l])||r[n.util.objId(e[l])]?"Array"!==n.util.type(e[l])||r[n.util.objId(e[l])]||(r[n.util.objId(e[l])]=!0,n.languages.DFS(e[l],t,l,r)):(r[n.util.objId(e[l])]=!0,n.languages.DFS(e[l],t,null,r)));}},plugins:{},highlightAll:function(e,t){var a={callback:t,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};n.hooks.run("before-highlightall",a);for(var r,l=a.elements||document.querySelectorAll(a.selector),i=0;r=l[i++];)n.highlightElement(r,e===!0,a.callback);},highlightElement:function(t,a,r){for(var l,i,o=t;o&&!e.test(o.className);)o=o.parentNode;o&&(l=(o.className.match(e)||[,""])[1].toLowerCase(),i=n.languages[l]),t.className=t.className.replace(e,"").replace(/\s+/g," ")+" language-"+l,o=t.parentNode,/pre/i.test(o.nodeName)&&(o.className=o.className.replace(e,"").replace(/\s+/g," ")+" language-"+l);var s=t.textContent,u={element:t,language:l,grammar:i,code:s};if(n.hooks.run("before-sanity-check",u),!u.code||!u.grammar)return u.code&&(u.element.textContent=u.code),n.hooks.run("complete",u),void 0;if(n.hooks.run("before-highlight",u),a&&_self.Worker){var g=new Worker(n.filename);g.onmessage=function(e){u.highlightedCode=e.data,n.hooks.run("before-insert",u),u.element.innerHTML=u.highlightedCode,r&&r.call(u.element),n.hooks.run("after-highlight",u),n.hooks.run("complete",u);},g.postMessage(JSON.stringify({language:u.language,code:u.code,immediateClose:!0}));}else u.highlightedCode=n.highlight(u.code,u.grammar,u.language),n.hooks.run("before-insert",u),u.element.innerHTML=u.highlightedCode,r&&r.call(t),n.hooks.run("after-highlight",u),n.hooks.run("complete",u);},highlight:function(e,t,r){var l=n.tokenize(e,t);return a.stringify(n.util.encode(l),r)},tokenize:function(e,t){var a=n.Token,r=[e],l=t.rest;if(l){for(var i in l)t[i]=l[i];delete t.rest;}e:for(var i in t)if(t.hasOwnProperty(i)&&t[i]){var o=t[i];o="Array"===n.util.type(o)?o:[o];for(var s=0;s<o.length;++s){var u=o[s],g=u.inside,c=!!u.lookbehind,h=!!u.greedy,f=0,d=u.alias;if(h&&!u.pattern.global){var p=u.pattern.toString().match(/[imuy]*$/)[0];u.pattern=RegExp(u.pattern.source,p+"g");}u=u.pattern||u;for(var m=0,y=0;m<r.length;y+=r[m].length,++m){var v=r[m];if(r.length>e.length)break e;if(!(v instanceof a)){u.lastIndex=0;var b=u.exec(v),k=1;if(!b&&h&&m!=r.length-1){if(u.lastIndex=y,b=u.exec(e),!b)break;for(var w=b.index+(c?b[1].length:0),_=b.index+b[0].length,P=m,A=y,j=r.length;j>P&&_>A;++P)A+=r[P].length,w>=A&&(++m,y=A);if(r[m]instanceof a||r[P-1].greedy)continue;k=P-m,v=e.slice(y,A),b.index-=y;}if(b){c&&(f=b[1].length);var w=b.index+f,b=b[0].slice(f),_=w+b.length,x=v.slice(0,w),O=v.slice(_),S=[m,k];x&&S.push(x);var N=new a(i,g?n.tokenize(b,g):b,d,b,h);S.push(N),O&&S.push(O),Array.prototype.splice.apply(r,S);}}}}}return r},hooks:{all:{},add:function(e,t){var a=n.hooks.all;a[e]=a[e]||[],a[e].push(t);},run:function(e,t){var a=n.hooks.all[e];if(a&&a.length)for(var r,l=0;r=a[l++];)r(t);}}},a=n.Token=function(e,t,n,a,r){this.type=e,this.content=t,this.alias=n,this.length=0|(a||"").length,this.greedy=!!r;};if(a.stringify=function(e,t,r){if("string"==typeof e)return e;if("Array"===n.util.type(e))return e.map(function(n){return a.stringify(n,t,e)}).join("");var l={type:e.type,content:a.stringify(e.content,t,r),tag:"span",classes:["token",e.type],attributes:{},language:t,parent:r};if("comment"==l.type&&(l.attributes.spellcheck="true"),e.alias){var i="Array"===n.util.type(e.alias)?e.alias:[e.alias];Array.prototype.push.apply(l.classes,i);}n.hooks.run("wrap",l);var o=Object.keys(l.attributes).map(function(e){return e+'="'+(l.attributes[e]||"").replace(/"/g,"&quot;")+'"'}).join(" ");return"<"+l.tag+' class="'+l.classes.join(" ")+'"'+(o?" "+o:"")+">"+l.content+"</"+l.tag+">"},!_self.document)return _self.addEventListener?(_self.addEventListener("message",function(e){var t=JSON.parse(e.data),a=t.language,r=t.code,l=t.immediateClose;_self.postMessage(n.highlight(r,n.languages[a],a)),l&&_self.close();},!1),_self.Prism):_self.Prism;var r=document.currentScript||[].slice.call(document.getElementsByTagName("script")).pop();return r&&(n.filename=r.src,!document.addEventListener||n.manual||r.hasAttribute("data-manual")||("loading"!==document.readyState?window.requestAnimationFrame?window.requestAnimationFrame(n.highlightAll):window.setTimeout(n.highlightAll,16):document.addEventListener("DOMContentLoaded",n.highlightAll))),_self.Prism}();"undefined"!=typeof module&&module.exports&&(module.exports=Prism),"undefined"!=typeof global&&(global.Prism=Prism);
Prism.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\w\W]*?\*\//,lookbehind:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0}],string:{pattern:/(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,lookbehind:!0,inside:{punctuation:/(\.|\\)/}},keyword:/\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,"boolean":/\b(true|false)\b/,"function":/[a-z0-9_]+(?=\()/i,number:/\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,operator:/--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,punctuation:/[{}[\];(),.:]/};
!function(e){var t={variable:[{pattern:/\$?\(\([\w\W]+?\)\)/,inside:{variable:[{pattern:/(^\$\(\([\w\W]+)\)\)/,lookbehind:!0},/^\$\(\(/],number:/\b-?(?:0x[\dA-Fa-f]+|\d*\.?\d+(?:[Ee]-?\d+)?)\b/,operator:/--?|-=|\+\+?|\+=|!=?|~|\*\*?|\*=|\/=?|%=?|<<=?|>>=?|<=?|>=?|==?|&&?|&=|\^=?|\|\|?|\|=|\?|:/,punctuation:/\(\(?|\)\)?|,|;/}},{pattern:/\$\([^)]+\)|`[^`]+`/,inside:{variable:/^\$\(|^`|\)$|`$/}},/\$(?:[a-z0-9_#\?\*!@]+|\{[^}]+\})/i]};e.languages.bash={shebang:{pattern:/^#!\s*\/bin\/bash|^#!\s*\/bin\/sh/,alias:"important"},comment:{pattern:/(^|[^"{\\])#.*/,lookbehind:!0},string:[{pattern:/((?:^|[^<])<<\s*)(?:"|')?(\w+?)(?:"|')?\s*\r?\n(?:[\s\S])*?\r?\n\2/g,lookbehind:!0,greedy:!0,inside:t},{pattern:/(["'])(?:\\\\|\\?[^\\])*?\1/g,greedy:!0,inside:t}],variable:t.variable,"function":{pattern:/(^|\s|;|\||&)(?:alias|apropos|apt-get|aptitude|aspell|awk|basename|bash|bc|bg|builtin|bzip2|cal|cat|cd|cfdisk|chgrp|chmod|chown|chroot|chkconfig|cksum|clear|cmp|comm|command|cp|cron|crontab|csplit|cut|date|dc|dd|ddrescue|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|du|egrep|eject|enable|env|ethtool|eval|exec|expand|expect|export|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|getopts|git|grep|groupadd|groupdel|groupmod|groups|gzip|hash|head|help|hg|history|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|jobs|join|kill|killall|less|link|ln|locate|logname|logout|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|make|man|mkdir|mkfifo|mkisofs|mknod|more|most|mount|mtools|mtr|mv|mmv|nano|netstat|nice|nl|nohup|notify-send|npm|nslookup|open|op|passwd|paste|pathchk|ping|pkill|popd|pr|printcap|printenv|printf|ps|pushd|pv|pwd|quota|quotacheck|quotactl|ram|rar|rcp|read|readarray|readonly|reboot|rename|renice|remsync|rev|rm|rmdir|rsync|screen|scp|sdiff|sed|seq|service|sftp|shift|shopt|shutdown|sleep|slocate|sort|source|split|ssh|stat|strace|su|sudo|sum|suspend|sync|tail|tar|tee|test|time|timeout|times|touch|top|traceroute|trap|tr|tsort|tty|type|ulimit|umask|umount|unalias|uname|unexpand|uniq|units|unrar|unshar|uptime|useradd|userdel|usermod|users|uuencode|uudecode|v|vdir|vi|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yes|zip)(?=$|\s|;|\||&)/,lookbehind:!0},keyword:{pattern:/(^|\s|;|\||&)(?:let|:|\.|if|then|else|elif|fi|for|break|continue|while|in|case|function|select|do|done|until|echo|exit|return|set|declare)(?=$|\s|;|\||&)/,lookbehind:!0},"boolean":{pattern:/(^|\s|;|\||&)(?:true|false)(?=$|\s|;|\||&)/,lookbehind:!0},operator:/&&?|\|\|?|==?|!=?|<<<?|>>|<=?|>=?|=~/,punctuation:/\$?\(\(?|\)\)?|\.\.|[{}[\];]/};var a=t.variable[1].inside;a["function"]=e.languages.bash["function"],a.keyword=e.languages.bash.keyword,a.boolean=e.languages.bash.boolean,a.operator=e.languages.bash.operator,a.punctuation=e.languages.bash.punctuation;}(Prism);
!function(e){e.languages.ruby=e.languages.extend("clike",{comment:/#(?!\{[^\r\n]*?\}).*/,keyword:/\b(alias|and|BEGIN|begin|break|case|class|def|define_method|defined|do|each|else|elsif|END|end|ensure|false|for|if|in|module|new|next|nil|not|or|raise|redo|require|rescue|retry|return|self|super|then|throw|true|undef|unless|until|when|while|yield)\b/});var n={pattern:/#\{[^}]+\}/,inside:{delimiter:{pattern:/^#\{|\}$/,alias:"tag"},rest:e.util.clone(e.languages.ruby)}};e.languages.insertBefore("ruby","keyword",{regex:[{pattern:/%r([^a-zA-Z0-9\s\{\(\[<])(?:[^\\]|\\[\s\S])*?\1[gim]{0,3}/,greedy:!0,inside:{interpolation:n}},{pattern:/%r\((?:[^()\\]|\\[\s\S])*\)[gim]{0,3}/,greedy:!0,inside:{interpolation:n}},{pattern:/%r\{(?:[^#{}\\]|#(?:\{[^}]+\})?|\\[\s\S])*\}[gim]{0,3}/,greedy:!0,inside:{interpolation:n}},{pattern:/%r\[(?:[^\[\]\\]|\\[\s\S])*\][gim]{0,3}/,greedy:!0,inside:{interpolation:n}},{pattern:/%r<(?:[^<>\\]|\\[\s\S])*>[gim]{0,3}/,greedy:!0,inside:{interpolation:n}},{pattern:/(^|[^\/])\/(?!\/)(\[.+?]|\\.|[^\/\\\r\n])+\/[gim]{0,3}(?=\s*($|[\r\n,.;})]))/,lookbehind:!0,greedy:!0}],variable:/[@$]+[a-zA-Z_][a-zA-Z_0-9]*(?:[?!]|\b)/,symbol:/:[a-zA-Z_][a-zA-Z_0-9]*(?:[?!]|\b)/}),e.languages.insertBefore("ruby","number",{builtin:/\b(Array|Bignum|Binding|Class|Continuation|Dir|Exception|FalseClass|File|Stat|File|Fixnum|Float|Hash|Integer|IO|MatchData|Method|Module|NilClass|Numeric|Object|Proc|Range|Regexp|String|Struct|TMS|Symbol|ThreadGroup|Thread|Time|TrueClass)\b/,constant:/\b[A-Z][a-zA-Z_0-9]*(?:[?!]|\b)/}),e.languages.ruby.string=[{pattern:/%[qQiIwWxs]?([^a-zA-Z0-9\s\{\(\[<])(?:[^\\]|\\[\s\S])*?\1/,greedy:!0,inside:{interpolation:n}},{pattern:/%[qQiIwWxs]?\((?:[^()\\]|\\[\s\S])*\)/,greedy:!0,inside:{interpolation:n}},{pattern:/%[qQiIwWxs]?\{(?:[^#{}\\]|#(?:\{[^}]+\})?|\\[\s\S])*\}/,greedy:!0,inside:{interpolation:n}},{pattern:/%[qQiIwWxs]?\[(?:[^\[\]\\]|\\[\s\S])*\]/,greedy:!0,inside:{interpolation:n}},{pattern:/%[qQiIwWxs]?<(?:[^<>\\]|\\[\s\S])*>/,greedy:!0,inside:{interpolation:n}},{pattern:/("|')(#\{[^}]+\}|\\(?:\r?\n|\r)|\\?.)*?\1/,greedy:!0,inside:{interpolation:n}}];}(Prism);
Prism.languages.go=Prism.languages.extend("clike",{keyword:/\b(break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go(to)?|if|import|interface|map|package|range|return|select|struct|switch|type|var)\b/,builtin:/\b(bool|byte|complex(64|128)|error|float(32|64)|rune|string|u?int(8|16|32|64|)|uintptr|append|cap|close|complex|copy|delete|imag|len|make|new|panic|print(ln)?|real|recover)\b/,"boolean":/\b(_|iota|nil|true|false)\b/,operator:/[*\/%^!=]=?|\+[=+]?|-[=-]?|\|[=|]?|&(?:=|&|\^=?)?|>(?:>=?|=)?|<(?:<=?|=|-)?|:=|\.\.\./,number:/\b(-?(0x[a-f\d]+|(\d+\.?\d*|\.\d+)(e[-+]?\d+)?)i?)\b/i,string:{pattern:/("|'|`)(\\?.|\r|\n)*?\1/,greedy:!0}}),delete Prism.languages.go["class-name"];
Prism.languages.json={property:/"(?:\\.|[^\\"])*"(?=\s*:)/gi,string:/"(?!:)(?:\\.|[^\\"])*"(?!:)/g,number:/\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee][+-]?\d+)?)\b/g,punctuation:/[{}[\]);,]/g,operator:/:/g,"boolean":/\b(true|false)\b/gi,"null":/\bnull\b/gi},Prism.languages.jsonp=Prism.languages.json;
Prism.languages.python={"triple-quoted-string":{pattern:/"""[\s\S]+?"""|'''[\s\S]+?'''/,alias:"string"},comment:{pattern:/(^|[^\\])#.*/,lookbehind:!0},string:{pattern:/("|')(?:\\\\|\\?[^\\\r\n])*?\1/,greedy:!0},"function":{pattern:/((?:^|\s)def[ \t]+)[a-zA-Z_][a-zA-Z0-9_]*(?=\()/g,lookbehind:!0},"class-name":{pattern:/(\bclass\s+)[a-z0-9_]+/i,lookbehind:!0},keyword:/\b(?:as|assert|async|await|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|pass|print|raise|return|try|while|with|yield)\b/,"boolean":/\b(?:True|False)\b/,number:/\b-?(?:0[bo])?(?:(?:\d|0x[\da-f])[\da-f]*\.?\d*|\.\d+)(?:e[+-]?\d+)?j?\b/i,operator:/[-+%=]=?|!=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]|\b(?:or|and|not)\b/,punctuation:/[{}[\];(),.:]/};
(function() {

if (typeof self === 'undefined' || !self.Prism || !self.document) {
	return;
}

Prism.hooks.add('complete', function (env) {
	if (!env.code) {
		return;
	}

	// works only for <code> wrapped inside <pre> (not inline)
	var pre = env.element.parentNode;
	var clsReg = /\s*\bline-numbers\b\s*/;
	if (
		!pre || !/pre/i.test(pre.nodeName) ||
			// Abort only if nor the <pre> nor the <code> have the class
		(!clsReg.test(pre.className) && !clsReg.test(env.element.className))
	) {
		return;
	}

	if (env.element.querySelector(".line-numbers-rows")) {
		// Abort if line numbers already exists
		return;
	}

	if (clsReg.test(env.element.className)) {
		// Remove the class "line-numbers" from the <code>
		env.element.className = env.element.className.replace(clsReg, '');
	}
	if (!clsReg.test(pre.className)) {
		// Add the class "line-numbers" to the <pre>
		pre.className += ' line-numbers';
	}

	var match = env.code.match(/\n(?!$)/g);
	var linesNum = match ? match.length + 1 : 1;
	var lineNumbersWrapper;

	var lines = new Array(linesNum + 1);
	lines = lines.join('<span></span>');

	lineNumbersWrapper = document.createElement('span');
	lineNumbersWrapper.setAttribute('aria-hidden', 'true');
	lineNumbersWrapper.className = 'line-numbers-rows';
	lineNumbersWrapper.innerHTML = lines;

	if (pre.hasAttribute('data-start')) {
		pre.style.counterReset = 'linenumber ' + (parseInt(pre.getAttribute('data-start'), 10) - 1);
	}

	env.element.appendChild(lineNumbersWrapper);

});

}());

/*!
Waypoints - 4.0.1
Copyright © 2011-2016 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/waypoints/blob/master/licenses.txt
*/
!function(){"use strict";function t(n){if(!n)throw new Error("No options passed to Waypoint constructor");if(!n.element)throw new Error("No element option passed to Waypoint constructor");if(!n.handler)throw new Error("No handler option passed to Waypoint constructor");this.key="waypoint-"+e,this.options=t.Adapter.extend({},t.defaults,n),this.element=this.options.element,this.adapter=new t.Adapter(this.element),this.callback=n.handler,this.axis=this.options.horizontal?"horizontal":"vertical",this.enabled=this.options.enabled,this.triggerPoint=null,this.group=t.Group.findOrCreate({name:this.options.group,axis:this.axis}),this.context=t.Context.findOrCreateByElement(this.options.context),t.offsetAliases[this.options.offset]&&(this.options.offset=t.offsetAliases[this.options.offset]),this.group.add(this),this.context.add(this),i[this.key]=this,e+=1;}var e=0,i={};t.prototype.queueTrigger=function(t){this.group.queueTrigger(this,t);},t.prototype.trigger=function(t){this.enabled&&this.callback&&this.callback.apply(this,t);},t.prototype.destroy=function(){this.context.remove(this),this.group.remove(this),delete i[this.key];},t.prototype.disable=function(){return this.enabled=!1,this},t.prototype.enable=function(){return this.context.refresh(),this.enabled=!0,this},t.prototype.next=function(){return this.group.next(this)},t.prototype.previous=function(){return this.group.previous(this)},t.invokeAll=function(t){var e=[];for(var n in i)e.push(i[n]);for(var o=0,r=e.length;r>o;o++)e[o][t]();},t.destroyAll=function(){t.invokeAll("destroy");},t.disableAll=function(){t.invokeAll("disable");},t.enableAll=function(){t.Context.refreshAll();for(var e in i)i[e].enabled=!0;return this},t.refreshAll=function(){t.Context.refreshAll();},t.viewportHeight=function(){return window.innerHeight||document.documentElement.clientHeight},t.viewportWidth=function(){return document.documentElement.clientWidth},t.adapters=[],t.defaults={context:window,continuous:!0,enabled:!0,group:"default",horizontal:!1,offset:0},t.offsetAliases={"bottom-in-view":function(){return this.context.innerHeight()-this.adapter.outerHeight()},"right-in-view":function(){return this.context.innerWidth()-this.adapter.outerWidth()}},window.Waypoint=t;}(),function(){"use strict";function t(t){window.setTimeout(t,1e3/60);}function e(t){this.element=t,this.Adapter=o.Adapter,this.adapter=new this.Adapter(t),this.key="waypoint-context-"+i,this.didScroll=!1,this.didResize=!1,this.oldScroll={x:this.adapter.scrollLeft(),y:this.adapter.scrollTop()},this.waypoints={vertical:{},horizontal:{}},t.waypointContextKey=this.key,n[t.waypointContextKey]=this,i+=1,o.windowContext||(o.windowContext=!0,o.windowContext=new e(window)),this.createThrottledScrollHandler(),this.createThrottledResizeHandler();}var i=0,n={},o=window.Waypoint,r=window.onload;e.prototype.add=function(t){var e=t.options.horizontal?"horizontal":"vertical";this.waypoints[e][t.key]=t,this.refresh();},e.prototype.checkEmpty=function(){var t=this.Adapter.isEmptyObject(this.waypoints.horizontal),e=this.Adapter.isEmptyObject(this.waypoints.vertical),i=this.element==this.element.window;t&&e&&!i&&(this.adapter.off(".waypoints"),delete n[this.key]);},e.prototype.createThrottledResizeHandler=function(){function t(){e.handleResize(),e.didResize=!1;}var e=this;this.adapter.on("resize.waypoints",function(){e.didResize||(e.didResize=!0,o.requestAnimationFrame(t));});},e.prototype.createThrottledScrollHandler=function(){function t(){e.handleScroll(),e.didScroll=!1;}var e=this;this.adapter.on("scroll.waypoints",function(){(!e.didScroll||o.isTouch)&&(e.didScroll=!0,o.requestAnimationFrame(t));});},e.prototype.handleResize=function(){o.Context.refreshAll();},e.prototype.handleScroll=function(){var t={},e={horizontal:{newScroll:this.adapter.scrollLeft(),oldScroll:this.oldScroll.x,forward:"right",backward:"left"},vertical:{newScroll:this.adapter.scrollTop(),oldScroll:this.oldScroll.y,forward:"down",backward:"up"}};for(var i in e){var n=e[i],o=n.newScroll>n.oldScroll,r=o?n.forward:n.backward;for(var s in this.waypoints[i]){var l=this.waypoints[i][s];if(null!==l.triggerPoint){var a=n.oldScroll<l.triggerPoint,h=n.newScroll>=l.triggerPoint,p=a&&h,u=!a&&!h;(p||u)&&(l.queueTrigger(r),t[l.group.id]=l.group);}}}for(var d in t)t[d].flushTriggers();this.oldScroll={x:e.horizontal.newScroll,y:e.vertical.newScroll};},e.prototype.innerHeight=function(){return this.element==this.element.window?o.viewportHeight():this.adapter.innerHeight()},e.prototype.remove=function(t){delete this.waypoints[t.axis][t.key],this.checkEmpty();},e.prototype.innerWidth=function(){return this.element==this.element.window?o.viewportWidth():this.adapter.innerWidth()},e.prototype.destroy=function(){var t=[];for(var e in this.waypoints)for(var i in this.waypoints[e])t.push(this.waypoints[e][i]);for(var n=0,o=t.length;o>n;n++)t[n].destroy();},e.prototype.refresh=function(){var t,e=this.element==this.element.window,i=e?void 0:this.adapter.offset(),n={};this.handleScroll(),t={horizontal:{contextOffset:e?0:i.left,contextScroll:e?0:this.oldScroll.x,contextDimension:this.innerWidth(),oldScroll:this.oldScroll.x,forward:"right",backward:"left",offsetProp:"left"},vertical:{contextOffset:e?0:i.top,contextScroll:e?0:this.oldScroll.y,contextDimension:this.innerHeight(),oldScroll:this.oldScroll.y,forward:"down",backward:"up",offsetProp:"top"}};for(var r in t){var s=t[r];for(var l in this.waypoints[r]){var a,h,p,u,d,f=this.waypoints[r][l],c=f.options.offset,w=f.triggerPoint,y=0,g=null==w;f.element!==f.element.window&&(y=f.adapter.offset()[s.offsetProp]),"function"==typeof c?c=c.apply(f):"string"==typeof c&&(c=parseFloat(c),f.options.offset.indexOf("%")>-1&&(c=Math.ceil(s.contextDimension*c/100))),a=s.contextScroll-s.contextOffset,f.triggerPoint=Math.floor(y+a-c),h=w<s.oldScroll,p=f.triggerPoint>=s.oldScroll,u=h&&p,d=!h&&!p,!g&&u?(f.queueTrigger(s.backward),n[f.group.id]=f.group):!g&&d?(f.queueTrigger(s.forward),n[f.group.id]=f.group):g&&s.oldScroll>=f.triggerPoint&&(f.queueTrigger(s.forward),n[f.group.id]=f.group);}}return o.requestAnimationFrame(function(){for(var t in n)n[t].flushTriggers();}),this},e.findOrCreateByElement=function(t){return e.findByElement(t)||new e(t)},e.refreshAll=function(){for(var t in n)n[t].refresh();},e.findByElement=function(t){return n[t.waypointContextKey]},window.onload=function(){r&&r(),e.refreshAll();},o.requestAnimationFrame=function(e){var i=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||t;i.call(window,e);},o.Context=e;}(),function(){"use strict";function t(t,e){return t.triggerPoint-e.triggerPoint}function e(t,e){return e.triggerPoint-t.triggerPoint}function i(t){this.name=t.name,this.axis=t.axis,this.id=this.name+"-"+this.axis,this.waypoints=[],this.clearTriggerQueues(),n[this.axis][this.name]=this;}var n={vertical:{},horizontal:{}},o=window.Waypoint;i.prototype.add=function(t){this.waypoints.push(t);},i.prototype.clearTriggerQueues=function(){this.triggerQueues={up:[],down:[],left:[],right:[]};},i.prototype.flushTriggers=function(){for(var i in this.triggerQueues){var n=this.triggerQueues[i],o="up"===i||"left"===i;n.sort(o?e:t);for(var r=0,s=n.length;s>r;r+=1){var l=n[r];(l.options.continuous||r===n.length-1)&&l.trigger([i]);}}this.clearTriggerQueues();},i.prototype.next=function(e){this.waypoints.sort(t);var i=o.Adapter.inArray(e,this.waypoints),n=i===this.waypoints.length-1;return n?null:this.waypoints[i+1]},i.prototype.previous=function(e){this.waypoints.sort(t);var i=o.Adapter.inArray(e,this.waypoints);return i?this.waypoints[i-1]:null},i.prototype.queueTrigger=function(t,e){this.triggerQueues[e].push(t);},i.prototype.remove=function(t){var e=o.Adapter.inArray(t,this.waypoints);e>-1&&this.waypoints.splice(e,1);},i.prototype.first=function(){return this.waypoints[0]},i.prototype.last=function(){return this.waypoints[this.waypoints.length-1]},i.findOrCreate=function(t){return n[t.axis][t.name]||new i(t)},o.Group=i;}(),function(){"use strict";function t(t){return t===t.window}function e(e){return t(e)?e:e.defaultView}function i(t){this.element=t,this.handlers={};}var n=window.Waypoint;i.prototype.innerHeight=function(){var e=t(this.element);return e?this.element.innerHeight:this.element.clientHeight},i.prototype.innerWidth=function(){var e=t(this.element);return e?this.element.innerWidth:this.element.clientWidth},i.prototype.off=function(t,e){function i(t,e,i){for(var n=0,o=e.length-1;o>n;n++){var r=e[n];i&&i!==r||t.removeEventListener(r);}}var n=t.split("."),o=n[0],r=n[1],s=this.element;if(r&&this.handlers[r]&&o)i(s,this.handlers[r][o],e),this.handlers[r][o]=[];else if(o)for(var l in this.handlers)i(s,this.handlers[l][o]||[],e),this.handlers[l][o]=[];else if(r&&this.handlers[r]){for(var a in this.handlers[r])i(s,this.handlers[r][a],e);this.handlers[r]={};}},i.prototype.offset=function(){if(!this.element.ownerDocument)return null;var t=this.element.ownerDocument.documentElement,i=e(this.element.ownerDocument),n={top:0,left:0};return this.element.getBoundingClientRect&&(n=this.element.getBoundingClientRect()),{top:n.top+i.pageYOffset-t.clientTop,left:n.left+i.pageXOffset-t.clientLeft}},i.prototype.on=function(t,e){var i=t.split("."),n=i[0],o=i[1]||"__default",r=this.handlers[o]=this.handlers[o]||{},s=r[n]=r[n]||[];s.push(e),this.element.addEventListener(n,e);},i.prototype.outerHeight=function(e){var i,n=this.innerHeight();return e&&!t(this.element)&&(i=window.getComputedStyle(this.element),n+=parseInt(i.marginTop,10),n+=parseInt(i.marginBottom,10)),n},i.prototype.outerWidth=function(e){var i,n=this.innerWidth();return e&&!t(this.element)&&(i=window.getComputedStyle(this.element),n+=parseInt(i.marginLeft,10),n+=parseInt(i.marginRight,10)),n},i.prototype.scrollLeft=function(){var t=e(this.element);return t?t.pageXOffset:this.element.scrollLeft},i.prototype.scrollTop=function(){var t=e(this.element);return t?t.pageYOffset:this.element.scrollTop},i.extend=function(){function t(t,e){if("object"==typeof t&&"object"==typeof e)for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i]);return t}for(var e=Array.prototype.slice.call(arguments),i=1,n=e.length;n>i;i++)t(e[0],e[i]);return e[0]},i.inArray=function(t,e,i){return null==e?-1:e.indexOf(t,i)},i.isEmptyObject=function(t){for(var e in t)return!1;return!0},n.adapters.push({name:"noframework",Adapter:i}),n.Adapter=i;}();

(function() {

  var breaker = {};

  var ArrayProto = Array.prototype,
      ObjProto = Object.prototype,
      FuncProto = Function.prototype;
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  _.closer = function(el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
  }; 

  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  _.identity = function(value) {
    return value;
  };

  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return obj;
    if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
    return obj;
  };

  _.some = _.any = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = false;
    if (obj == null) return result;
    _.each(obj, function(value, index, list) {
      if (result || (result = predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  _.find = _.detect = function(obj, predicate, context) {
    var result;
    _.some(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    _.each(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  _.extend = function(obj) {
    if (!_.isObject(obj)) return obj;
    _.each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    });
    return obj;
  };


  window._ = _;
}());

(function () {

if (typeof window.Element === "undefined" || "classList" in document.documentElement) return;

var prototype = Array.prototype,
    push = prototype.push,
    splice = prototype.splice,
    join = prototype.join;

function DOMTokenList(el) {
  this.el = el;
  var classes = el.className.replace(/^\s+|\s+$/g,'').split(/\s+/);
  for (var i = 0; i < classes.length; i++) {
    push.call(this, classes[i]);
  }
}

DOMTokenList.prototype = {
  add: function(token) {
    if(this.contains(token)) return;
    push.call(this, token);
    this.el.className = this.toString();
  },
  contains: function(token) {
    return Array.prototype.indexOf.call(this, token) != -1;
    // return this.el.className.indexOf(token) != -1;
  },
  item: function(index) {
    return this[index] || null;
  },
  remove: function(token) {
    if (!this.contains(token)) return;
    for (var i = 0; i < this.length; i++) {
      if (this[i] == token) break;
    }
    splice.call(this, i, 1);
    this.el.className = this.toString();
  },
  toString: function() {
    return join.call(this, ' ');
  },
  toggle: function(token) {
    if (!this.contains(token)) {
      this.add(token);
    } else {
      this.remove(token);
    }

    return this.contains(token);
  }
};

window.DOMTokenList = DOMTokenList;

function defineElementGetter (obj, prop, getter) {
    if (Object.defineProperty) {
        Object.defineProperty(obj, prop,{
            get : getter
        });
    } else {
        obj.__defineGetter__(prop, getter);
    }
}

defineElementGetter(Element.prototype, 'classList', function () {
  return new DOMTokenList(this);
});

})();


(function(root) {
  "use strict";

  var defheaders = {
    'x-requested-with': 'xmlhttprequest',
    'accept': 'application/json',
    'accept-language': 'en-US',
    'content-type': 'application/json'
  };

  function ajax(method, url, options) {
    if (!(this instanceof ajax)) return new ajax(method, url, options);
    this.init.apply(this, arguments);
    return this;
  }

  _.each(['GET', 'PUT', 'POST','DEL'], function(method) { 
    var smethod = method.toLowerCase();
    ajax[smethod] = function(url, options) {
      if (typeof url !== 'string') {
        options = url;
        url = root.location.pathname;
      }
      return ajax(method, url, options);
    };
  });

  _.extend(ajax.prototype, {
    init: function(method, url, options) {
      options = options || {};
      this.doneFn = (typeof options.ondone === 'function') ? options.ondone : (function(){}); 
      
      this.req = {};
      this.req.method = (method === 'DEL') ? 'DELETE' : method;
      this.req.url = url;
      this.req.headers = _.extend({}, defheaders, (options.headers ? options.headers : {}));

      this.res = {};
      this.res.req = this.req;
    },

    set: function(key, val) {
      this.req.headers[key.toLowerCase()] = val;
      return this;
    },

    send: function(val) {
      this.req.data = val;
      return this;
    },

    end: function(callback) {
      var that = this;
      var req = that.req;
      var res = that.res;

      var xhr = new XMLHttpRequest();
      xhr.open(req.method, req.url, true);
      req.xhr = res.xhr = xhr;

      _.each(req.headers, function(val, key) {
        xhr.setRequestHeader(key, val);
      });

      var data = null;
      if (typeof req.data == 'object') {
        if (req.headers['content-type'].indexOf('application/json') !== -1) {
          data = JSON.stringify(req.data);
        }
        else {
          var pairs = [];
          _.each(req.data, function(val, key) {
            pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
          });
          data = pairs.join('&');
        }
      }

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          res.headers = {};
          var lines = xhr.getAllResponseHeaders().split("\r\n");
          _.each(lines, function(line) {
            line = line.trim();
            if (!line.length) return;
            var pair = line.split(':');
            var key = pair[0].toLowerCase().trim();
            var val = pair[1].trim();
            res.headers[key] = val;
          });
          if (req.headers['content-type']) {
            res.isJson = req.headers['content-type'].indexOf('application/json') !== -1;
            res.isHtml = req.headers['content-type'].indexOf('text/html') !== -1;
          }
          var err = null;
          if (xhr.status === 200) {
            res.body = res.isJson ? that.parse(xhr) : xhr.responseText;
          } else {
            err = new Error('failed with statusCode: ' + xhr.status);
          }
          callback && callback(err, res);
        }
      };

      xhr.send(data);
      return that;
    },

    parse: function(xhr) {
      var result;
      try {
        result = JSON.parse(xhr.responseText);
      } catch (ex) {
        result = xhr.responseText;
      }
      return result;
    },
  });

  if (typeof define == 'function' && define.amd) {
    define([], function() { return ajax });
  } else {
    root.ajax = ajax;
  }
}(window || window));

var sidebar = document.getElementById("sidebar");
var tryOut = document.getElementById("try-out");
var content = document.getElementById("content");

function highlightCode() {
  var codes = document.querySelectorAll("code");
  for (var n = 0; n < codes.length; n++)
      Prism.highlightElement(codes[n]);
}


function groupOnClick(el) {
  var selGroup = sidebar.querySelector(".group.expand");
  if (selGroup && selGroup != el.parentNode) {
    selGroup.classList.remove("expand");
  }
  el.parentNode && el.parentNode.classList.add("expand");
}

function subgroupOnClick(el) {
  var selGroup = sidebar.querySelector(".group.expand");
  var newGroup = el.parentNode && el.parentNode.parentNode;
  if (selGroup && selGroup != newGroup){
    selGroup.classList.remove("expand");
  }
  newGroup.classList.add("expand");

  var selEndpoint = sidebar.querySelector(".highlight");
  if (selEndpoint && selEndpoint != el) {
    selEndpoint.classList.remove('highlight');
  }
  el.classList.add("highlight");
}

function waypointHandler() {
  var navEl = sidebar.querySelector("a[href=\"#"+ this.element.id + "\"]");
  if (navEl.classList.contains("group")) {
    groupOnClick(navEl);
  } else if (navEl.classList.contains("subgroup")) {
    subgroupOnClick(navEl);
  }
}

function insertTryOutHeaders(num, tabSection, tabTemplate) {
  var headers = tryOut.querySelector('.' + tabSection);
  while(num > 0) {
    var div = document.createElement('div');
    div.innerHTML = tryOut.querySelector('#' + tabTemplate).innerHTML;
    headers.appendChild(div.querySelector('.input-row'));
    num--;
  }
}

function removeTryOutHeaders() {
  var headers = tryOut.querySelector('.headers-tab');
  var rows = headers.querySelectorAll('.input-row');
  
  for (var r = 1; r < rows.length; r++) {
    headers.removeChild(rows[r]);
  }
  headers = tryOut.querySelector('.parameters-tab');
  rows = headers.querySelectorAll('.input-row');
  
  for (var r = 1; r < rows.length; r++) {
    headers.removeChild(rows[r]);
  }
}

function initTryout(data) {
  var httpMeta = document.getElementById("try-http-meta");
  var requestData = document.getElementById("try-request-data");

  httpMeta.elements['method'].value = data.method;
  httpMeta.elements['url'].value = data.url;

  if (data.requestHeaders.length > 1) {
    insertTryOutHeaders(data.requestHeaders.length - 1, 'headers-tab', 'header-row-template');
    data.requestHeaders.forEach(function(h, index) {
      requestData.elements['h-key'][index].value = data.requestHeaders[index]['name'] || '';
      requestData.elements['h-value'][index].value = data.requestHeaders[index]['value'] || '';
    });
  } else if (data.requestHeaders.length === 1) {
    requestData.elements['h-key'].value = data.requestHeaders[0]['name'] || '';
    requestData.elements['h-value'].value = data.requestHeaders[0]['value'] || '';
  }
  data.parameters = data.queryParameters.concat(data.urlParameters);
  if (data.parameters.length > 1) {
    insertTryOutHeaders(data.parameters.length - 1, 'parameters-tab', 'parameter-row-template');
    data.parameters.forEach(function(h, index) {
      requestData.elements['p-key'][index].value = data.parameters[index]['name'] || '';
      requestData.elements['p-value'][index].value = data.parameters[index]['value'] || '';
    });
  } else if (data.parameters.length === 1) {
    requestData.elements['p-key'].value = data.parameters[0]['name'] || '';
    requestData.elements['p-value'].value = data.parameters[0]['value'] || '';
  } 

  requestData.elements['req-body'].value = data.requestBody || '';
}

function getHeaders(tabSection) {
  var headers = tryOut.querySelector('.' + tabSection);
  var rows = headers.querySelectorAll('.input-row');
  var values = [];

  for (var r = 0; r < rows.length; r++) {
    if (rows[r].querySelector('input.key').value) {
      values.push({
        name: rows[r].querySelector('input.key').value,
        value: rows[r].querySelector('input.value').value,
      });
    }
  }

  return values

}

window.onload = function () {
  var toBeFetched = document.querySelectorAll(".row.not-fetched");
  for (var t = 0; t < toBeFetched.length; t++) {
    if (toBeFetched[t].id) {
      toBeFetched[t].fetchCallback = (function(el) {
        return function(err, res) {
          if (!err && res.body) {
            res.body.htmlString && (el.innerHTML = res.body.htmlString);
            var sectionData = res.body.sectionData;
            if (sectionData && sectionData.id) {
              window.__ENDPOINTS[sectionData.id] = sectionData;
            }
            var codes = el.querySelectorAll("code");
            for (var n = 0; n < codes.length; n++)
                Prism.highlightElement(codes[n]);
          }
        }
      })(toBeFetched[t]);
      ajax.get('/docs/section?type=' + toBeFetched[t].getAttribute('data-type') + '&id=' + toBeFetched[t].getAttribute('data-id')) 
          .end(toBeFetched[t].fetchCallback);
    }
  }

  highlightCode();
  sidebar.addEventListener('click', function(event) {
    event.stopPropagation();
   // event.preventDefault()
    var target = event.target;
    var clist = target.classList;
    if (clist.contains('sidebar-nav-item') && clist.contains('expandable')) {
      var selected = sidebar.querySelector('.group.expand');
      var l = target.parentNode;
      if (selected && selected !== l) {
        selected.classList.remove('expand');
      } 
      l.classList.add('expand');
    } else if (clist.contains('subgroup')) {
      subgroupOnClick(target);
    } 
  });

  // window.addEventListener('hashchange', function(event) {
  //   event.preventDefault();
  // }, false)

  var rows = document.querySelectorAll('#content section.row');
  for (var t = 0; t < rows.length; t++) {
    new Waypoint({
      continuous: false,
      context: document.getElementById('content'),
      element: rows[t],
      handler: waypointHandler
    });
  }

  tryOut.addEventListener('click', function(event) {
    event.stopPropagation();
    event.preventDefault();
    var target = event.target;
    var clist = target.classList;
    if (clist.contains('tab-menu-item')) {
      var tab = tryOut.querySelector('.tab');
      var selectedTab = tryOut.querySelector('.tab-menu-item.selected');
      if (selectedTab && selectedTab !== target) {
        tab.classList.remove(selectedTab.getAttribute('data-header'));
        selectedTab.classList.remove('selected');
      }
      tab.classList.add(target.getAttribute('data-header'));
      target.classList.add('selected');
    } else if (clist.contains('add-row')) {
      var tabSection = tryOut.querySelector('.' + target.getAttribute('data-parent'));
      var parentNode = target.parentNode;
      var div = document.createElement('div');
      div.innerHTML = tryOut.querySelector('#' + target.getAttribute('data-template')).innerHTML;
      if (parentNode.nextSibling)
        tabSection.insertBefore(div.querySelector('.input-row'), parentNode.nextSibling);
      else
        tabSection.appendChild(div.firstChild);
    } else if (clist.contains('del-row')) {
      var tabSection = tryOut.querySelector('.' + target.getAttribute('data-parent'));
      var parentNode = target.parentNode;
      tabSection.removeChild(parentNode);
    } else if (clist.contains('close-try-out')) {
      sidebar.classList.remove('try-out');
      var httpMeta = document.getElementById("try-http-meta");
      var requestData = document.getElementById("try-request-data");
      var responseData = document.getElementById("try-response-data");
      httpMeta.reset();
      requestData.reset();
      responseData.reset();
      removeTryOutHeaders();
    } else if (clist.contains('try-out-send')) {
      var httpMeta = document.getElementById("try-http-meta");
      var requestData = document.getElementById("try-request-data");
      var responseData = document.getElementById("try-response-data");
      var parameters = getHeaders('parameters-tab');
      var url = httpMeta.elements['url'].value;
      parameters.forEach(p => {
        url = url.replace('{' + p.name + '}', p.value);
      });
      var postData = {
        hostName: window.APIHOSTNAME, 
        protocol: window.APIPROTOCOL,
        method: httpMeta.elements['method'].value,
        url: url,
        requestHeaders: getHeaders('headers-tab'),
      };
      ajax.post('/docs/tryout').send(postData) 
          .end(function(err, res) {
            if (!err && res.body) {
              try {
                responseData.elements["res-body"].value =  JSON.stringify(JSON.parse(res.body.data), 0 , 4);
              } catch (e) {
                responseData.elements["res-body"].value =  res.body.data;
              }
            }
          });
    }
  });

  content.addEventListener('click', function(event) {
    event.stopPropagation();
    event.preventDefault();
    var target = event.target;
    var clist = target.classList;
    if (clist.contains('try-btn')) {
      var section = _.closer(target, 'row');
      var endpointData = window.__ENDPOINTS[section.getAttribute('data-id')];

      initTryout(endpointData);
      sidebar.classList.add('try-out');
    } else if (clist.contains('show-child-attr')) {
      target.parentNode.classList.add('show-child');
    } else if (clist.contains('hide-child-attr')) {
      target.parentNode.classList.remove('show-child');
    }
  });
};

}());
