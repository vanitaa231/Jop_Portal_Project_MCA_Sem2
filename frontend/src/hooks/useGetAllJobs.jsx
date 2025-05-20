import { setAllJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom';

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query') || '';
   // const {searchedQuery} = useSelector(store=>store.job);
    // console.log("This is query",query);
    useEffect(()=>{

        const fetchAllJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get?keyword=${query}`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllJobs();
    }, [dispatch, query])
}

export default useGetAllJobs