# Inkwell（墨池）

> **100% AI 生成代码** — 本项目从设计到实现完全由 [OpenCode](https://opencode.ai) + [OpenSpec](https://openspec.dev) 工作流驱动的 AI（MiniMax-M2.7 模型）自动生成。

## 功能

- 浏览、发布、编辑、删除博客文章
- 用户注册与登录（JWT + httpOnly Cookie）
- 响应式布局，移动端友好

## 技术栈

- **后端**: Spring Boot 3.2 · Java 21 · H2 · JWT
- **前端**: React 18 · TypeScript · Vite · TanStack Query

## 快速启动

```bash
# 后端（端口 8080）
cd backend && mvn spring-boot:run

# 前端（端口 5173）
cd frontend && npm run dev
```

## 预置账号

| 用户名 | 邮箱 | 密码 |
|--------|------|------|
| sakura | sakura@gmail.com | 12345678 |

## 项目结构

```
inkwell/
├── backend/          # Spring Boot API
├── frontend/         # React + Vite
└── AGENTS.md        # 开发者上下文（启动方式、架构说明）
```