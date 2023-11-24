# gSOC2 Action

A [composite GitHub action](https://docs.github.com/en/actions/creating-actions/creating-a-composite-action) that encapsulates the gSOC2 workflow.

## How to use this action

1. Define a new action in your repository by adding a file in the `.github/workflows/` directory. For example:

   ```shell
   touch .github/workflows/gsoc2.yml
   ```

1. Copy the following template into your new workflow file:

   ```yaml
   on:
     push:
       branches:
         - main
     pull_request_target:
       types: [opened, synchronize, reopened]

   name: gSOC2

   permissions: read-all

   jobs:
     gsoc2:
       runs-on: ubuntu-latest
       continue-on-error: true
       name: Analyse the repo with gSOC2
       steps:
         - uses: gsoc2/gsoc2-action@v2
           with:
             gsoc2-token: ${{ secrets.GSOC2_ARCH_DIAG_API_TOKEN }}
   ```

1. Commit the new workflow to GitHub.
1. That's it! gSOC2 will analyze your code to keep your visualizations up to date.

## Skip installing packages on every run

If you run on a self hosted-runner, it might be more efficient to skip installing packages everytime you run this action.

### The `lang-setup` input variable

- By default, `lang-setup` is set to 'all', and this action will setup whichever language toolchains it believes are needed.
- Set the `lang-setup` input to 'none' to skip all language setup. But beware! Node is required for the action to run. If you do not have node configured in your runner environment, you'll need to use the more specific option below.
- If you want to skip most languages but still want the action to install specific language toolchains, make a comma-separated list. For example, for node and .net, `lang-setup: "node, .net"`. The complete list of language toolchains: node, python, jdk, rust, .net. All other language analysis is run using the node toolchain.

```
jobs:
  gsoc2:
    runs-on: self-hosted
    continue-on-error: true
    name: Analyse the repo with gSOC2
    steps:
      - uses: gsoc2/gsoc2-action@v2
        with:
          gsoc2-token: ${{ secrets.GSOC2_ARCH_DIAG_API_TOKEN }}
          lang-setup: 'none'
```
