# 模型管理 API

## 公共数据结构

### Model

包含模型的基本信息。

| 字段名称 | 类型   | 描述                    | 示例值                                       |
| -------- | ------ | ----------------------- | -------------------------------------------- |
| id       | Number | 模型的唯一标识符        | 123                                          |
| name     | String | 模型的名称              | "GPT-3.5"                                    |
| url      | String | 模型的 API 接口地址     | "https://api.openai.com/v1/chat/completions" |
| apiKey   | String | 访问模型 API 所需的密钥 | "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"        |

## 接口列表

### 1. 创建模型

**Endpoint:** `model-create`
**描述:** 创建新的模型配置

**请求参数:**

| 参数名称 | 类型   | 是否必填 | 描述         | 示例值                                       |
| -------- | ------ | -------- | ------------ | -------------------------------------------- |
| name     | String | 是       | 模型名称     | "GPT-3.5"                                    |
| url      | String | 是       | API 接口地址 | "https://api.openai.com/v1/chat/completions" |
| apiKey   | String | 是       | API 密钥     | "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"        |

**返回数据:** 无

### 2. 更新模型

**Endpoint:** `model-update`
**描述:** 更新现有模型的配置信息

**请求参数:**

| 参数名称 | 类型   | 是否必填 | 描述         | 示例值                                       |
| -------- | ------ | -------- | ------------ | -------------------------------------------- |
| id       | Number | 是       | 模型 ID      | 123                                          |
| name     | String | 是       | 模型名称     | "GPT-3.5"                                    |
| url      | String | 是       | API 接口地址 | "https://api.openai.com/v1/chat/completions" |
| apiKey   | String | 是       | API 密钥     | "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"        |

**返回数据:** 无

### 3. 删除模型

**Endpoint:** `model-delete`
**描述:** 删除指定的模型配置

**请求参数:**

| 参数名称 | 类型   | 是否必填 | 描述    | 示例值 |
| -------- | ------ | -------- | ------- | ------ |
| id       | Number | 是       | 模型 ID | 123    |

**返回数据:** 无

### 4. 获取模型列表

**Endpoint:** `model-get-list`
**描述:** 分页查询模型列表，支持关键词搜索

**请求参数:**

| 参数名称  | 类型   | 是否必填 | 描述       | 示例值 |
| --------- | ------ | -------- | ---------- | ------ |
| pageIndex | Number | 是       | 页码       | 1      |
| pageSize  | Number | 是       | 每页数量   | 10     |
| keyword   | String | 否       | 搜索关键词 | "GPT"  |

**返回数据:**

| 字段名称 | 类型         | 描述                 | 示例值 |
| -------- | ------------ | -------------------- | ------ |
| data     | Array<Model> | Model 结构的数组列表 | -      |

### 5. 获取模型详情

**Endpoint:** `model-get-detail`
**描述:** 获取指定模型的详细信息

**请求参数:**

| 参数名称 | 类型   | 是否必填 | 描述    | 示例值 |
| -------- | ------ | -------- | ------- | ------ |
| id       | Number | 是       | 模型 ID | 123    |

**返回数据:**

| 字段名称 | 类型  | 描述         | 示例值 |
| -------- | ----- | ------------ | ------ |
| data     | Model | 模型详情信息 | -      |
