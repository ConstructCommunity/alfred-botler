**add** - Share your work in a dedicated, read-only channel 

Accept extra arguments: Yes 

Delete command        : No 

Permissions: 

| Allowed roles | Allowed channels |
| :-----------: | :--------------: |
| Any  | #feedback  |
Examples: 

`!add` 

___ 

**crash** - Simply crash the bot 

Accept extra arguments: No 

Delete command        : Yes 

Permissions: 

| Allowed roles | Allowed channels |
| :-----------: | :--------------: |
| CC Staff  | Any  |
Examples: 

`!crash` 

___ 

**del** - Delete a message posted in 383290818548465676 

Accept extra arguments: No 

Delete command        : Yes 

Parameters: 

| Name | Type | Description |
| :--: |:---: | :---------: |
| id | string | The id of the message to delete | 
Permissions: 

| Allowed roles | Allowed channels |
| :-----------: | :--------------: |
| Any  | #commands  |
Examples: 

`!del` 

___ 

**help** - Show help about the bot 

Accept extra arguments: No 

Delete command        : No 

Permissions: 

| Allowed roles | Allowed channels |
| :-----------: | :--------------: |
| Any  | Any  |
Examples: 

`!help` 

___ 

**iam** - Add or remove a user from a role 

Accept extra arguments: No 

Delete command        : No 

Parameters: 

| Name | Type | Description |
| :--: |:---: | :---------: |
| role | string | A string representing a role | 
Permissions: 

| Allowed roles | Allowed channels |
| :-----------: | :--------------: |
| CC Staff  | #commands  |
Examples: 

`!iam dev` 

`!iam artist` 

___ 

**move** - Move a certain amount of messages from one channel to another 

Accept extra arguments: No 

Delete command        : Yes 

Parameters: 

| Name | Type | Description |
| :--: |:---: | :---------: |
| amount | number | How much messages you want to move | 
| channel | channel | The channel you want to move messages to | 
Permissions: 

| Allowed roles | Allowed channels |
| :-----------: | :--------------: |
| CC Staff  | Any  |
Examples: 

`!!move 10 #off-topic` 

___ 

**notice** - Show the notice to the user 

Accept extra arguments: No 

Delete command        : Yes 

Permissions: 

| Allowed roles | Allowed channels |
| :-----------: | :--------------: |
| CC Staff  | Any  |
Examples: 

`!notice` 

___ 

**notify** - Notify user and waits for their reactions 

Accept extra arguments: Yes 

Delete command        : Yes 

Permissions: 

| Allowed roles | Allowed channels |
| :-----------: | :--------------: |
| CC Staff  | Any  |
Examples: 

`!notify @user1 @user2 message` 

`!notify Hello @user1 @user2, can you please ...` 

___ 

**ping** - Ping the bot 

Accept extra arguments: No 

Delete command        : No 

Permissions: 

| Allowed roles | Allowed channels |
| :-----------: | :--------------: |
| Any  | Any  |
Examples: 

`!ping` 

___ 

**say** - Output text or embed inside a specific channel as Alfred 

Accept extra arguments: Yes 

Delete command        : Yes 

Parameters: 

| Name | Type | Description |
| :--: |:---: | :---------: |
| channel | channel | The channel where to post the message | 
Permissions: 

| Allowed roles | Allowed channels |
| :-----------: | :--------------: |
| CC Staff  | Any  |
Examples: 

`!say + json as attached file` 

`!say Hello everyone!` 

___ 

**ty** - Thank someone for his help 

Accept extra arguments: No 

Delete command        : Yes 

Parameters: 

| Name | Type | Description |
| :--: |:---: | :---------: |
| user | user | A user mention | 
Permissions: 

| Allowed roles | Allowed channels |
| :-----------: | :--------------: |
| Any  | Any  |
Examples: 

`!ty @armaldio` 

___ 

**tystats** - Show how many people thanked you 

Accept extra arguments: No 

Delete command        : Yes 

Permissions: 

| Allowed roles | Allowed channels |
| :-----------: | :--------------: |
| Any  | Any  |
Examples: 

`!tystats` 

___ 

**warn** - Warn a user with different level of severity 

Accept extra arguments: No 

Delete command        : No 

Parameters: 

| Name | Type | Description |
| :--: |:---: | :---------: |
| user | user | The user you want to warn | 
Permissions: 

| Allowed roles | Allowed channels |
| :-----------: | :--------------: |
| CC Staff  | Any  |
Examples: 

`!warn @user` 

___ 

