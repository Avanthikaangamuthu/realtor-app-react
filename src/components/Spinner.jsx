import Infinity from '../assests/svg/Infinity.svg';
function Spinner(){
    return(
        <div className='bg-black bg-opacity-50 z-60 flex justify-center items-center fixed left-0 right-0 bottom-0 top-0'>
            <div>
                <img src={Infinity} alt="Loading" className='h-50 w-40'/>
            </div>
        </div>
    )
}

export default Spinner;