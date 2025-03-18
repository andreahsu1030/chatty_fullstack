import { useEffect, useState } from 'react'
import { others } from '../utils/icons'
import { blurSearch } from '../services/profileService'
import { FriendshipsProfileProps } from '../pages/friendship'

interface SearchProps {
  setIsSearch: React.Dispatch<React.SetStateAction<boolean>>
  setSearchProfile: React.Dispatch<
    React.SetStateAction<FriendshipsProfileProps[] | null>
  >
}

export default function Search({ setIsSearch, setSearchProfile }: SearchProps) {
  const IconComponent = others.magnifier
  const [value, setValue] = useState<string>('')

  const handleSearch = async (params: string) => {
    if (params.trim() === '') {
      setIsSearch(false)
      return
    }
    const res = await blurSearch(params)
    setSearchProfile(res)
  }

  useEffect(() => {
    handleSearch(value)
  }, [value])

  return (
    <div className='py-3 flex justify-center items-center'>
      <div className='relative w-full'>
        <IconComponent
          className='absolute top-1.5 left-2.5'
          size={20}
          color='#555'
        />
        <input
          type='text'
          placeholder='Search'
          value={value}
          onChange={(e) => {
            setIsSearch(true)
            setValue(e.target.value)
          }}
          className='pl-10 w-full pr-3 py-1 rounded-2xl border border-gray-100 focus:outline-none  '
        />
      </div>
    </div>
  )
}
