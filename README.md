# hexo-image
根据markdown文件中图片的相对路径，将图片部署到应用的对应位置。

## Usage

在hexo根目录下，执行 `npm install https://github.com/liuchuanv/hexo-image.git --save`

## Example

`\source\_posts\210-Java\JavaSE\ThreadLocal 理解.md` 中含有一个图片

```markdown
...
类`ThreadLocal`的结构如下：
![类`ThreadLocal`的结构](./imgs/ThreadLocal理解1.png)
...
```

图片位置：`\source\_posts\210-Java\JavaSE\imgs\ThreadLocal理解1.png`



hexo-image 插件会检索md文件中的图片路径，并把图片复制到相对应的应用目录中。



**简单的说，在本地和发布之后的图片路径不用改变就可以正常访问。**



## 和 post_asset_folder 的区别

开启 post_asset_folder 后，在发布应用时，hexo会将md文件目录中的同名的文件夹复制到相对应的应用目录中。

hexo-asset、hexo-asset-image 插件只是在此基础上改变了图片显示路径，并**没有改变图片路径依赖md文件名**的情况。