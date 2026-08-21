# Raw 文档收件箱

将待导入的外部资料直接放入此目录或其子目录。P0 支持 UTF-8 `.md` 与 `.txt` 文件；请在 DSH Web GUI 的「知识库 → Raw 收件箱」审阅并点击处理。

Raw 文件不会被 agent 检索。成功处理后，原文件会移至 `knowledge/documents/imported/` 并生成来源 manifest；处理失败或尚未支持的文件将保留在此处。
