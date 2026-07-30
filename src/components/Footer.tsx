import Image from "next/image";

export default function Footer() {
    return(
        <div className="bg-foreground py-20 px-20 mt-50 text-white/80 flex gap-30">
            <div>
                <h3 className="text-lg font-semibold tracking-wider mb-1">Products</h3>
                <p>Machines</p>
                <p>Accessories</p>
                <p>Beans</p>
            </div>

            <div>
                <h3 className="text-lg font-semibold tracking-wider mb-1">Our Services</h3>
                <p>Customer Care</p>
                <p>Terms and Conditions</p>
                <p>Privacy Policy</p>
            </div>
            
            <div>
                <h3 className="text-lg font-semibold tracking-wider mb-1">Contact Us</h3>
                <p>Machines</p>
                <p>Accessories</p>
                <p>Beans</p>
            </div>

        </div>
    );
}