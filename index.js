var fs = require('hexo-fs');

hexo.extend.filter.register('after_post_render', function(data){
	// post.path=2019/10/11/210-Java/JavaSE/ThreadLocal 理解/
	// post.source=_posts/210-Java/JavaSE/ThreadLocal 理解.md
	// post.slug=210-Java/JavaSE/ThreadLocal 理解
	// post.asset_dir=E:\MyBlog\source\_posts\210-Java\JavaSE\ThreadLocal 理解\
	// console.log("post.path=" + data.path);
	// console.log("post.source=" + data.source);
	// console.log("post.slug=" + data.slug);
	// console.log("post.asset_dir=" + data.asset_dir);

	// post源目录
	var postSrcDir = removeLastLevelDir(data.asset_dir),
		// post目标目录
		postDestDir = data.path;

	// 获取markdown文本中的图片
	var imgArr = getMarkdownImgs(data._content);
	for (var i=0; i<imgArr.length; i++) {
		// 当图片不以根目录开头时
		if (!imgArr[i].startsWith("/")) {
			var imgSrcPath = getRealPath(postSrcDir, imgArr[i].src);
			var imgDestPath = getRealPath(hexo.public_dir + "/" + postDestDir, imgArr[i].src);
			// console.log("图片源路径：" + imgSrcPath);
			// console.log("图片目标路径：" + imgDestPath);
			// 复制图片
			fs.copyFile(imgSrcPath, imgDestPath);
		}
	}
	return data;
});


/**
 * 去掉最后一级目录
 * 比如： 传入参数 C:\1\2\3\ ，返回 C:/1/2
 * @param d
 * @returns {*}
 */
function removeLastLevelDir(d) {
	var dir = d.replace(/\\/g, '/');
	var dirArray = dir.split('/').filter(function(elem){
		return elem != '' && elem != '.';
	});
	if (dirArray.length > 0) {
		dirArray.pop();
	}
	return dirArray.join('/');
}

/**
 * 获取 markdown 文本中的图片信息
 * @param markdownContent
 * @returns {Array} [{alt, src}, ...]
 */
function getMarkdownImgs(markdownContent) {
	var arr = [];
	var imgReg = /\!\[[^\]]*\]\([^\)]*\)/g;
	var imgs = markdownContent.match(imgReg) || [];
	for (var i=0; i<imgs.length; i++) {
		var imgText = imgs[i];
		// 获取图片alt标题
		var startPos = imgText.lastIndexOf("[") + 1;
		var endPos = imgText.lastIndexOf("]");
		var imgAlt = imgText.substring(startPos, endPos);

		// 获取图片地址
		startPos = imgText.lastIndexOf("(") + 1;
		endPos = imgText.lastIndexOf(")");
		var imgSrc = imgText.substring(startPos, endPos);

		// 保存
		arr.push({
			'alt': imgAlt,
			'src': imgSrc
		});
	}
	return arr;
}


/**
 *  获取真实路径
 * 例子1：
 *  postSrcDir='E:\MyBlog\source\_posts\210-Java\JavaSE'
 *  imgSrc='./imgs/1.jpg'
 *  返回：E:/MyBlog/source/_posts/210-Java/JavaSE/imgs/1.jpg
 *
 *  例子2：
 *  postSrcDir='E:\MyBlog\source\_posts\210-Java\JavaSE'
 *  imgSrc='../../imgs/1.jpg'
 *  返回：E:/MyBlog/source/_posts/imgs/1.jpg
 * @param parentDir 父路径
 * @param relativePath 相对路径
 * @returns {string}
 */
function getRealPath(parentDir, relativePath) {
	// 转换分隔符
	parentDir = parentDir.replace(/\\/g, '/');
	relativePath = relativePath.replace(/\\/g, '/');

	var s = parentDir + '/' + relativePath;
	// 过滤掉'//' 和 '/./' 情况
	var arr = s.split('/').filter(function(elem){
		return elem != '' && elem != '.';
	});
	// 处理 '/../' 情况
	while(arrayIndexOf(arr, '..') > -1){
		var index = arrayIndexOf(arr, '..') - 1;
		if (index < 0 || !arr[index]) break;
		arr.splice(index, 2);
	}
	return arr.join('/')
}

function arrayIndexOf(arr, item) {
	if(Array.prototype.indexOf) {
		return arr.indexOf(item);
	} else {
		for(var i=0;i<arr.length;i++) {
			if(arr[i]==item) {
				return i;
			}
		}
	}
	return -1;
}