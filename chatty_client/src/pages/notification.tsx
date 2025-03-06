import Card from "../ui/card";

export default function Notification() {
  return (
    <div className='bg-slate-50 px-4 h-screen'>
    <div className='my-3'>
      <div>
        <Card  />
      </div>
    </div>
    <div className='border-t border-gray-200 pt-3 space-y-2 '>
      <div onClick={() => {}}>
        <Card  />
      </div>
    </div>
  </div>
  )
}