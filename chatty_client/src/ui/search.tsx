import { others } from "../utils/icons"

export default function Search() {
  const IconComponent = others.manify
  return (
    <div className="py-3 flex justify-center items-center">
      <div className="relative w-full">
        <IconComponent className="absolute top-1.5 left-2.5" size={20} color="#555" />
        <input
          type="text"
          placeholder="Search"
          className="pl-10 w-full pr-3 py-1 rounded-2xl border border-gray-100 focus:outline-none  "
        />
      </div>
    </div>
  )
}