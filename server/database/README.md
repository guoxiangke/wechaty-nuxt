npx sequelize-cli model:create --name User --attributes "email:string, password:string, loginAt:Date"

npx sequelize-cli model:create --name Bot --attributes "name:string, description:string, token:string, config:string, status:boolean"

npx sequelize-cli model:create --name Job --attributes "name:string, description:string, type:number, path:string, isByCount:boolean, cpf:string"

npx sequelize-cli model:create --name Contact --attributes "name:string, alias:string, gender:boolean, province:string, city:string, avatar:string, activeAt:Date, botId:number"

npx sequelize-cli model:create --name Message --attributes "msgId:string,to:string,type:number,content:string, botId:number"

rm ./server/database/db.sqlite && npx sequelize-cli db:migrate
