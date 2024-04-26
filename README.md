# identity-access.com
ユーザー認証/認可を行う Web アプリのテンプレートプロジェクト。
バックエンドのユーザー認証/認可 API として [gtaiyou24/identity-access](https://github.com/gtaiyou24/identity-access) を利用します。

```bash
git clone https://github.com/gtaiyou24/identity-access.com.git [プロジェクト名]
```

参考文献:

 - [Next.js (Auth.js) と Backend API によるメールアドレス認証の実装例](https://zenn.dev/taiyou/articles/d3f5fea29299c7)
 - [Next.js (Auth.js) と Backend API による OAuth2 認証の実装例](https://zenn.dev/taiyou/articles/147e0a63d236d5)

## 📁Library

 - <img src="https://headlessui.com/favicon.ico" width="16" alt="Headless UI"> <a href="https://headlessui.com/">Headless UI</a>
 - <img src="https://ui.shadcn.com/favicon.ico" width="16" alt="shadcn/ui"> <a href="https://ui.shadcn.com/">shadcn/ui</a>
 - <img src="https://authjs.dev/favicon.ico" width="16" alt="Auth.js"> <a href="https://authjs.dev/">Auth.js</a>

## How To
### 🏃Getting Started
本プロジェクトは、ユーザー認証/認可 API として [gtaiyou24/identity-access](https://github.com/gtaiyou24/identity-access) を利用します。
そのため、事前に clone して起動してください。

```bash
cd ~/path/to/other
git clone https://github.com/gtaiyou24/identity-access.git
cd identity-access

docker-compose up --build
```

次に本プロジェクトを起動してください。
```bash
npm install

npm run dev
```

[http://localhost:3000](http://localhost:3000) にアクセスして、挙動を確認してください。
