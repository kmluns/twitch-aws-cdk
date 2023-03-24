import { DynamoDB } from "aws-sdk";
import { UserUpdateDTO } from "../dto/UserUpdateDTO";
import { User } from "../model/User";
import { createUpdateParams } from '../util/repository/createUpdateExpression';

export class UserRepository {

    constructor(private tableName: string, private docClient: DynamoDB.DocumentClient){
    }

    public async createUser(user: User): Promise<void>{
        const params = {
            TableName : this.tableName,
            Item: user
        }
        await this.docClient.put(params).promise()
    }

    public async updateUser(id: string, user: UserUpdateDTO): Promise<void>{
        const params = {
            TableName: this.tableName,
            Key: {
                "id": id
            },
            ...createUpdateParams(user)
        };
        await this.docClient.update(params).promise()
    }

    public async getUser(id: string): Promise<User> {
        const params = {
            TableName : this.tableName,
            Key: {
                id
            }
        }
        const result = await this.docClient.get(params).promise();

        return result.Item as User
    }

    public async getUserByUsername(username: string): Promise<User> {
        var params = {
            TableName : this.tableName,
            IndexName : "usernameIndex",
            KeyConditionExpression: "#username = :v_username",
            ExpressionAttributeNames:{
                "#username": "username"
            },
            ExpressionAttributeValues: {
                ":v_username": username
            }
        };

        const result = await this.docClient.query(params).promise();

        return result.Items![0] as User
    }

    public async getUserByEmail(email: string): Promise<User> {
        var params = {
            TableName : this.tableName,
            IndexName : "emailIndex",
            KeyConditionExpression: "#email = :v_email",
            ExpressionAttributeNames:{
                "#email": "email"
            },
            ExpressionAttributeValues: {
                ":v_email": email
            }
        };
        const result = await this.docClient.query(params).promise();

        return result.Items![0] as User
    }
}
