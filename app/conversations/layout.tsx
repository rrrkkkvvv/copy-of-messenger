import getConversations from "../actions/getConversations";
import getUsers from "../actions/getUsers";
import Sidebar from "../components/sidebar folder/Sidebar";
import AuthContext from "../context/AuthContext";
import ConversationList from "./components/ConversationList";


export default async function ConversationsLayout({
    children
}: { children: React.ReactNode }) {

    const conversations = await getConversations();
    const users = await getUsers();

    return (
        <AuthContext>

        <Sidebar >
            <ConversationList
                users={users}
                initialItems={conversations}
            />
            <div className="h-full">{children}</div>
        </Sidebar >
        </AuthContext>
    )
}