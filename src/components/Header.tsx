import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
export default function Header() {
    return(
        <div className="py-5 px-10 flex items-center justify-between xl:pr-30">
            <Image src={'/logo.png'} alt="logo" width={200} height={200}></Image>

            <div className="flex gap-10 font-semibold text-foreground/90">
                <Link href={'/page'}>Home</Link>
                <Link href={'/products'}>Products</Link>
            </div>

            <button><ShoppingCart/></button>

        </div>
    );
}