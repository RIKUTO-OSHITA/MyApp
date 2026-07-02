## Why (背景と目的)

ユーザーは、見慣れたカレンダー体験で1日の予定を30分単位で簡単に計画・調整できる仕組みを必要としています。計画にかかる負担を減らし、予定変更を素早く明確に行える専用デイリー・スケジューラを今導入する価値があります。

## What Changes (変更内容)

- Outlook風の1日表示に着想を得たデイリー・スケジューラUIを追加する。
- 1日のタイムラインを30分刻みで管理できるようにする。
- タスクのCRUD（追加・編集・削除）を実装する。
- タスク入力項目を「タスク名」「開始時刻」「終了時刻」に限定して定義する。
- 目に優しい寒色系のビジュアルテーマを適用する。

## Capabilities

### New Capabilities
- day-schedule-management: 30分スロットのカレンダー型タイムライン上で、1日の予定とタスクCRUDを管理する機能。

### Modified Capabilities
- なし。

## Impact (影響範囲)

- 新規 capability spec を openspec/changes/build-daily-scheduler-ui/specs/day-schedule-management/spec.md に追加する。
- UIおよび操作設計の意思決定は design.md に記録する。
- 実装作業にはタイムライン描画、タスクバリデーション、CRUDフローの実装が含まれる。
