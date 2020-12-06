# Slack ExtractLinks

> :warning: this stuff is WIP, and a bit messy!

## Goals (Not there yet!)

- Automatically get links from messages where I put a lot of them
- Process them so that I can feed them to an online spreadsheet, a database, etc.

## How to use it

This app is made of:

- a Node.js server in `server` (obviously),
- a React client app at the root

In order to use it, you need to:

1. install the deps (`npm i` at the root and in `server`),
2. create an OAuth2 app on Slack (a bot, that is)
3. Invite this bot by its name on the Slack channels you need to extract links from. If your bot is name LinksBot, type `/invite @LinksBot` in relevant channels.
4. configure the environment variables (see `/.env.local.sample` and `/server/.env.sample`)

Keep in mind that even if you sign in to Slack with _your_ account, when you sign in to this app, your access token will be granted to the **bot**, not to your user account!

## Todo

- Replace `conversations.list` with [users.conversations](https://api.slack.com/methods/users.conversations)
