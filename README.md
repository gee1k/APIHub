### 妹子图

#### 首页（最新）

举例: http://127.0.0.1:1200/mzitu
举例 2: http://127.0.0.1:1200/mzitu/2

路由: `/mzitu/`
路由: `/mzitu/:page`

参数: page，页码[可选，默认第一页]

#### 分类

举例: http://127.0.0.1:1200/mzitu/category/hot
举例 2: http://127.0.0.1:1200/mzitu/category/hot/3

路由: `/mzitu/category/:category`
路由: `/mzitu/category/:category/:page`

参数
category，分类名
page，页码[可选，默认第一页]

| 热门 | 推荐 | 性感妹子 | 日本妹子 | 台湾妹子 | 清纯妹子 |
| ---- | ---- | -------- | -------- | -------- | -------- |
| hot  | best | xinggan  | japan    | taiwan   | mm       |

#### 所有专题

举例: http://127.0.0.1:1200/mzitu/tags

路由: `/mzitu/tags`

#### 专题详情

举例: http://127.0.0.1:1200/mzitu/tag/shishen
举例 2: http://127.0.0.1:1200/mzitu/tag/shishen/2

路由: `/mzitu/tag/:tag`
路由: `/mzitu/tag/:tag/:page`

参数
tag，专题名 `通过获取所有专题接口获取`
page，页码[可选，默认第一页]

#### 详情

举例: http://127.0.0.1:1200/mzitu/129452

路由: `/mzitu/:id`

参数: id，详情 id `直接将地址栏最后一串数字复制`

# TODO

* 自拍
* 全部
