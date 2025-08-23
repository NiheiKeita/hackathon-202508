#コーディングルール（ディレクトリ構成と責務）フロント

## 2. views ディレクトリ
役割: ページ単位のロジックと表示を担当

構成:

index.tsx: ページ全体のコンポーネント
hooks.ts: ロジック（カスタムフック）を定義
components/: UI部品を切り出す
index.stories.tsx: Storybook カタログ + 必要なUIテスト
hooks.test.ts: hooks.ts のユニットテスト

例: /views/TopView/

```
TopView/
├── index.tsx            // ページコンポーネント
├── hooks.ts             // ロジック（useTopなど）
├── hooks.test.ts        // hooks のユニットテスト
├── index.stories.tsx    // Storybook + UIテスト（defaultはカタログ用）
└── components/
    └── Card/
        └── index.tsx    // UIパーツ（再利用性のある見た目重視のコンポーネント）
```
## 責務のまとめ
場所	役割・責務
views/	ページ単位の処理と画面構成
views/hooks.ts	カスタムフックでロジックを分離
views/components	UIパーツ（見た目のみ。ロジックなし）
hooks.test.ts	フックの単体テスト
index.stories.tsx	Storybook用のUIカタログ + 簡単なUIテスト

## 注意点
default エクスポートの Story にはテストを書かない（カタログ専用）
UI 部品にはロジックを入れず、表示のみに専念
ロジックのテストは hooks.test.ts に分離

# Docker環境での操作
このプロジェクトはDocker環境で動作します。以下のコマンドを使用してください：

## マイグレーション
```bash
docker compose exec app php artisan migrate
```

## マイグレーション状況確認
```bash
docker compose exec app php artisan migrate:status
```

## 開発ワークフロー
1. **コード修正**
2. **品質チェック実行** (下記の「修正が終わったらやること」参照)
3. **エラーがあれば自動修正コマンドで修正**
4. **再度品質チェック実行**
5. **全てパスしたらコミット・プッシュ**

```bash
# 推奨：一括チェックスクリプト
# フロントエンド
npm run lint && npm run type-check

# バックエンド  
docker compose exec app composer phpcs && \
docker compose exec app vendor/bin/phpunit --debug && \
docker compose exec app vendor/bin/phpstan analyze
```


# 実装履歴・注意事項

## マイグレーションファイルの実行順序
- マイグレーションファイル作成時、依存関係のあるテーブルは実行順序に注意
- `machine_images`は`machines`テーブルに依存するため、後から実行される必要がある
- 同じタイムスタンプのマイグレーションファイルがあると実行順序が不定になる問題を解決済み

## ページコンポーネントの構造変更履歴
### 2025-08-21: Web/Topページの構造修正
- `Top.tsx` → `Top/index.tsx` + `Top/index.stories.tsx` に変更
- コーディングルールに準拠

### 2025-08-21: Web/Machinesページの構造修正
- `Machines/Index.tsx` → `Machines/Index/index.tsx` + `hooks.ts` + `index.stories.tsx`
- `Machines/Show.tsx` → `Machines/Show/index.tsx` + `hooks.ts` + `index.stories.tsx`
- ロジックをhooks.tsに分離してコンポーネントから表示ロジックを除去

## Inertia.jsレンダリング
- LaravelコントローラーからのInertiaレンダリング形式: `Inertia::render('Web/Top')`
- ディレクトリ構造: `/resources/js/Pages/Web/Top/index.tsx`

# 画像アップロード設定

## ローカル環境
1. FILESYSTEM_DISK=public に設定
2. storage linkを作成: `php artisan storage:link`
3. 相対パスのsymlink作成: `ln -s ../storage/app/public public/storage`

## 本番環境での設定
1. .envファイルで以下を設定：
```
APP_URL=https://gamedx.qboad.com
FILESYSTEM_DISK=public
```

2. ストレージリンク作成：
```
php artisan storage:link
```

3. storage/app/publicディレクトリの書き込み権限確認
```
chmod -R 755 storage/
chmod -R 755 bootstrap/cache/
```

4. Webサーバー（Apache/Nginx）で/storageパスが正しくアクセスできることを確認

5. 設定キャッシュのクリア（重要）：
```
php artisan config:cache
php artisan config:clear
```

## トラブルシューティング：画像URL問題
- MachineImageモデルで `Storage::disk('public')->url()` を使用
- APP_URLが正しく設定されているか確認
- シンボリックリンクが正しく作成されているか確認：
  ```
  ls -la public/storage
  ```

# 修正が終わったらやること
以下を実行してエラーがないことを確認してください

## フロントエンド
```bash
npm run lint
npm run type-check
```

## Storybook
```bash
# Storybookローカル実行
npm run storybook

# Storybookテスト
npm run test-storybook
```

## バックエンド
```bash
# PHPコードスタイルチェック
docker compose exec app composer phpcs

# PHPユニットテスト
docker compose exec app vendor/bin/phpunit --debug

# PHP静的解析
docker compose exec app vendor/bin/phpstan analyze
```

**重要:** 全てのチェックでエラーがないことを確認してからコミット・プッシュしてください。

## 自動修正コマンド
エラーがある場合は以下で自動修正できます：

```bash
# PHPコードスタイル自動修正
docker compose exec app composer phpcs-fix

# ESLint自動修正
npm run lint -- --fix
```

## CI/CD環境での設定
GitHub ActionsでStorybookテストを実行する場合は、以下の環境変数を設定してください：

```yaml
env:
  CI: true
  LARAVEL_BYPASS_ENV_CHECK: 1
```

この設定により以下が解決されます：
- Vite HMRサーバーのCI環境エラー
- Laravel Vite pluginのCIチェック回避
- Inertia.jsコンポーネントのStorybookテスト対応