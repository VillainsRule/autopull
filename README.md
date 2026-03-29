<div align='center'>
    <h1>autopull</h1>
    <h3>detects repository changes in systemd and restarts them</h3>
</div>

<br><br>

## setup
1. identify the shell (`echo $SHELL`)
2. find the path to the quik executable you downloaded (`pwd` in the folder where it is located)
3. add `alias ap='/path/to/autopull-executable'` to your shell config file:
    - mac: `~/.zshrc` for zsh or `~/.bash_profile` for bash
    - linux: `~/.zshrc` for zsh or `~/.bashrc` for bash

if you want to build ap yourself (builds on mac/linux only):
1. install [bun](https://bun.sh)
2. clone the repo: `git clone https://github.com/VillainsRule/autopull && cd autopull`
3. create an env: `cp .env.example .env`
    - `HOST` is mandatory; you need to port forward it
    - `WEBHOOK` is optional; if set, it will send a message to the DC webhook every time a repo is updated
4. build autopull: `./build.sh`

> [!NOTE]
> env vars get embedded, you will need to rebuild to update them

<br><br>
<h5 align='center'>made with :heart:</h5>