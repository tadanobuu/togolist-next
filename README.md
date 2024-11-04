# Togo List

## 概要

Togo Listは、行きたい場所を画像とテキストでリスト化し、他のユーザーと共有できるアプリです。

## アプリURL
[Togo List - 公開アプリURL](https://togolist-next.vercel.app/)

---

## 技術スタック

- **フロントエンド**: Next.js 14, Google Maps Platform
- **UIライブラリ**: Tailwind CSS, chadcn/ui
- **データ保存**: Supabase
- **その他API**: normalize-japanese-addresses
- **デプロイ**: Vercel

---

## 設計図
![アーキテクチャ図](https://zyuekgrvgrilgtfagjge.supabase.co/storage/v1/object/public/togo_image_bucket/architecture/architecture.png)

---

## ユーザーインターフェース (UI) 設計

### 1. ログイン画面
- メールアドレスとパスワード、またはGoogleアカウントでログイン
- サインアップ画面へのリンクあり

### 2. サインアップ画面
- メールアドレス、パスワード、ユーザー名を設定してサインアップ可能

### 3. メイン画面
- リスト表示、Googleマップ表示、リストのフィルタリング
- ユーザー名変更、フォロー機能、新規投稿、ログアウトが可能

### 4. 新規投稿画面
- 地名、住所、期間、画像を入力して新規投稿を行える

---

## 操作方法

1. ログインまたはサインアップ後、ホーム画面に移動してください。
   - テストアカウント:  
     - Email: `t7849866@gmail.com`
     - Password: `password`

2. 新規投稿を行う場合は「新規投稿画面」へ
3. 他ユーザーをフォローする場合は「フォロー管理」へ
   - テスト用ユーザーID: `uois8agk`
   
4. リストのフィルタリングは、地名検索や投稿者・都道府県のセレクトボックスを使用してください。

---

## データフロー

### `togo`テーブル
**概要**: 投稿されたTogoを管理するテーブル
- **カラム**
  - `id`
  - `placeName`（地名）
  - `address`（住所）
  - `prefecture`（都道府県）
  - `lat`（緯度）
  - `lng`（経度）
  - `startDate`（開始日）
  - `endDate`（終了日）
  - `imageUrl`（画像URL）
  - `postDatetime`（投稿日時）
  - `postUserId`（投稿ユーザーID）
  - `imagePath`（削除用のパス）

### `users`テーブル
**概要**: ユーザーを管理するテーブル
- **カラム**
  - `id`（UID）
  - `username`（ユーザー名）
  - `friend_id`
  - `follow_id`

---

## 技術スタックの選定理由

### Next.js 14
- コンポーネントベース設計によりフロントエンド開発を効率化
- App Routerでの画面遷移実装
- SSRや静的生成の追加が容易で将来的な拡張性が高い

### Supabase
- データベース、認証、ストレージ機能を統合して提供
- インフラ構築の時間を削減し、迅速な開発サイクルを実現

### Tailwind CSS & chadcn/ui
- 軽量でReactとの統合が簡単
- 不要なコンポーネントのインポートがなく、パフォーマンスが向上

--- 

