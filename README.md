# 概要
## アプリ名   
Togo List  
  
## 目的   
行きたい場所を画像とテキストでリスト化できるアプリです  
他のユーザーに共有することも可能です  
  
## 技術スタック  
フロントエンド: Next.js 14, GoogleMapsPlatform  
UIライブラリ: Tailwind CSS, chadcn/ui 
データ保存: Supabase  
その他API: normalize-japanese-addresses  
デプロイ: Vercel  
  
# URL
https://togolist-next.vercel.app/  

# 設計図
![architecture.png](https://private-user-images.githubusercontent.com/172908458/378261070-1f687249-0a41-43c3-822d-bea4cc641def.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3Mjk0ODA5MTcsIm5iZiI6MTcyOTQ4MDYxNywicGF0aCI6Ii8xNzI5MDg0NTgvMzc4MjYxMDcwLTFmNjg3MjQ5LTBhNDEtNDNjMy04MjJkLWJlYTRjYzY0MWRlZi5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQxMDIxJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MTAyMVQwMzE2NTdaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1lYWNkMjNiNzgyY2QxYjg5ZTY1NWZmZjNkNzIyMjQ2ZmZhYWVmZjMyYzE3NTRiZWE4ZjQ3YTc4ZTUxYjQ5OTI4JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.DIvKrwcds3Slj4kz6kTBDk43NJbLj50ObCmqCDsZRnw)

# ユーザーインターフェース (UI) 設計
## ワイヤーフレーム
１.ログイン画面  
「メールアドレス、パスポート」  
「Googleアカウント」  
いずれかを使用してログインしホーム画面へ遷移できる  
また、サインアップ画面へ遷移することができる    

２.サインアップ画面  
メールアドレス、パスポート、ユーザー名  
を設定しサインアップすることができる  

３.メイン画面  
・リストの表示  
・Google Mapの表示  
・リストのフィルタリング  
・ユーザー名変更  
・フォロー機能の管理  
・新規投稿画面への遷移   
・ログアウト
を行うことができる  

４.新規投稿画面  
・地名  
・住所  
・期間  
・画像  
を入力して新規投稿が行える　　

## 操作方法
ログイン、サインアップを行い  
ホーム画面へ遷移してください  
※下記アカウントをご利用ください※  
※Email : t7849866@gmail.com ※  
※password : password        ※  

新規投稿を行う場合は「新規投稿画面」  

他ユーザーをフォローする場合は「フォロー管理」  
※ テスト用ユーザーID -> uois8agk   

また、リストをフィルタリングしたい場合は  
地名で検索のテキストボックスや  
投稿者、都道府県などのセレクトボックスなどを操作してください  

# データフロー
## togo
・概要  
  投稿されたtogoを管理するテーブル　　
  
・カラム  
  id  
  placeName  
  address  
  prefecture(都道府県)  
  lat(緯度)  
  lng(経度)  
  startDate  
  endDate  
  imageUrl(表示するためのURL)  
  postDatetime  
  postUserId  
  imagePath(削除するためのパス)  

## users
・概要  
  ユーザーを管理するテーブル　　
  
・カラム  
  id(uid)  
  username  
  friend_id  
  follow_id  

# 技術スタックの選定理由
## Next.js 14
コンポーネントベースの設計が可能で、フロントエンドの開発を効率化  
App Routerを使用して画面遷移を実装  
将来的にSSR（サーバーサイドレンダリング）や静的生成などの機能を追加できる柔軟性  
## supabase
データベース、認証、ストレージ、の3つのバックエンド機能を一つのプラットフォームで提供している  
これにより、インフラ構築にかける時間を削減し、迅速に開発サイクルを回すことが可能  
## Tailwind CSS , chadcn/ui
Reactプロジェクトに統合が簡単であるため  
不必要なコンポーネントのインポートがないため軽量  
