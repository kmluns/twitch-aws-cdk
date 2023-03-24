import { UserCreateDTO } from "../dto/UserCreateDTO";
import { UserUpdateDTO } from '../dto/UserUpdateDTO';
import { User } from "../model/User";
import { UserRepository } from "../repository/UserRepository";

export class UserService {

    constructor(private userRepository: UserRepository){}

    public async createUser(userCreateDTO: UserCreateDTO): Promise<void> {
        const isUserExist = Boolean(await this.userRepository.getUserByUsername(userCreateDTO.username) ?? await this.userRepository.getUserByEmail(userCreateDTO.email))
        if(isUserExist){
            throw new Error("Already Exist!");
        }

        const user = new User(userCreateDTO)
        await this.userRepository.createUser(user)
    }

    public async updateUser(id: string, userUpdateDTO: UserUpdateDTO): Promise<void> {
        let user = await this.getUser(id)
        await this.userRepository.updateUser(user.id, userUpdateDTO)
    }

    public async getUser(id: string): Promise<User>{
        const user = this.userRepository.getUser(id)
        if(!user){
            throw new Error("Not Found!");
        }
        return user
    }

    public async getUserByUsername(username: string): Promise<User>{
        const user = this.userRepository.getUserByUsername(username)
        if(!user){
            throw new Error("Not Found!");
        }
        return user
    }

    public async getUserByEmail(email: string): Promise<User>{
        const user = this.userRepository.getUserByEmail(email)
        if(!user){
            throw new Error("Not Found!");
        }
        return user
    }

}
