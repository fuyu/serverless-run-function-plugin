# serverless-run-function-plugin

This is a version of [serverless-run-function-plugin](https://github.com/lithin/serverless-run-function-plugin) by lithin.

What's different:
- This is a raw javascript version. It allows to use a git link in your package.json
- Better support for local event.json files, when event.json is located in subdirectory
- Add compatibility with [serverless-plugin-write-env-vars](https://github.com/silvermine/serverless-plugin-write-env-vars) plugin. It would update .env on each lambda `run` command.
