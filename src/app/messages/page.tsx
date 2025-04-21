import Messenger from "@/components/chats/Messenger";
import { getContactsList } from "@/utils/messaging";

export default async function DirectMessagePage() {
  const contactList = await getContactsList(10);

  return <Messenger initialContacts={contactList} />;
}
