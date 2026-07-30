import { Input } from "@/components/ui/input"

export default function AdminLogin() {
    return(
        <div className="w-[50%] mx-auto flex justify-center">
            <div className="bg-white shadow-xl p-10 rounded-xl w-fit">
                <p>Admin Login</p>
                
                <div>
                    <p>Username</p>
                    <Input/>
                </div>

                <div>
                    <p>Password</p>
                    <Input/>
                </div>

                <button className="bg-foreground py-2 px-5 text-white rounded-lg w-full mt-5">Login</button>
                
            </div>
            
        </div>
    );
}