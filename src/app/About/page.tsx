import React from 'react'

const About = () => {
  return (
    <section className='ml-[5%] mr-[5%]'>
    <div>
        <div>
            <div>
                <header className='flex justify-between items-center w-full pt-3 pb-3'>
                    <div>
                        <a href="#"><img src="/Frame45.png" alt="Logo" /></a>
                    </div>
                    <div>
                        <a href="#"><img src="/Vector.png" alt="Menu" /></a>
                    </div>
                </header>
                <div className='text-start flex pt-3 pb-3'>
                    <h1 className='text-3xl'>About Verimeds</h1>
                </div>

                <div className='text-start items-start flex-col justify-center pt-4 pb-2'>
                    <div className='flex-col items-start pb-3'>
                        <p className='flex-col items-start'>At Verimed, your safety is our top priority. Our mission is to empower you with reliable information about your medications through our verification system. With just a simple barcode scan using your smartphone, Verimed connects to a comprehensive central database to confirm the authenticity of your drugs.</p>
                    </div>
                    <div className='flex-col items-start pb-3'>
                        <p>Whether you’re checking the drug name, manufacturer details, expiry date, or batch number, Verimed delivers verified and up-to-date data at your fingertips. We’re dedicated to combating counterfeit medications and ensuring that every dose you take is safe, authentic, and approved.</p>
                    </div>
                    <div className='flex-col items-start pb-3'>
                        <p>Trust Verimed to be your reliable partner in safeguarding your health. Stay informed, stay safe.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
  )
}

export default About