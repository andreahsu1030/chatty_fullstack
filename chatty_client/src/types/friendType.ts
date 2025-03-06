export interface FriendRequestProps {
  _id: string,
  requester: string,
  recipient: string,
  status: 'pending'|'accept'|'reject',
  createdAt: string,
  updateAt: string
}