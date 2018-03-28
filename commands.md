<div class="section">**add** - Share your work in a dedicated, read-only channel 

Accept extra arguments: Yes 

Delete command        : No 

Permissions: 

| Allowed roles | Allowed channels |
| :-----------: | :--------------: |
| Any  | #feedback  |
Examples: 

`!add` 

</div><br><div class="section">**del** - Delete a message posted in <#383290818548465676> 

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

</div><br><div class="section">**donate** - Donate to support this server 

Accept extra arguments: No 

Delete command        : Yes 

Permissions: 

| Allowed roles | Allowed channels |
| :-----------: | :--------------: |
| Any  | Any  |
Examples: 

`!donate` 

</div><br><div class="section">**help** - Show help about the bot 

Accept extra arguments: No 

Delete command        : No 

Permissions: 

| Allowed roles | Allowed channels |
| :-----------: | :--------------: |
| Any  | Any  |
Examples: 

`!help` 

</div><br><div class="section">**iam** - Add or remove a user from a role 

Accept extra arguments: No 

Delete command        : No 

Parameters: 

| Name | Type | Description |
| :--: |:---: | :---------: |
| role | string | A string representing a role | 
Permissions: 

| Allowed roles | Allowed channels |
| :-----------: | :--------------: |
| Any  | #commands  |
Examples: 

`!iam dev` 

`!iam artist` 

</div><br><div class="section">**info** - Get infos about the current running instance 

Accept extra arguments: No 

Delete command        : No 

Permissions: 

| Allowed roles | Allowed channels |
| :-----------: | :--------------: |
| CC Staff  | Any  |
Examples: 

`!info` 

</div><br><div class="section">**move** - Move a certain amount of messages from one channel to another 

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

`!move 10 <#226376432064921600>` 

</div><br><div class="section">**notice** - Show the notice to the user 

Accept extra arguments: No 

Delete command        : Yes 

Permissions: 

| Allowed roles | Allowed channels |
| :-----------: | :--------------: |
| CC Staff  | Any  |
Examples: 

`!notice` 

</div><br><div class="section">**notify** - Notify user and waits for their reactions 

Accept extra arguments: Yes 

Delete command        : Yes 

Permissions: 

| Allowed roles | Allowed channels |
| :-----------: | :--------------: |
| CC Staff  | Any  |
Examples: 

`!notify @user1 @user2 message` 

`!notify Hello @user1 @user2, can you please ...` 

</div><br><div class="section">**ping** - Ping the bot 

Accept extra arguments: No 

Delete command        : No 

Permissions: 

| Allowed roles | Allowed channels |
| :-----------: | :--------------: |
| Any  | Any  |
Examples: 

`!ping` 

</div><br><div class="section">**prune** - Prune a certain amount of messages from the current channel 

Accept extra arguments: No 

Delete command        : Yes 

Parameters: 

| Name | Type | Description |
| :--: |:---: | :---------: |
| amount | number | How much messages you want to prune | 
Permissions: 

| Allowed roles | Allowed channels |
| :-----------: | :--------------: |
| CC Staff  | Any  |
Examples: 

`!prune 10` 

</div><br><div class="section">**report** - Anonymously report an individual to the CCStaff for breaking a rule. 

Accept extra arguments: Yes 

Delete command        : Yes 

Parameters: 

| Name | Type | Description |
| :--: |:---: | :---------: |
| user | user | The user you want to report | 
Permissions: 

| Allowed roles | Allowed channels |
| :-----------: | :--------------: |
| Any  | Any  |
Examples: 

`!report @user1 [optional: reason]` 

</div><br><div class="section">**say** - Output text or embed inside a specific channel as Alfred 

Accept extra arguments: Yes 

Delete command        : No 

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

</div><br><div class="section">**status** - Output the current status of the Scirra websites 

Accept extra arguments: No 

Delete command        : Yes 

Permissions: 

| Allowed roles | Allowed channels |
| :-----------: | :--------------: |
| Any  | #commands #general #off-topic  |
Examples: 

`!status` 

</div><br><div class="section">**ty** - Thank someone for his help 

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

</div><br><div class="section">**tystats** - Show how many people thanked you 

Accept extra arguments: No 

Delete command        : Yes 

Permissions: 

| Allowed roles | Allowed channels |
| :-----------: | :--------------: |
| Any  | Any  |
Examples: 

`!tystats` 

</div><br><div class="section">**warn** - Warn a user with different level of severity 

Accept extra arguments: No 

Delete command        : No 

Parameters: 

| Name | Type | Description |
| :--: |:---: | :---------: |
| user | user | The user you want to warn | 
Permissions: 

| Allowed roles | Allowed channels |
| :-----------: | :--------------: |
| CC Staff  | #moderators  |
Examples: 

`!warn @user` 

</div><br>