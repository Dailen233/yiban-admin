# 第三方服务配置说明

## 问题说明

如果您在运行项目时遇到以下错误：
```
APP被您禁用啦。详情查看：http://lbsyun.baidu.com/apiconsole/key#
```

这是因为项目模板中包含了百度地图API的示例代码，但使用的API密钥已被禁用。

## 解决方案

### 方案一：不使用百度地图（推荐）

如果您的项目不需要地图功能，错误已经通过移除相关脚本解决。

### 方案二：配置有效的百度地图API

如果您需要使用百度地图功能：

1. **申请百度地图API密钥**
   - 访问 [百度地图开放平台](https://lbsyun.baidu.com/)
   - 注册账号并申请API密钥
   - 获取您的API Key

2. **配置API密钥**
   
   在 `index.html` 中取消注释百度地图脚本并替换API密钥：
   ```html
   <script type="text/javascript" src="https://api.map.baidu.com/api?v=3.0&ak=YOUR_API_KEY_HERE&s=1"></script>
   ```

3. **环境变量配置**
   
   您也可以通过环境变量来管理API密钥：
   
   在 `.env.production` 中添加：
   ```bash
   VITE_BAIDU_MAP_AK=your_actual_api_key
   VITE_ENABLE_BAIDU_MAP=true
   ```

### 方案三：配置百度统计

如果您需要网站统计功能：

1. **申请百度统计**
   - 访问 [百度统计](https://tongji.baidu.com/)
   - 添加您的网站并获取统计代码

2. **配置统计代码**
   
   在 `index.html` 中取消注释统计脚本并替换统计ID：
   ```html
   <script type="text/javascript">
       var _hmt = _hmt || [];
       (function () {
           var hm = document.createElement('script');
           hm.src = 'https://hm.baidu.com/hm.js?YOUR_ANALYTICS_ID_HERE';
           var s = document.getElementsByTagName('script')[0];
           s.parentNode.insertBefore(hm, s);
       })();
   </script>
   ```

## 最佳实践

1. **开发环境**: 建议关闭所有第三方服务以避免不必要的网络请求
2. **生产环境**: 根据实际需求启用相应的服务
3. **API密钥安全**: 不要将API密钥直接提交到代码仓库，使用环境变量管理

## 其他替代方案

如果不想使用百度地图，可以考虑以下替代方案：
- **高德地图**: 提供类似的地图服务
- **腾讯地图**: 腾讯提供的地图解决方案
- **OpenStreetMap**: 开源地图解决方案
- **Google Maps**: 国外项目可考虑

## 注意事项

- 百度地图API在海外访问可能受限
- 请确保API密钥的域名白名单配置正确
- 生产环境建议启用HTTPS以保证API调用安全
