import { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
//import axios from 'axios'
//import { JOB_API_END_POINT } from '@/utils/constant'

const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('')
    const [filterOptions, setFilterOptions] = useState({
        locations: [],
        companies: [],
        salaries: ["0-40k", "42k-1L", "1L-5L", "5L+"] // Default salary ranges
    })
    const dispatch = useDispatch()
    const { allJobs } = useSelector(store => store.job)

    // Fetch unique filter options from jobs data
    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                // Option 1: Fetch from API endpoint (recommended)
                // const res = await axios.get(`${JOB_API_END_POINT}/filter-options`)
                // if (res.data.success) {
                //     setFilterOptions(res.data.data)
                // }

                // Option 2: Calculate from existing Redux jobs data
                if (allJobs && allJobs.length > 0) {
                    const locations = [...new Set(allJobs.map(job => job.location).filter(Boolean))]
                    const companies = [...new Set(allJobs.map(job => job.company.name).filter(Boolean))]
                    
                    setFilterOptions(prev => ({
                        ...prev,
                        locations,
                        companies: companies.length ? companies : ["Frontend", "Backend", "FullStack"] // Fallback
                    }))
                }
            } catch (error) {
                console.error("Failed to fetch filter options:", error)
            }
        }

        fetchFilterOptions()
    }, [allJobs])

    const changeHandler = (value) => {
        setSelectedValue(value)
    }

    useEffect(() => {
        dispatch(setSearchedQuery(selectedValue))
    }, [dispatch, selectedValue])

    const filterData = [
        {
            filterType: "Location",
            array: filterOptions.locations
        },
        {
            filterType: "Company",
            array: filterOptions.companies
        },
        {
            filterType: "Salary",
            array: filterOptions.salaries
        }
    ]

    return (
        <div className='w-full bg-white p-3 rounded-md'>
            <h1 className='font-bold text-lg'>Filter Jobs</h1>
            <hr className='mt-3' />
            <RadioGroup value={selectedValue} onValueChange={changeHandler}>
                {filterData.map((data, index) => (
                    <div key={`${data.filterType}-${index}`}>
                        <h1 className='font-bold text-lg mt-4'>{data.filterType}</h1>
                        {data.array.length > 0 ? (
                            data.array.map((item, idx) => {
                                const itemId = `${data.filterType}-${idx}`
                                return (
                                    <div className='flex items-center space-x-2 my-2' key={itemId}>
                                        <RadioGroupItem 
                                            value={`${data.filterType}:${item}`} 
                                            id={itemId} 
                                        />
                                        <Label htmlFor={itemId}>{item}</Label>
                                    </div>
                                )
                            })
                        ) : (
                            <p className='text-gray-500 text-sm'>No {data.filterType.toLowerCase()} options available</p>
                        )}
                    </div>
                ))}
            </RadioGroup>
        </div>
    )
}

export default FilterCard;
// import { useEffect, useState } from 'react'
// import { RadioGroup, RadioGroupItem } from './ui/radio-group'
// import { Label } from './ui/label'
// import { useDispatch } from 'react-redux'
// import { setSearchedQuery } from '@/redux/jobSlice'

// const fitlerData = [
//     {
//         fitlerType: "Location",
//         array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
//     },
//     {
//         fitlerType: "Industry",
//         array: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
//     },
//     {
//         fitlerType: "Salary",
//         array: ["0-40k", "42-1lakh", "1lakh to 5lakh"]
//     },
// ]

// const FilterCard = () => {
//     const [selectedValue, setSelectedValue] = useState('');
//     const dispatch = useDispatch();
//     const changeHandler = (value) => {
//         setSelectedValue(value);
//     }
//     useEffect(()=>{
//         dispatch(setSearchedQuery(selectedValue));
//     },[dispatch,selectedValue]);
//     return (
//         <div className='w-full bg-white p-3 rounded-md'>
//             <h1 className='font-bold text-lg'>Filter Jobs</h1>
//             <hr className='mt-3' />
//             <RadioGroup value={selectedValue} onValueChange={changeHandler}>
//                 {
//                     fitlerData.map((data, index) => (
//                         <div key={data.fitlerType}>
//                             <h1 className='font-bold text-lg'>{data.fitlerType}</h1>
//                             {
//                                 data.array.map((item, idx) => {
//                                     const itemId = `id${index}-${idx}`
//                                     return (
//                                         <div className='flex items-center space-x-2 my-2' key={itemId}>
//                                             <RadioGroupItem value={item} id={itemId} />
//                                             <Label htmlFor={itemId}>{item}</Label>
//                                         </div>
//                                     )
//                                 })
//                             }
//                         </div>
//                     ))
//                 }
//             </RadioGroup>
//         </div>
//     )
// }

// export default FilterCard