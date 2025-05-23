import Layout from "@/components/layout";
import * as React from "react";
import { PlusCircle } from "lucide-react";
import { Post, PostFormData, User } from "./post.types"; // Adjust path
import { PostCard } from "@/components/posts/PostCard"; // Adjust path
import { PostFormModal } from "@/components/modals/PostFormModal"; // Adjust path
import { ReauthenticationModal } from "@/components/modals/ReauthenticationModal"; // Adjust path
import { useUserAuth } from "@/context/userAuthContext"; // Adjust path
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

// Mock Data (replace with API call in useEffect)
const generateMockPosts = (count: number, currentUser: User | null): Post[] => {
  const posts: Post[] = [];
  for (let i = 1; i <= count; i++) {
    const author = i % 2 === 0 && currentUser ? currentUser : { uid: `user${100 + i}`, email: `author${i}@example.com`, displayName: `Author ${i}`, role: 'admin' };
    posts.push({
      id: `post${i}`,
      title: `Sample Post Title ${i}`,
      content: `This is the detailed content for sample post ${i}. It can be a bit longer to demonstrate text clamping and provide enough substance for a card. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
      imageUrl: i % 3 !== 0 ? `https://picsum.photos/seed/post${i}/600/400` : undefined,
      authorId: author.uid,
      authorName: "Test Name",
      createdAt: new Date(Date.now() - 86400000 * (count - i + 1)).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * (count - i)).toISOString(),
    });
  }
  return posts.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};


interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = (props) => {
  const { user } = useUserAuth(); // Your existing auth hook
  const [posts, setPosts] = React.useState<Post[]>([]);

  // Post Form Modal State
  const [isPostFormModalOpen, setIsPostFormModalOpen] = React.useState(false);
  const [editingPost, setEditingPost] = React.useState<Post | null>(null); // If null, it's a create operation

  // Re-authentication Modal State
  const [isReauthModalOpen, setIsReauthModalOpen] = React.useState(false);
  const [reauthError, setReauthError] = React.useState<string | null>(null);
  const [isReauthProcessing, setIsReauthProcessing] = React.useState(false);

  // State to hold data and action pending re-authentication
  const [pendingAction, setPendingAction] = React.useState<{
    type: 'create' | 'edit';
    data: PostFormData; // Data from PostFormModal
    originalPostId?: string; // For edits
  } | null>(null);


  React.useEffect(() => {
    // TODO: Replace with actual data fetching
    setPosts(generateMockPosts(5, user));
  }, [user]); // Re-generate mock posts if user changes, for authorId consistency

  // --- Post Form Modal Handlers ---
  const openCreatePostModal = () => {
    setEditingPost(null);
    setIsPostFormModalOpen(true);
  };

  const openEditPostModal = (post: Post) => {
    setEditingPost(post);
    const formData: PostFormData = { title: post.title, content: post.content, imageUrl: post.imageUrl };
    setIsPostFormModalOpen(true);
  };

  const closePostFormModal = () => {
    setIsPostFormModalOpen(false);
    setEditingPost(null);
  };

  // --- Re-authentication and Action Execution ---
  const handlePostFormSubmit = (formData: PostFormData) => {
    // Instead of direct save, trigger re-authentication
    setPendingAction({
      type: editingPost ? 'edit' : 'create',
      data: formData,
      originalPostId: editingPost?.id,
    });
    setIsReauthModalOpen(true);
    setReauthError(null); // Clear previous re-auth errors
    closePostFormModal(); // Close post form modal
  };

  const executePostAction = async () => {
    if (!pendingAction || !user) return; // Should not happen if logic is correct

    const { type, data, originalPostId } = pendingAction;

    if (type === 'create') {
      console.log("Attempting to CREATE post (after re-auth):", data);
      // --- !!! REPLACE WITH ACTUAL FIREBASE CREATE LOGIC !!! ---
      const newPost: Post = {
        id: `mock-${Date.now()}`, // Generate temporary ID or get from Firebase
        authorId: user.uid,
        authorName: user.displayName || user.email || 'Unknown Author',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data,
      };
      setPosts(prevPosts => [newPost, ...prevPosts]); // Optimistic update
      // Example: await addDoc(collection(db, "posts"), newPostData);
      // ---
    } else if (type === 'edit' && originalPostId) {
      console.log("Attempting to EDIT post (after re-auth):", originalPostId, data);
      // --- !!! REPLACE WITH ACTUAL FIREBASE UPDATE LOGIC !!! ---
      setPosts(prevPosts =>
        prevPosts.map(p =>
          p.id === originalPostId
            ? { ...p, ...data, updatedAt: new Date().toISOString() }
            : p
        )
      ); // Optimistic update
      // Example: await updateDoc(doc(db, "posts", originalPostId), updatedPostData);
      // ---
    }
    setPendingAction(null); // Clear pending action
  };

  const handleReauthConfirm = async (email: string, password: string) => {
    if (!user) {
      setReauthError("User not available. Please sign in again.");
      return;
    }
    setIsReauthProcessing(true);
    setReauthError(null);
    try {
      const credential = EmailAuthProvider.credential(email, password);
      await reauthenticateWithCredential(user, credential);
      console.log("Re-authentication successful for post action.");
      setIsReauthModalOpen(false); // Close re-auth modal
      await executePostAction(); // Proceed with the original action
    } catch (error: any) {
      console.error("Re-authentication failed:", error);
      setReauthError(error.message || "Failed to re-authenticate. Check credentials.");
    } finally {
      setIsReauthProcessing(false);
    }
  };


  return (
    <Layout>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-900">Community Posts</h1>
          {user && ( // Only show create button if user is logged in (or add other permission checks)
            <button
              onClick={openCreatePostModal}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out flex items-center"
            >
              <PlusCircle size={20} className="mr-2" /> Create Post
            </button>
          )}
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <img src="/placeholder-no-posts.svg" alt="No posts found" className="mx-auto h-40 mb-6 text-gray-400" />
            <p className="text-xl text-gray-500">No posts yet.</p>
            {user && <p className="text-gray-500 mt-2">Be the first to share something!</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={user}
                onEdit={openEditPostModal}
              />
            ))}
          </div>
        )}
      </div>

      <PostFormModal
        isOpen={isPostFormModalOpen}
        onClose={closePostFormModal}
        onSubmit={handlePostFormSubmit} // This now triggers re-auth
        initialData={editingPost ? { title: editingPost.title, content: editingPost.content, imageUrl: editingPost.imageUrl } : null}
        isSaving={isReauthProcessing || (pendingAction !== null)} // Show saving if re-auth is processing or action is pending
      />

      <ReauthenticationModal
        isOpen={isReauthModalOpen}
        onClose={() => {
            setIsReauthModalOpen(false);
            setPendingAction(null); // Clear pending action if re-auth is cancelled
        }}
        onConfirm={handleReauthConfirm}
        actionName={pendingAction?.type === 'create' ? 'create this post' : 'save these changes'}
        isProcessing={isReauthProcessing}
        error={reauthError}
        defaultEmail={user?.email || ''}
      />
    </Layout>
  );
};

export default Home;