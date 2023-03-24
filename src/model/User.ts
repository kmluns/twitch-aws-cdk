import { randomUUID } from "crypto"
import { Base } from "./Base"

interface UserProps {
    username: string
    email:string
    name?: string
    phone?: string
}

export class User implements Base, UserProps{
    id: string
    username: string
    email: string
    name: string | undefined
    phone: string | undefined

    constructor(props: UserProps){
        this.id = randomUUID()
        this.username = props.username
        this.email = props.email
        this.name = props.name
        this.phone = props.phone
    }
}



