import { IoHomeSharp } from 'react-icons/io5'
import { IoChatboxEllipsesOutline } from 'react-icons/io5'
import { IoSettingsSharp } from 'react-icons/io5'
import { HiMagnifyingGlass } from 'react-icons/hi2'
import { GrSend } from 'react-icons/gr'
import { CiEdit } from 'react-icons/ci'
import { FaCameraRetro } from 'react-icons/fa6'
import { TbLogout2 } from 'react-icons/tb'
import { IoCloseCircleOutline } from 'react-icons/io5'
import { MdFileDownloadDone } from 'react-icons/md'
import { FaPlus } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

export const menuIcons = [
  { name: 'home', icon: IoHomeSharp, url: '/' },
  { name: 'plus', icon: FaPlus, url: '/friendship' },
  { name: 'chat', icon: IoChatboxEllipsesOutline, url: '/chatroom' },
  { name: 'notifications', icon: IoNotifications, url: '/notification' }
]

export const others = {
  manify: HiMagnifyingGlass,
  send: GrSend,
  camera: FaCameraRetro,
  logout: TbLogout2,
  close: IoCloseCircleOutline,
  edit: CiEdit,
  done: MdFileDownloadDone,
  setting: IoSettingsSharp,
  chat: IoChatbubbleEllipsesOutline 

}
