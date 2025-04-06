import Image from 'next/image';

export default function Navbar() {
  return (
    <div className='p-4 md:p-8 lg:p-12 xl:p-16'>
        <nav className='bg-white'>
            <div className='flex justify-between items-center'>
                <Image
                    src="/Frame 44.png"
                    alt=""
                    width={100}
                    height={100}
                />
                <Image
                    src="/Vector.png"
                    alt=""
                    width={25}
                    height={25}
                />
            </div>
        </nav>
        <div>
            <h1 className='text-2xl font-bold pt-4'>Contact Us</h1>
        </div>
        <div className='pt-4'>
            <p>We are here to help! If you have any question, concerns, ot feedback about Verimed, 
              please dont hesistate to reach out. Our dedicated support team is ready to  assist you
              with any inquiries regarding our drug authentication services.
            </p>
        </div>
        <div className='pt-4'>
            <p><b>How to reach us:</b> <br/></p>
            <ul className='list-outside list-disc pl-7'>
                <li><b>Email</b>: support@verimed.com</li>
                <li><b>Phone</b>: +234 902 345 678</li>
                <li><b>Mailing Address</b>: <br/>Verimed Support <br/>123 Health Avenue <br/> Wellness City, ST 00000</li>
            </ul>
        </div>
        <div className='pt-4'>
            <p>
              Thank you for trusting Verimed --your safety is our priority!
            </p>
        </div>
    </div>
  );
}
