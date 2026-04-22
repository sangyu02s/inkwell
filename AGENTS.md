# Inkwell 项目信息

## 项目概述

- **名称**: Inkwell（墨池）
- **类型**: 博客平台（前后端分离）
- **描述**: 一个简洁的博客系统，支持用户注册登录、发布/编辑/删除博文
- **作者**: sangyu (sakura@gmail.com)
- **技术栈**: Spring Boot 3.2 + React + Vite + H2

## 技术栈详情

### Backend
- **框架**: Spring Boot 3.2.3
- **语言**: Java 21
- **数据库**: H2（内存数据库，`ddl-auto=create-drop`，每次启动重建）
- **认证**: JWT（HS512），httpOnly Cookie
- **安全**: Spring Security 6
- **ORM**: Spring Data JPA + Hibernate 6
- **构建**: Maven 3.9

### Frontend
- **框架**: React 18 + TypeScript
- **路由**: React Router v6
- **状态**: TanStack Query v5
- **构建**: Vite 8
- **样式**: 纯 CSS（index.css + 组件级 CSS）

## 项目结构

```
inkwell/
├── backend/src/main/java/com/blog/
│   ├── BlogApplication.java          # 启动入口
│   ├── entity/
│   │   ├── User.java                # 用户实体（username, email, password_hash）
│   │   └── Ink.java                 # 博客实体（title, content, author_id/author_username）
│   ├── repository/
│   │   ├── UserRepository.java      # 用户查询
│   │   └── InkRepository.java       # 博客 CRUD + 分页
│   ├── service/
│   │   ├── AuthService.java         # 注册/登录
│   │   └── InkService.java          # 博客 CRUD
│   ├── controller/
│   │   ├── AuthController.java      # /api/auth/* (register, login, me, logout)
│   │   └── InkController.java       # /api/inks/* (CRUD + 分页)
│   ├── config/
│   │   ├── SecurityConfig.java      # Spring Security 配置
│   │   ├── JwtAuthenticationFilter.java  # JWT 解析过滤器
│   │   └── UserPrincipal.java       # 安全主体
│   ├── util/
│   │   └── JwtUtils.java            # JWT 工具类
│   └── exception/
│       └── GlobalExceptionHandler.java  # 统一异常处理
├── frontend/src/
│   ├── App.tsx                      # 路由配置
│   ├── contexts/AuthContext.tsx      # 认证上下文（登录状态管理）
│   ├── api/inks.ts                  # API 调用层
│   ├── pages/
│   │   ├── InkListPage.tsx          # 列表页（公开）
│   │   ├── InkDetailPage.tsx        # 详情页（公开）
│   │   ├── InkFormPage.tsx          # 编辑/新建页（需登录）
│   │   └── auth/LoginPage.tsx / RegisterPage.tsx
│   ├── components/
│   │   ├── Navigation.tsx + .css    # 导航栏（Login 按钮 / 用户名下拉）
│   │   ├── ProtectedRoute.tsx       # 登录保护
│   │   └── ErrorBoundary.tsx        # 错误边界
│   └── index.css                    # 全局样式（按钮、卡片、布局等）
└── data.sql                         # H2 预置数据（用户 + 14篇散文）
```

## 核心功能

| 功能 | 路径 | 说明 |
|------|------|------|
| 浏览博客列表 | `GET /` | 公开，分页，每页20条 |
| 查看博客详情 | `GET /inks/:id` | 公开，显示完整内容 |
| 新建博客 | `POST /inks/new` | 需登录 |
| 编辑博客 | `PUT /inks/:id/edit` | 仅作者可编辑 |
| 删除博客 | `DELETE /inks/:id` | 仅作者可删除 |
| 注册 | `POST /api/auth/register` | 返回 JWT + 设置 httpOnly Cookie |
| 登录 | `POST /api/auth/login` | 返回 JWT + 设置 httpOnly Cookie |
| 当前用户 | `GET /api/auth/me` | 需 Cookie，自动解析 JWT |
| 登出 | `POST /api/auth/logout` | 清除 Cookie |

## 权限规则

- 博客列表/详情：**公开**，无需登录
- 新建/编辑/删除：**需登录**，且仅作者可操作
- 编辑/删除按钮在列表和详情页根据 `authorId` 显示

## 预置数据

### 用户
| Username | Email | Password |
|----------|-------|----------|
| sakura | sakura@gmail.com | 12345678 |

### 博文（共14篇）
- 《花树下》- 完整散文（约400字，置顶）
- 其他13篇短散文（春的消息、荷塘月色、童年夏日等）

## 启动方式

### Backend（端口 8080）
```bash
cd /Users/sangyu/mine/workspace/code/java/inkwell/backend
/Users/sangyu/DevTools/apache-maven-3.9.14/bin/mvn spring-boot:run -q
# 或后台运行
nohup /Users/sangyu/DevTools/apache-maven-3.9.14/bin/mvn spring-boot:run -q > /tmp/inkwell.log 2>&1 &
```

### Frontend（端口 5173）
```bash
cd /Users/sangyu/mine/workspace/code/java/inkwell/frontend
npm run dev
```

### 重启 Backend（清空 H2 数据库）
```bash
lsof -ti :8080 | xargs kill -9 2>/dev/null
sleep 2
cd /Users/sangyu/mine/workspace/code/java/inkwell/backend
nohup /Users/sangyu/DevTools/apache-maven-3.9.14/bin/mvn spring-boot:run -q > /tmp/inkwell.log 2>&1 &
sleep 8
# 验证
curl -s http://localhost:8080/api/inks | python3 -c "import sys,json; print(f'inks:', json.load(sys.stdin)['totalElements'])"
```

## 注意事项

- H2 是内存数据库，`spring.jpa.hibernate.ddl-auto=create-drop`，重启后数据清空，`data.sql` 会自动重新执行
- JWT 存储在 httpOnly Cookie 中，前端通过 `AuthContext` 维护登录状态
- 前端构建: `npm run build`（产物在 `dist/`）
- Git 已连接 GitHub，main 分支