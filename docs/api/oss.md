# OSS 管理 API

## 公共数据结构

### OSSAccount

包含 OSS 账户的基本配置信息。

| 字段名称        | 类型   | 描述                 | 示例值                   |
| --------------- | ------ | -------------------- | ------------------------ |
| accessKeyId     | String | 访问密钥 ID          | "LTAI4XXXXXXXXXXXXXXXXX" |
| accessKeySecret | String | 访问密钥密码         | "ZXxxxxxxxxxxxxxxxxxxxx" |
| bucket          | String | OSS 存储桶名称       | "my-bucket"              |
| region          | String | OSS 存储桶所在的地域 | "oss-cn-hangzhou"        |

## 接口列表

### 1. 添加 OSS 账户

**Endpoint:** `oss-add-account`
**描述:** 添加或更新 OSS 账户配置信息。

**请求参数:**

| 参数名称        | 类型   | 是否必填 | 描述                 | 示例值                   |
| --------------- | ------ | -------- | -------------------- | ------------------------ |
| accessKeyId     | String | 是       | 访问密钥 ID          | "LTAI4XXXXXXXXXXXXXXXXX" |
| accessKeySecret | String | 是       | 访问密钥密码         | "ZXxxxxxxxxxxxxxxxxxxxx" |
| bucket          | String | 是       | OSS 存储桶名称       | "my-bucket"              |
| region          | String | 是       | OSS 存储桶所在的地域 | "oss-cn-hangzhou"        |

**返回数据:**

| 字段名称 | 类型    | 描述     | 示例值 |
| -------- | ------- | -------- | ------ |
| data     | Boolean | 操作结果 | true   |

### 2. 验证 OSS 账户

**Endpoint:** `oss-validate-account`
**描述:** 验证 OSS 账户配置是否有效。

**请求参数:**

| 参数名称        | 类型   | 是否必填 | 描述                 | 示例值                   |
| --------------- | ------ | -------- | -------------------- | ------------------------ |
| accessKeyId     | String | 是       | 访问密钥 ID          | "LTAI4XXXXXXXXXXXXXXXXX" |
| accessKeySecret | String | 是       | 访问密钥密码         | "ZXxxxxxxxxxxxxxxxxxxxx" |
| bucket          | String | 是       | OSS 存储桶名称       | "my-bucket"              |
| region          | String | 是       | OSS 存储桶所在的地域 | "oss-cn-hangzhou"        |

**返回数据:**

| 字段名称 | 类型    | 描述         | 示例值 |
| -------- | ------- | ------------ | ------ |
| data     | Boolean | 验证是否通过 | true   |

### 3. 上传文件

**Endpoint:** `oss-upload-file`
**描述:** 上传文件到 OSS 存储。

**请求参数:**

| 参数名称   | 类型   | 是否必填 | 描述             | 示例值              |
| ---------- | ------ | -------- | ---------------- | ------------------- |
| filePath   | String | 是       | 本地文件路径     | "/path/to/file.jpg" |
| objectName | String | 是       | OSS 中的对象名称 | "images/file.jpg"   |

**返回数据:**

| 字段名称 | 类型    | 描述     | 示例值 |
| -------- | ------- | -------- | ------ |
| data     | Boolean | 操作结果 | true   |

### 4. 删除文件

**Endpoint:** `oss-delete-file`
**描述:** 删除 OSS 中的文件。

**请求参数:**

| 参数名称   | 类型   | 是否必填 | 描述             | 示例值            |
| ---------- | ------ | -------- | ---------------- | ----------------- |
| objectName | String | 是       | OSS 中的对象名称 | "images/file.jpg" |

**返回数据:**

| 字段名称 | 类型    | 描述     | 示例值 |
| -------- | ------- | -------- | ------ |
| data     | Boolean | 操作结果 | true   |
