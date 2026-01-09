import SearchFormReset from "./SearchFormReset";
import {Search} from 'lucide-react' 

const SearchForm = ({query}:{query?:string}) => {
 
   
  return (
    <form  className='search-form flex-between scroll={false}'>
       <input 
            name='query'
            defaultValue={query}
            className='flex-1 font-normal placeholder:font-light placeholder:text-[#333333]  outline-none'
            placeholder='Search Incidents'
          />
          <div className="flex gap-2">
            {query && <SearchFormReset />}
            <button type='submit' className='text-white search-btn cursor-pointer'><Search className='size-3' /></button>

          </div>
        </form>
      )
    }

    export default SearchForm