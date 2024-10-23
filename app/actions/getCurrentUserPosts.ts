import { prisma } from "@/lib/prisma";
import getSession from "./getSession";

const getCurrentUser = async () => {
    try {
        const session = await getSession();
        if (!session?.user?.email) {
            return null;
        }

        const currentUser = await prisma.user.findUnique({
            where: {
                email: session.user.email as string
            }
        })

        if (!currentUser) {
            return null;
        }
        const posts = await prisma.post.findMany({
            where: {
                user_id: currentUser.id
            }
        });

        if (!posts) {
            return null;
        }
        return posts;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        return null;
    }
}
export default getCurrentUser;