# 用户管理 API

## 公共数据结构

### UserInfo

包含用户的基本信息。

| 字段名称 | 类型   | 描述     | 示例值       |
| -------- | ------ | -------- | ------------ |
| id       | Number | 用户 ID  | 123          |
| name     | String | 用户姓名 | 张三         |
| email    | String | 用户邮箱 | zhangsan@... |

### AddressInfo

包含用户的地址信息。

| 字段名称 | 类型   | 描述 | 示例值     |
| -------- | ------ | ---- | ---------- |
| province | String | 省份 | 北京市     |
| city     | String | 城市 | 北京市     |
| street   | String | 街道 | 中关村大街 |

## 接口列表

### 1. 获取用户列表

**Endpoint:** `/users`
**描述:** 获取所有用户的列表。

**请求参数:**

| 参数名称   | 类型           | 是否必填 | 描述                          | 示例值                     |
| ---------- | -------------- | -------- | ----------------------------- | -------------------------- |
| userId     | Number         | 是       | 用户的唯一标识符              | 123                        |
| page       | Number         | 否       | 页码，默认为 1                | 1                          |
| pageSize   | Number         | 否       | 每页返回的数据条数，默认为 10 | 20                         |
| searchText | String         | 否       | 搜索关键词                    | "产品名称"                 |
| filters    | Object         | 否       | 筛选条件，JSON 对象           | `{"category": "电子产品"}` |
| productIds | Array\<Number> | 否       | 需要查询的产品 ID 列表        | `[1, 2, 3]`                |
| imageFile  | File           | 否       | 上传的图片文件                | (binary data)              |

**返回数据:**

| 字段名称 | 类型             | 描述                    | 示例值 |
| -------- | ---------------- | ----------------------- | ------ |
| data     | Array\<UserInfo> | UserInfo 结构的数组列表 | -      |
