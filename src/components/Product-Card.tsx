import { ShoppingCart } from "lucide-react";

export default function ProductCard() {
    return(
        <div className="bg-white rounded-xl py-10 px-20 pt-50 shadow-md w-fit text-center flex flex-col gap-4">
            <h3 className="text-lg">Barista Express</h3>
            <h4 className="text-2xl font-semibold">P7,500.00</h4>
            <p>Machines</p>
            <p>4 stocks available</p>

            <div className="flex align-center gap-5">
                <button className="text-sm text-gray-400 cursor-pointer">View Product</button>
                <button><ShoppingCart size={18} className="cursor-pointer"/></button>
            </div>
            
        </div>
    );
}